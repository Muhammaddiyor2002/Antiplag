"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const params = useSearchParams();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      identifier: values.identifier,
      password: values.password,
    });
    setLoading(false);
    if (res?.ok) {
      toast.success(t("loginSuccess"));
      const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
      router.push(callbackUrl);
      router.refresh();
    } else {
      toast.error(t("loginFailed"));
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("loginTitle")}</CardTitle>
        <CardDescription>AntiPlag akkountingizga kiring</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="identifier">{t("identifier")}</Label>
            <Input id="identifier" autoComplete="username" {...register("identifier")} placeholder="email@example.com yoki +998..." />
            {errors.identifier ? <span className="text-xs text-destructive">{errors.identifier.message}</span> : null}
          </div>
          <div className="grid gap-1.5">
            <div className="flex justify-between">
              <Label htmlFor="password">{t("password")}</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                {t("forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                {...register("password")}
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
            {errors.password ? <span className="text-xs text-destructive">{errors.password.message}</span> : null}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="remember" {...register("remember")} />
            <Label htmlFor="remember" className="text-sm font-normal">{t("remember")}</Label>
          </div>
          <Button type="submit" disabled={loading} variant="gradient" size="lg">
            {loading ? "..." : t("submitLogin")}
          </Button>
          <div className="relative my-2">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t" />
            <span className="relative flex justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">{t("or")}</span>
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full"
          >
            {t("googleSignIn")}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              {t("submitRegister")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
