export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Savol-javoblar",
  description: "AntiPlag bo'yicha tez-tez so'raladigan savollar va javoblar",
};

export const revalidate = 60;

export default async function FaqPage() {
  const cookieLocale = cookies().get("locale")?.value ?? "uz";
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });

  function pickQ(f: (typeof faqs)[number]) {
    if (cookieLocale === "ru" && f.questionRu) return f.questionRu;
    if (cookieLocale === "en" && f.questionEn) return f.questionEn;
    return f.question;
  }
  function pickA(f: (typeof faqs)[number]) {
    if (cookieLocale === "ru" && f.answerRu) return f.answerRu;
    if (cookieLocale === "en" && f.answerEn) return f.answerEn;
    return f.answer;
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">Savol-javoblar</h1>
        <p className="mt-4 text-muted-foreground">Foydalanuvchilarimiz tomonidan tez-tez so'raladigan savollar</p>
      </div>
      <div className="max-w-3xl mx-auto mt-12 rounded-2xl border bg-card p-6 md:p-8">
        {faqs.length === 0 ? (
          <p className="text-center text-muted-foreground">Hali savollar yo'q</p>
        ) : (
          <Accordion type="single" collapsible>
            {faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger>{pickQ(f)}</AccordionTrigger>
                <AccordionContent>{pickA(f)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
