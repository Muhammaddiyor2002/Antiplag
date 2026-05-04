"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingSection({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("plans");
  const tHome = useTranslations("home.pricing");

  const plans = [
    {
      key: "free",
      title: t("free"),
      price: "0",
      currency: "UZS",
      sub: t("free_perDay"),
      features: [t("feature_pdf"), t("feature_history")],
      cta: t("select"),
      highlight: false,
    },
    {
      key: "standard",
      title: t("standard"),
      price: "99 000",
      currency: "UZS",
      sub: t("standard_perMonth"),
      features: [t("feature_pdf"), t("feature_history"), t("feature_ai"), t("feature_priority")],
      cta: t("select"),
      highlight: true,
    },
    {
      key: "premium",
      title: t("premium"),
      price: "299 000",
      currency: "UZS",
      sub: t("premium_unlimited"),
      features: [t("feature_pdf"), t("feature_history"), t("feature_ai"), t("feature_priority"), t("feature_api")],
      cta: t("select"),
      highlight: false,
    },
  ];

  return (
    <section className={cn("py-16 md:py-24", !compact && "container")}>
      {!compact ? (
        <>
          <h2 className="text-3xl md:text-4xl font-bold text-center">{tHome("title")}</h2>
          <p className="text-center text-muted-foreground mt-2">{tHome("subtitle")}</p>
        </>
      ) : null}
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mt-10">
        {plans.map((p) => (
          <div
            key={p.key}
            className={cn(
              "rounded-2xl border bg-card p-6 flex flex-col",
              p.highlight && "border-primary shadow-lg ring-2 ring-primary/30"
            )}
          >
            {p.highlight ? (
              <span className="self-start rounded-full bg-primary text-primary-foreground text-xs font-medium px-3 py-1 mb-2">
                Eng mashhur
              </span>
            ) : null}
            <h3 className="text-2xl font-bold">{p.title}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.currency} {t("perMonth")}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{p.sub}</p>
            <ul className="mt-6 space-y-2 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6" variant={p.highlight ? "gradient" : "outline"}>
              <Link href="/register">{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
