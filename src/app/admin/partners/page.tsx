export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { AdminPartnersManager } from "@/components/admin/partners-manager";

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="container py-8">
      <AdminPartnersManager initial={partners.map((p) => ({ id: p.id, name: p.name, logo: p.logo, url: p.url, order: p.order }))} />
    </div>
  );
}
