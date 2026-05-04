export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { renderToBuffer } from "@react-pdf/renderer";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ReportDocument } from "@/components/pdf/report-document";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const check = await prisma.check.findUnique({
    where: { id: params.id },
    include: { sources: true, user: { select: { name: true } } },
  });
  if (!check) return NextResponse.json({ message: "Not found" }, { status: 404 });
  if (check.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const pdfBuffer = await renderToBuffer(
    ReportDocument({
      data: {
        id: check.id,
        fileName: check.fileName,
        wordCount: check.wordCount,
        plagiarismPct: check.plagiarismPct,
        aiPct: check.aiPct,
        type: check.type,
        createdAt: check.createdAt.toISOString(),
        textContent: check.textContent,
        sources: check.sources.map((s) => ({ title: s.title, url: s.url, matchPct: s.matchPct })),
        user: check.user ? { name: check.user.name } : undefined,
      },
    })
  );

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="antiplag-report-${check.id}.pdf"`,
    },
  });
}
