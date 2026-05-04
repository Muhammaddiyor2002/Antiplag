"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

export function AboutSection() {
  const t = useTranslations("home.about");
  return (
    <section className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center">{t("title")}</h2>
        <Card className="mt-8 max-w-4xl mx-auto">
          <CardContent className="p-8 text-center text-muted-foreground text-lg leading-relaxed">
            {t("text")}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
