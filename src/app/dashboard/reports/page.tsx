export const dynamic = "force-dynamic";

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, originalityFromPlagiarism, pctColor } from "@/lib/utils";
import { Download } from "lucide-react";

export default async function ReportsListPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const checks = await prisma.check.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Mening hisobotlarim</CardTitle>
        </CardHeader>
        <CardContent>
          {checks.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">Hali hisobotlar yo'q</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hujjat</TableHead>
                    <TableHead>Sana</TableHead>
                    <TableHead>Tur</TableHead>
                    <TableHead>So'zlar</TableHead>
                    <TableHead>Originallik</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checks.map((c) => {
                    const orig = c.plagiarismPct === null ? null : originalityFromPlagiarism(c.plagiarismPct);
                    const color = c.plagiarismPct === null ? "secondary" : pctColor(c.plagiarismPct);
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium max-w-[260px] truncate">
                          <Link href={`/dashboard/reports/${c.id}`} className="hover:underline">
                            {c.fileName}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDateTime(c.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{c.type === "PLAGIARISM" ? "Plagiat" : "AI"}</Badge>
                        </TableCell>
                        <TableCell>{c.wordCount}</TableCell>
                        <TableCell>
                          <Badge variant={color === "secondary" ? "secondary" : color}>
                            {orig === null ? "—" : `${Math.round(orig)}%`}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="outline">
                            <a href={`/api/checks/${c.id}/pdf`} target="_blank" rel="noreferrer">
                              <Download className="h-4 w-4" /> PDF
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
