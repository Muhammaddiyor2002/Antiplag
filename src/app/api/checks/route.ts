export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { extractTextFromBuffer, cleanText, countWords } from "@/lib/parser";
import { checkPlagiarism } from "@/lib/plagiarism";
import { detectAi } from "@/lib/ai-detector";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { promises as fs } from "fs";
import path from "path";

type SourceCreate = Prisma.SourceCreateWithoutCheckInput;

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const checks = await prisma.check.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      fileName: true,
      type: true,
      status: true,
      plagiarismPct: true,
      aiPct: true,
      wordCount: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ checks });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Atomic decrement before any work — prevents TOCTOU race where multiple
  // concurrent requests all pass the limit check before any decrement runs.
  // PREMIUM plan is unlimited (no decrement). FREE/STANDARD must have checksLeft > 0.
  let creditConsumed = false;
  if (user.plan !== "PREMIUM") {
    const updated = await prisma.user.updateMany({
      where: { id: user.id, plan: { not: "PREMIUM" }, checksLeft: { gt: 0 } },
      data: { checksLeft: { decrement: 1 } },
    });
    if (updated.count === 0) {
      return NextResponse.json({ message: "Limit tugadi. Tarifni yangilang" }, { status: 403 });
    }
    creditConsumed = true;
  }

  // Refund the credit if we early-return after consumption.
  const refund = async () => {
    if (creditConsumed) {
      await prisma.user.update({ where: { id: user.id }, data: { checksLeft: { increment: 1 } } });
      creditConsumed = false;
    }
  };

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const text = formData.get("text") as string | null;
  const type = (formData.get("type") as string | null) ?? "PLAGIARISM";
  const customFileName = formData.get("fileName") as string | null;
  const customFileSizeStr = formData.get("fileSize") as string | null;

  let textContent = "";
  let fileName = "";
  let fileSize = 0;
  let fileUrl = "";

  if (file && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) {
      await refund();
      return NextResponse.json({ message: "Fayl 10 MB dan katta" }, { status: 413 });
    }
    const ext = `.${file.name.toLowerCase().split(".").pop() ?? ""}`;
    if (!ALLOWED_FILE_TYPES.includes(ext as (typeof ALLOWED_FILE_TYPES)[number])) {
      await refund();
      return NextResponse.json({ message: "Qo'llab-quvvatlanmaydigan format" }, { status: 415 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    fileName = file.name;
    fileSize = file.size;
    try {
      await ensureUploadDir();
      const safeName = `${Date.now()}-${file.name.replace(/[^A-Za-z0-9._-]/g, "_")}`;
      const filePath = path.join(UPLOAD_DIR, safeName);
      await fs.writeFile(filePath, buffer);
      fileUrl = `/uploads/${safeName}`;
    } catch {
      // Ephemeral fallback (e.g. Vercel serverless environment)
      fileUrl = "";
    }
    try {
      textContent = await extractTextFromBuffer(file.name, buffer);
    } catch (e) {
      await refund();
      return NextResponse.json(
        { message: e instanceof Error ? e.message : "Faylni o'qib bo'lmadi" },
        { status: 422 }
      );
    }
  } else if (text && text.trim()) {
    textContent = text;
    fileName = customFileName || "Yopishtirilgan matn";
    const parsedSize = customFileSizeStr ? parseInt(customFileSizeStr, 10) : 0;
    fileSize = parsedSize || Buffer.byteLength(text, "utf-8");
  } else {
    await refund();
    return NextResponse.json({ message: "Fayl yoki matn yuboring" }, { status: 400 });
  }

  textContent = cleanText(textContent);
  const wordCount = countWords(textContent);
  if (wordCount < 30) {
    await refund();
    return NextResponse.json({ message: "Kamida 30 so'z kerak" }, { status: 400 });
  }

  // Run analysis
  let plagiarismPct: number | null = null;
  let aiPct: number | null = null;
  let highlights: object | null = null;
  let sourcesData: SourceCreate[] = [];

  const toSource = (s: { title: string; url?: string; matchPct: number; snippets?: unknown }): SourceCreate => ({
    title: s.title,
    url: s.url ?? null,
    matchPct: s.matchPct,
    snippets: s.snippets ? (s.snippets as Prisma.InputJsonValue) : Prisma.JsonNull,
  });

  if (type === "PLAGIARISM") {
    const plag = await checkPlagiarism(textContent);
    plagiarismPct = plag.plagiarismPct;
    highlights = { plag: plag.highlights, sentences: plag.sentences };
    sourcesData = plag.sources.map(toSource);
    const ai = await detectAi(textContent);
    aiPct = ai.aiPct;
  } else {
    const ai = await detectAi(textContent);
    aiPct = ai.aiPct;
    highlights = { ai: ai.highlights, paragraphs: ai.paragraphs };
    const plag = await checkPlagiarism(textContent);
    plagiarismPct = plag.plagiarismPct;
    sourcesData = plag.sources.slice(0, 5).map(toSource);
  }

  const check = await prisma.check.create({
    data: {
      userId: user.id,
      fileName,
      fileUrl,
      fileSize,
      textContent,
      wordCount,
      type: type === "AI_DETECTION" ? "AI_DETECTION" : "PLAGIARISM",
      status: "COMPLETED",
      plagiarismPct,
      aiPct,
      highlights: (highlights ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      sources: { create: sourcesData },
    },
  });

  // checksLeft was atomically decremented above before any work; nothing to do here.

  return NextResponse.json({ id: check.id }, { status: 201 });
}
