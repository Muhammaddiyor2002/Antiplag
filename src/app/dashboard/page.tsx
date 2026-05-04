export const dynamic = "force-dynamic";

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, BarChart3, Sparkles, Crown } from "lucide-react";
import { formatDateTime, originalityFromPlagiarism, pctColor } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const [user, recent, agg] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.check.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.check.aggregate({
      where: { userId: session.user.id, status: "COMPLETED" },
      _avg: { plagiarismPct: true },
      _count: true,
    }),
  ]);

  const avgOriginality = agg._avg.plagiarismPct === null ? null : 100 - (agg._avg.plagiarismPct ?? 0);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Salom, {session.user.name?.split(" ")[0] ?? "Foydalanuvchi"}</h1>
          <p className="text-muted-foreground">Bugungi tahlilingizni boshlang</p>
        </div>
        <Button asChild variant="gradient" size="lg">
          <Link href="/dashboard/check"><Plus className="h-4 w-4" /> Yangi tekshirish</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Jami tekshirishlar"
          value={agg._count.toString()}
        />
        <StatCard
          icon={<BarChart3 className="h-5 w-5" />}
          label="O'rtacha originallik"
          value={avgOriginality === null ? "—" : `${Math.round(avgOriginality)}%`}
        />
        <StatCard
          icon={<Sparkles className="h-5 w-5" />}
          label="Qolgan tekshirishlar"
          value={user?.plan === "PREMIUM" ? "∞" : (user?.checksLeft ?? 0).toString()}
        />
        <StatCard
          icon={<Crown className="h-5 w-5" />}
          label="Joriy tarif"
          value={user?.plan ?? "FREE"}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Oxirgi tekshirishlar</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/reports">Barchasi</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto" />
              <p className="mt-3">Hali tekshirishlar yo'q</p>
              <Button asChild variant="gradient" className="mt-4">
                <Link href="/dashboard/check">Birinchi tekshirishni boshlang</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((c) => {
                const orig = c.plagiarismPct === null ? null : originalityFromPlagiarism(c.plagiarismPct);
                const color = c.plagiarismPct === null ? "secondary" : pctColor(c.plagiarismPct);
                return (
                  <Link
                    href={`/dashboard/reports/${c.id}`}
                    key={c.id}
                    className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-accent transition"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{c.fileName}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {formatDateTime(c.createdAt)} · {c.wordCount} so'z
                      </div>
                    </div>
                    <div className="hidden sm:block w-32">
                      <Progress
                        value={orig ?? 0}
                        indicatorClassName={
                          color === "success" ? "bg-emerald-500" : color === "warning" ? "bg-amber-500" : "bg-red-500"
                        }
                      />
                    </div>
                    <Badge variant={color === "secondary" ? "secondary" : color}>
                      {orig === null ? "—" : `${Math.round(orig)}%`}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
