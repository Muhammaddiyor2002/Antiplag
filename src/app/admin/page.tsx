export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Crown, Mail } from "lucide-react";

export default async function AdminDashboard() {
  const [usersCount, checksCount, paymentsAgg, contactsCount, plansAgg, recentChecks] = await Promise.all([
    prisma.user.count(),
    prisma.check.count(),
    prisma.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.user.groupBy({ by: ["plan"], _count: true }),
    prisma.check.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const planCounts: Record<string, number> = { FREE: 0, STANDARD: 0, PREMIUM: 0 };
  plansAgg.forEach((p) => { planCounts[p.plan] = p._count; });

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Users className="h-5 w-5" />} label="Foydalanuvchilar" value={usersCount.toString()} />
        <Stat icon={<FileText className="h-5 w-5" />} label="Tekshirishlar" value={checksCount.toString()} />
        <Stat icon={<Crown className="h-5 w-5" />} label="Daromad (UZS)" value={(paymentsAgg._sum.amount ?? 0).toLocaleString()} />
        <Stat icon={<Mail className="h-5 w-5" />} label="Yangi xabarlar" value={contactsCount.toString()} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(["FREE", "STANDARD", "PREMIUM"] as const).map((p) => (
          <Card key={p}>
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">{p}</div>
              <div className="mt-1 text-2xl font-bold">{planCounts[p] ?? 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Oxirgi tekshirishlar</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentChecks.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{c.fileName}</div>
                  <div className="text-xs text-muted-foreground">{c.user?.email} · {new Date(c.createdAt).toLocaleString("uz-UZ")}</div>
                </div>
                <div className="text-sm">
                  Plagiat: <strong>{c.plagiarismPct?.toFixed(0) ?? "—"}%</strong> · AI: <strong>{c.aiPct?.toFixed(0) ?? "—"}%</strong>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-primary">{icon}</span>
        </div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
