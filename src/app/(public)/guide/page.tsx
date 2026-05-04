import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileText, FilePlus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Qo'llanma" };

const STEPS = [
  {
    Icon: FilePlus,
    title: "1. Ro'yxatdan o'tish",
    text: "Email yoki telefon raqamingiz orqali ro'yxatdan o'ting. Telegram yoki Google orqali ham kira olasiz.",
  },
  {
    Icon: FileText,
    title: "2. Hujjat yuklash",
    text: "Dashboard'da \"Yangi tekshirish\" tugmasini bosing. .doc, .docx, .pdf, .txt fayllar yoki matnni joylashtiring.",
  },
  {
    Icon: BarChart3,
    title: "3. Tahlil natijasi",
    text: "Tizim matnni tezkor tahlil qiladi. Plagiat foizi, AI matn foizi va manbalar ro'yxatini ko'rasiz.",
  },
  {
    Icon: CheckCircle2,
    title: "4. PDF hisobot",
    text: "Hisobotni PDF ko'rinishida yuklab oling yoki link orqali ulashing.",
  },
];

export default function GuidePage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">Foydalanuvchilar uchun qo'llanma</h1>
        <p className="mt-4 text-muted-foreground">Bosqichma-bosqich tizimdan to'liq foydalanishni o'rganing.</p>
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <ol className="space-y-6">
          {STEPS.map((s) => (
            <li key={s.title} className="flex gap-4 rounded-2xl border bg-card p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white shrink-0">
                <s.Icon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-semibold">{s.title}</h2>
                <p className="text-muted-foreground mt-2">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl border bg-muted/40 p-6 text-center">
          <h3 className="text-xl font-semibold">Tayyormisiz?</h3>
          <p className="text-muted-foreground mt-2">Endi birinchi tekshirishingizni bepul boshlang.</p>
          <Button asChild className="mt-4" variant="gradient" size="lg">
            <Link href="/dashboard/check">Yangi tekshirish</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
