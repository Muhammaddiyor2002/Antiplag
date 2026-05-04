export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const [user, payments] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.payment.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="container py-8 space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Joriy tarif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="default" className="text-base px-3 py-1">{user?.plan ?? "FREE"}</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Qolgan tekshirishlar: {user?.plan === "PREMIUM" ? "cheksiz" : user?.checksLeft ?? 0}
              </p>
            </div>
            <Button asChild variant="gradient">
              <Link href="/pricing">Tarifni yangilash</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>To'lovlar tarixi</CardTitle></CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">Hali to'lovlar yo'q</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Tarif</TableHead>
                  <TableHead>Summa</TableHead>
                  <TableHead>Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{formatDateTime(p.createdAt)}</TableCell>
                    <TableCell>{p.plan}</TableCell>
                    <TableCell>{p.amount.toLocaleString()} UZS</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "COMPLETED" ? "success" : p.status === "PENDING" ? "warning" : "danger"}>
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
