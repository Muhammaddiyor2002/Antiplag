export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await prisma.news.findUnique({ where: { slug: params.slug } });
  if (!item) return { title: "Yangilik topilmadi" };
  return {
    title: item.title,
    description: item.content.slice(0, 160),
    openGraph: { title: item.title, description: item.content.slice(0, 160), images: item.image ? [item.image] : [] },
  };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const locale = cookies().get("locale")?.value ?? "uz";
  const item = await prisma.news.findUnique({ where: { slug: params.slug } });
  if (!item || !item.published) notFound();

  const title = locale === "ru" && item.titleRu ? item.titleRu : locale === "en" && item.titleEn ? item.titleEn : item.title;
  const content =
    locale === "ru" && item.contentRu ? item.contentRu : locale === "en" && item.contentEn ? item.contentEn : item.content;

  return (
    <article className="container py-12 md:py-16 max-w-3xl">
      <Link href="/news" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Yangiliklar ro'yxati
      </Link>
      <div className="text-sm text-muted-foreground">{formatDate(item.createdAt, locale)}</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
      {item.image ? (
        <div className="relative aspect-video mt-6 rounded-2xl overflow-hidden bg-muted">
          <Image src={item.image} alt={title} fill className="object-cover" unoptimized />
        </div>
      ) : null}
      <div className="prose prose-lg dark:prose-invert mt-6 max-w-none whitespace-pre-line">{content}</div>
    </article>
  );
}
