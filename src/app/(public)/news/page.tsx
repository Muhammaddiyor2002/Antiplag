export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { formatDate, truncate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Newspaper } from "lucide-react";

export const metadata: Metadata = { title: "Yangiliklar" };
export const revalidate = 60;

export default async function NewsListPage() {
  const locale = cookies().get("locale")?.value ?? "uz";
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  function title(n: (typeof news)[number]) {
    if (locale === "ru" && n.titleRu) return n.titleRu;
    if (locale === "en" && n.titleEn) return n.titleEn;
    return n.title;
  }
  function content(n: (typeof news)[number]) {
    if (locale === "ru" && n.contentRu) return n.contentRu;
    if (locale === "en" && n.contentEn) return n.contentEn;
    return n.content;
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">Yangiliklar</h1>
        <p className="text-muted-foreground mt-4">AntiPlag platformasi yangiliklari va e'lonlar</p>
      </div>

      {news.length === 0 ? (
        <div className="mt-16 text-center">
          <Newspaper className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="mt-4 text-muted-foreground">Hali yangiliklar yo'q</p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <Link key={n.id} href={`/news/${n.slug}`} className="group">
              <Card className="overflow-hidden h-full hover:shadow-md transition">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {n.image ? (
                    <Image src={n.image} alt={title(n)} fill className="object-cover group-hover:scale-105 transition" unoptimized />
                  ) : (
                    <div className="absolute inset-0 gradient-primary opacity-30" />
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="text-xs text-muted-foreground">{formatDate(n.createdAt, locale)}</div>
                  <h3 className="font-semibold text-lg mt-2 group-hover:text-primary transition line-clamp-2">{title(n)}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{truncate(content(n), 140)}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-sm text-primary">
                    Batafsil <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
