"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Brain, FileBarChart2, Search, Globe2 } from "lucide-react";

const ICONS = [Brain, FileBarChart2, Search, Globe2];

export function Ecosystem() {
  const t = useTranslations("home.ecosystem");
  const cards = [1, 2, 3, 4].map((i) => ({
    title: t(`card${i}Title`),
    text: t(`card${i}Text`),
    Icon: ICONS[i - 1],
  }));
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("title")}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border bg-background p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white shrink-0">
                  <c.Icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-semibold">{c.title}</h3>
              </div>
              <p className="text-muted-foreground mt-3">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
