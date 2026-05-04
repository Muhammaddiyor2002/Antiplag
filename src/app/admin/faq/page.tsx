export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { AdminFaqManager } from "@/components/admin/faq-manager";

export default async function AdminFaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="container py-8">
      <AdminFaqManager initial={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer, order: f.order }))} />
    </div>
  );
}
