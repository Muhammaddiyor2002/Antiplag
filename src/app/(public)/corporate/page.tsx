import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Building2, Users, Code2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Tashkilotlar uchun" };

const FEATURES = [
  { Icon: Building2, title: "Korporativ akkountlar", text: "Bir tashkilot ostida cheksiz foydalanuvchilar" },
  { Icon: Users, title: "Jamoa boshqaruvi", text: "Foydalanuvchilarni guruhlash, rollar va statistikani boshqarish" },
  { Icon: ShieldCheck, title: "Maxfiylik kafolati", text: "Hujjatlaringiz hech qachon tashqi bazalarga ko'chirilmaydi" },
  { Icon: Code2, title: "API integratsiya", text: "Sizning LMS yoki CRM tizimingiz bilan to'g'ridan-to'g'ri bog'lanish" },
];

export default function CorporatePage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <Briefcase className="h-12 w-12 text-primary mx-auto" />
        <h1 className="mt-4 text-4xl md:text-5xl font-bold gradient-text">Tashkilotlar uchun</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Universitetlar, ilmiy-tadqiqot institutlari va xususiy korxonalar uchun maxsus tarif va integratsiya imkoniyatlari.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mt-16">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border bg-card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-white">
              <f.Icon className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-semibold mt-3">{f.title}</h2>
            <p className="text-muted-foreground mt-2">{f.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl gradient-primary text-white p-8 md:p-12 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold">Maxsus taklifimizni oling</h2>
        <p className="mt-3 opacity-90">Tashkilotingizning hajmi va ehtiyojlariga mos taklif tayyorlaymiz.</p>
        <Button asChild size="lg" className="mt-5 bg-white text-primary hover:bg-white/90">
          <Link href="/contact">Bog'lanish</Link>
        </Button>
      </div>
    </div>
  );
}
