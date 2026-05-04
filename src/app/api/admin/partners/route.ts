export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ partners });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const body = await req.json();
  if (!body.name || !body.logo) return NextResponse.json({ message: "Bad input" }, { status: 400 });
  const item = await prisma.partner.create({
    data: { name: body.name, logo: body.logo, url: body.url || null, order: body.order ?? 0 },
  });
  return NextResponse.json({ item }, { status: 201 });
}
