export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ReportView } from "@/components/dashboard/report-view";

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const check = await prisma.check.findUnique({
    where: { id: params.id },
    include: { sources: true },
  });
  if (!check) notFound();
  if (check.userId !== session.user.id && session.user.role !== "ADMIN") notFound();

  return (
    <ReportView
      check={{
        id: check.id,
        fileName: check.fileName,
        type: check.type,
        wordCount: check.wordCount,
        plagiarismPct: check.plagiarismPct,
        aiPct: check.aiPct,
        createdAt: check.createdAt.toISOString(),
        textContent: check.textContent,
        sources: check.sources.map((s) => ({ id: s.id, title: s.title, url: s.url, matchPct: s.matchPct })),
        highlights: (check.highlights as object | null) as never,
      }}
    />
  );
}
