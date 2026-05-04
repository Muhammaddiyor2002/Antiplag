export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const body = await req.json();
  const item = await prisma.news.update({
    where: { id: params.id },
    data: {
      title: body.title,
      slug: body.slug,
      content: body.content,
      published: body.published ?? false,
    },
  });
  return NextResponse.json({ item });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  await prisma.news.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
