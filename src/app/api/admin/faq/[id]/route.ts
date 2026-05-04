export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const body = await req.json();
  const item = await prisma.faq.update({
    where: { id: params.id },
    data: { question: body.question, answer: body.answer, order: body.order ?? 0 },
  });
  return NextResponse.json({ item });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  await prisma.faq.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
