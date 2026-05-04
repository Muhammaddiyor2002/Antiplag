"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const t = useTranslations("home.contact");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      toast.success(t("success"));
      reset();
    } catch {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-1">
        <Label htmlFor="contact-name">{t("name")}</Label>
        <Input id="contact-name" {...register("name")} placeholder="Ali Valiyev" />
        {errors.name ? <span className="text-xs text-destructive">{errors.name.message}</span> : null}
      </div>
      <div className="grid gap-1 md:grid-cols-2 md:gap-4">
        <div className="grid gap-1">
          <Label htmlFor="contact-email">{t("email")}</Label>
          <Input id="contact-email" type="email" {...register("email")} placeholder="ali@example.com" />
          {errors.email ? <span className="text-xs text-destructive">{errors.email.message}</span> : null}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="contact-phone">{t("phone")}</Label>
          <Input id="contact-phone" {...register("phone")} placeholder="+998901234567" />
          {errors.phone ? <span className="text-xs text-destructive">{errors.phone.message}</span> : null}
        </div>
      </div>
      <div className="grid gap-1">
        <Label htmlFor="contact-message">{t("message")}</Label>
        <Textarea id="contact-message" rows={5} {...register("message")} placeholder="..." />
        {errors.message ? <span className="text-xs text-destructive">{errors.message.message}</span> : null}
      </div>
      <Button type="submit" disabled={loading} variant="gradient" size="lg">
        <Send className="h-4 w-4" /> {t("send")}
      </Button>
    </form>
  );
}
