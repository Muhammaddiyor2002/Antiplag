export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const news = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ news });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const body = await req.json();
  if (!body.title || !body.content) return NextResponse.json({ message: "Bad input" }, { status: 400 });
  const item = await prisma.news.create({
    data: {
      title: body.title,
      titleRu: body.titleRu ?? null,
      titleEn: body.titleEn ?? null,
      slug: body.slug,
      content: body.content,
      contentRu: body.contentRu ?? null,
      contentEn: body.contentEn ?? null,
      image: body.image ?? null,
      published: body.published ?? false,
    },
  });
  return NextResponse.json({ item }, { status: 201 });
}
