"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { updateProfileSchema, updatePasswordSchema, type UpdateProfileInput, type UpdatePasswordInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  language?: string;
}

export function ProfileForm({ user }: { user: ProfileUser }) {
  const t = useTranslations("dashboard.profile");
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(user.avatar ?? "");
  const [uploading, setUploading] = useState(false);

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      language: ((["uz", "ru", "en"] as const).includes((user.language ?? "uz") as "uz" | "ru" | "en")
        ? (user.language as "uz" | "ru" | "en")
        : "uz"),
    },
  });

  const pwdForm = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  });

  async function saveProfile(values: UpdateProfileInput) {
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      toast.success(t("saved"));
      if (values.language) document.cookie = `locale=${values.language}; path=/; max-age=${60*60*24*365}`;
      router.refresh();
    } else {
      toast.error(t("error"));
    }
  }

  async function changePassword(values: UpdatePasswordInput) {
    const res = await fetch("/api/user/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(t("passwordChanged"));
      pwdForm.reset();
    } else {
      toast.error(data?.message ?? t("error"));
    }
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/user/avatar", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok) {
      setAvatarUrl(data.url);
      toast.success(t("avatarUpdated"));
      router.refresh();
    } else {
      toast.error(data?.message ?? t("error"));
    }
  }

  return (
    <div className="grid gap-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={user.name} /> : null}
              <AvatarFallback>{user.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar" className="cursor-pointer">
                <span className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
                  {uploading ? "..." : t("uploadAvatar")}
                </span>
              </Label>
              <input id="avatar" type="file" accept="image/*" className="sr-only" onChange={uploadAvatar} />
              <p className="text-xs text-muted-foreground mt-1">PNG / JPG, maks 2 MB</p>
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(saveProfile)} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>{t("name")}</Label>
              <Input {...profileForm.register("name")} />
            </div>
            <div className="grid gap-1.5">
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
            <div className="grid gap-1.5">
              <Label>{t("phone")}</Label>
              <Input {...profileForm.register("phone")} placeholder="+998..." />
            </div>
            <div className="grid gap-1.5">
              <Label>{t("language")}</Label>
              <Select
                defaultValue={user.language ?? "uz"}
                onValueChange={(v) => profileForm.setValue("language", v as "uz" | "ru" | "en")}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="uz">O'zbek</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button type="submit" variant="gradient">{t("save")}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t("changePassword")}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={pwdForm.handleSubmit(changePassword)} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>{t("currentPassword")}</Label>
              <Input type="password" {...pwdForm.register("currentPassword")} />
            </div>
            <div className="grid gap-1.5">
              <Label>{t("newPassword")}</Label>
              <Input type="password" {...pwdForm.register("newPassword")} />
            </div>
            <div className="grid gap-1.5">
              <Label>{t("confirm")}</Label>
              <Input type="password" {...pwdForm.register("confirmNewPassword")} />
            </div>
            <div>
              <Button type="submit">{t("update")}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
