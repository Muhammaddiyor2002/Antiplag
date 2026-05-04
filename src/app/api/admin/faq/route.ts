export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ faqs });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const body = await req.json();
  if (!body.question || !body.answer) return NextResponse.json({ message: "Bad input" }, { status: 400 });
  const item = await prisma.faq.create({
    data: { question: body.question, answer: body.answer, order: body.order ?? 0 },
  });
  return NextResponse.json({ item }, { status: 201 });
}
