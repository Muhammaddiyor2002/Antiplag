"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { z } from "zod";

type Form = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: Form) {
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      toast.success(t("passwordResetSent"));
    } catch {
      toast.error("Xatolik");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("forgotTitle")}</CardTitle>
        <CardDescription>Email manzilingizni kiriting va tiklash uchun ko'rsatma yuboramiz.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" {...register("email")} placeholder="ali@example.com" />
            {errors.email ? <span className="text-xs text-destructive">{errors.email.message}</span> : null}
          </div>
          <Button type="submit" disabled={loading} variant="gradient" size="lg">
            {loading ? "..." : t("submitForgot")}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">{t("submitLogin")}</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
