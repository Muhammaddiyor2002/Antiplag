import type { Metadata } from "next";
import { PricingSection } from "@/components/home/pricing-section";
import { Check, X } from "lucide-react";

export const metadata: Metadata = { title: "Narxlar" };

const COMPARE = [
  { feature: "Plagiat tekshirish", free: true, standard: true, premium: true },
  { feature: "AI Detektor", free: false, standard: true, premium: true },
  { feature: "PDF hisobot", free: true, standard: true, premium: true },
  { feature: "Tarix saqlash", free: "30 kun", standard: "12 oy", premium: "Cheksiz" },
  { feature: "Maksimal fayl hajmi", free: "5 MB", standard: "10 MB", premium: "25 MB" },
  { feature: "Kunlik tekshirishlar", free: "3", standard: "10", premium: "Cheksiz" },
  { feature: "Oylik tekshirishlar", free: "—", standard: "50", premium: "Cheksiz" },
  { feature: "Ustuvor qo'llab-quvvatlash", free: false, standard: true, premium: true },
  { feature: "API integratsiya", free: false, standard: false, premium: true },
];

export default function PricingPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">Tarif rejalari</h1>
        <p className="mt-4 text-muted-foreground">O'zingizga mos rejani tanlang. Istalgan vaqtda yangilashingiz mumkin.</p>
      </div>

      <PricingSection compact />

      <section className="mt-20 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Tariflar taqqoslash</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 font-semibold">Xususiyat</th>
                <th className="p-4 font-semibold">Bepul</th>
                <th className="p-4 font-semibold text-primary">Standart</th>
                <th className="p-4 font-semibold">Premium</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr key={row.feature} className="border-b last:border-0">
                  <td className="p-4">{row.feature}</td>
                  {(["free", "standard", "premium"] as const).map((k) => {
                    const v = row[k];
                    return (
                      <td key={k} className="p-4 text-center">
                        {typeof v === "boolean" ? (
                          v ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span>{v}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
