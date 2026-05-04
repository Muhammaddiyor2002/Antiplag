export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const body = await req.json();
  const user = await prisma.user.update({
    where: { id: params.id },
    data: {
      role: body.role,
      plan: body.plan,
      checksLeft: typeof body.checksLeft === "number" ? body.checksLeft : undefined,
    },
    select: { id: true, role: true, plan: true, checksLeft: true },
  });
  return NextResponse.json({ user });
}
