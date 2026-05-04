export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const [users, checks, plansAgg, contactsCount] = await Promise.all([
    prisma.user.count(),
    prisma.check.count(),
    prisma.user.groupBy({ by: ["plan"], _count: true }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);
  return NextResponse.json({ users, checks, plans: plansAgg, contacts: contactsCount });
}
