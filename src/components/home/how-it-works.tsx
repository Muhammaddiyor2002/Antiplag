"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Upload, Search, FileBarChart, Download } from "lucide-react";

const ICONS = [Upload, Search, FileBarChart, Download];

export function HowItWorks() {
  const t = useTranslations("home.howItWorks");
  const steps = [1, 2, 3, 4].map((i) => ({
    title: t(`step${i}Title`),
    text: t(`step${i}Text`),
    Icon: ICONS[i - 1],
    n: i,
  }));

  return (
    <section className="container py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("title")}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative"
          >
            <div className="rounded-2xl border bg-card p-6 h-full">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-white">
                  <s.Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-muted-foreground">0{s.n}</span>
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
