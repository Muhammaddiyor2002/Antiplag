export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminChecksPage() {
  const checks = await prisma.check.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { name: true, email: true } } },
  });
  return (
    <div className="container py-8">
      <Card>
        <CardHeader><CardTitle>Tekshirishlar jurnali ({checks.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hujjat</TableHead>
                  <TableHead>Foydalanuvchi</TableHead>
                  <TableHead>Tur</TableHead>
                  <TableHead>Plagiat</TableHead>
                  <TableHead>AI</TableHead>
                  <TableHead>Sana</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checks.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="max-w-[260px] truncate">
                      <Link href={`/dashboard/reports/${c.id}`} className="hover:underline">{c.fileName}</Link>
                    </TableCell>
                    <TableCell>
                      <div>{c.user?.name}</div>
                      <div className="text-xs text-muted-foreground">{c.user?.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{c.type === "PLAGIARISM" ? "Plagiat" : "AI"}</Badge>
                    </TableCell>
                    <TableCell>{c.plagiarismPct?.toFixed(0) ?? "—"}%</TableCell>
                    <TableCell>{c.aiPct?.toFixed(0) ?? "—"}%</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(c.createdAt).toLocaleString("uz-UZ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
