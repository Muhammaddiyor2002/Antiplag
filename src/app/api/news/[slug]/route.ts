export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const item = await prisma.news.findUnique({ where: { slug: params.slug } });
  if (!item || !item.published) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}
