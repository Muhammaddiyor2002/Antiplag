"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export function Newsletter() {
  const t = useTranslations("home.newsletter");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email noto'g'ri");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success(t("success"));
    setEmail("");
    setLoading(false);
  }
  return (
    <section className="container py-16">
      <div className="rounded-3xl gradient-primary text-white p-8 md:p-12 text-center max-w-4xl mx-auto">
        <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-90" />
        <h2 className="text-3xl md:text-4xl font-bold">{t("title")}</h2>
        <p className="mt-3 opacity-90 max-w-xl mx-auto">{t("subtitle")}</p>
        <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("placeholder")}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/70"
          />
          <Button type="submit" disabled={loading} className="bg-white text-primary hover:bg-white/90">
            {t("subscribe")}
          </Button>
        </form>
      </div>
    </section>
  );
}
