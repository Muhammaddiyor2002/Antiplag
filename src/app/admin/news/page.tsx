export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { AdminNewsManager } from "@/components/admin/news-manager";

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="container py-8">
      <AdminNewsManager initial={news.map((n) => ({
        id: n.id,
        title: n.title,
        slug: n.slug,
        content: n.content,
        published: n.published,
        createdAt: n.createdAt.toISOString(),
      }))} />
    </div>
  );
}
