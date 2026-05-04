export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const check = await prisma.check.findUnique({
    where: { id: params.id },
    include: { sources: true, user: { select: { id: true, name: true } } },
  });
  if (!check) return NextResponse.json({ message: "Not found" }, { status: 404 });
  if (check.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ check });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const check = await prisma.check.findUnique({ where: { id: params.id } });
  if (!check) return NextResponse.json({ message: "Not found" }, { status: 404 });
  if (check.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  await prisma.check.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
