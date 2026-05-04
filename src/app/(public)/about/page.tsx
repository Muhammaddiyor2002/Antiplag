import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Award, Target, Users, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Biz haqimizda",
  description: "AntiPlag jamoasi va missiyamiz haqida ma'lumot",
};

export default function AboutPage() {
  const t = useTranslations("home.about");
  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">{t("title")}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{t("text")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mt-16">
        {[
          { Icon: Users, value: "12 000+", label: "Ro'yxatdan o'tgan foydalanuvchilar" },
          { Icon: BookOpen, value: "85 000+", label: "Tekshirilgan hujjatlar" },
          { Icon: Award, value: "42+", label: "Hamkor tashkilotlar" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-6 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white">
              <s.Icon className="h-6 w-6" />
            </span>
            <div className="mt-3 text-3xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="mt-20 grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        <div className="rounded-2xl border bg-card p-8">
          <Target className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold mt-3">Bizning missiyamiz</h2>
          <p className="text-muted-foreground mt-3">
            Akademik halollik va ilmiy ishlarning originalligini O'zbekistonda yangi darajaga olib chiqish — har bir
            talaba va olim uchun zamonaviy texnologiyalar orqali ishonchli vosita yaratish.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-8">
          <Award className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold mt-3">Bizning qadriyatlarimiz</h2>
          <ul className="text-muted-foreground mt-3 space-y-2">
            <li>• Aniqlik va halollik</li>
            <li>• Foydalanuvchining maxfiyligi</li>
            <li>• Doimiy yangilanish va sun'iy intellekt yutuqlarini joriy etish</li>
            <li>• Mahalliy ta'lim ekosistemasini qo'llab-quvvatlash</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
