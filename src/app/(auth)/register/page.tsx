"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), defaultValues: { agree: false } });

  const password = watch("password") ?? "";
  const strength = pwdStrength(password);

  async function onSubmit(values: RegisterInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "failed");
      toast.success(t("registerSuccess"));
      const signInRes = await signIn("credentials", {
        redirect: false,
        identifier: values.email,
        password: values.password,
      });
      if (signInRes?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xatolik");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("registerTitle")}</CardTitle>
        <CardDescription>AntiPlag akkounti yarating va birinchi tekshirishni bepul boshlang</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" {...register("name")} placeholder="Ali" />
              {errors.name ? <span className="text-xs text-destructive">{errors.name.message}</span> : null}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="surname">{t("surname")}</Label>
              <Input id="surname" {...register("surname")} placeholder="Valiyev" />
              {errors.surname ? <span className="text-xs text-destructive">{errors.surname.message}</span> : null}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" {...register("email")} placeholder="ali@example.com" autoComplete="email" />
            {errors.email ? <span className="text-xs text-destructive">{errors.email.message}</span> : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input id="phone" {...register("phone")} placeholder="+998901234567" autoComplete="tel" />
            {errors.phone ? <span className="text-xs text-destructive">{errors.phone.message}</span> : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">{t("password")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                {...register("password")}
                autoComplete="new-password"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Toggle password"
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password ? (
              <div className="flex h-1.5 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded ${i < strength.level ? strength.color : "bg-muted"}`}
                  />
                ))}
              </div>
            ) : null}
            {errors.password ? <span className="text-xs text-destructive">{errors.password.message}</span> : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type={showPwd ? "text" : "password"}
              {...register("confirmPassword")}
              autoComplete="new-password"
              placeholder="••••••••"
            />
            {errors.confirmPassword ? <span className="text-xs text-destructive">{errors.confirmPassword.message}</span> : null}
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="agree" {...register("agree")} />
            <Label htmlFor="agree" className="text-sm font-normal leading-relaxed">
              {t("agreeTerms")}
            </Label>
          </div>
          {errors.agree ? <span className="text-xs text-destructive">{errors.agree.message}</span> : null}
          <Button type="submit" disabled={loading} variant="gradient" size="lg">
            {loading ? "..." : t("submitRegister")}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            {t("haveAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              {t("submitLogin")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

function pwdStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
  return { level: score, color: colors[Math.max(0, score - 1)] ?? colors[0] };
}
