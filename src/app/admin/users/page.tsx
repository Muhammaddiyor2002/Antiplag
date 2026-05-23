export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { AdminUsersManager } from "@/components/admin/users-manager";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      plan: true,
      checksLeft: true,
      createdAt: true,
      _count: { select: { checks: true } },
    },
  });

  const formattedUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="container py-8">
      <AdminUsersManager initial={formattedUsers} />
    </div>
  );
}
