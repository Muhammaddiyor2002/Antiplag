export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { promises as fs } from "fs";
import path from "path";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return NextResponse.json({ message: "Fayl yo'q" }, { status: 400 });
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ message: "Maks 2 MB" }, { status: 413 });
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    return NextResponse.json({ message: "Faqat png/jpeg/webp" }, { status: 415 });
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type.split("/")[1];
  const safeName = `avatar-${session.user.id}-${Date.now()}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, safeName);
  await fs.writeFile(filePath, buffer);
  const url = `/uploads/${safeName}`;
  await prisma.user.update({ where: { id: session.user.id }, data: { avatar: url } });
  return NextResponse.json({ url });
}
