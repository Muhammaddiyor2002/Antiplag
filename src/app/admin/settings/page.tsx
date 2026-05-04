export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { AdminSettings } from "@/components/admin/settings";

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;
  return (
    <div className="container py-8">
      <AdminSettings initial={map} />
    </div>
  );
}
