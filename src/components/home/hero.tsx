"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("home");
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-20 -right-20 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-40 -left-20 -z-10 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="container py-16 md:py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered plagiat tahlil
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="gradient-text">{t("heroTitle")}</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">{t("heroSubtitle")}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="gradient" className="text-base">
              <Link href="/dashboard/check">
                <FileText className="h-5 w-5" /> {t("checkPlagiarism")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <Link href="/dashboard/check?type=ai">
                <Sparkles className="h-5 w-5" /> {t("aiDetector")}
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            <div>
              <div className="text-2xl md:text-3xl font-bold">12K+</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{t("stats.users")}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">85K+</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{t("stats.checks")}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">42+</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{t("stats.partners")}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
