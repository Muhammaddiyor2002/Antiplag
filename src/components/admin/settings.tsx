"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const KEYS: { key: string; label: string }[] = [
  { key: "site_name", label: "Sayt nomi" },
  { key: "logo_url", label: "Logo URL" },
  { key: "support_email", label: "Yordam email" },
  { key: "support_phone", label: "Yordam telefon" },
  { key: "telegram", label: "Telegram" },
];

export function AdminSettings({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();
  const [vals, setVals] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vals),
    });
    setSaving(false);
    if (res.ok) { toast.success("Saqlandi"); router.refresh(); }
    else toast.error("Xatolik");
  }

  return (
    <Card>
      <CardHeader><CardTitle>Sozlamalar</CardTitle></CardHeader>
      <CardContent className="grid gap-4 max-w-xl">
        {KEYS.map((k) => (
          <div key={k.key} className="grid gap-1.5">
            <Label>{k.label}</Label>
            <Input value={vals[k.key] ?? ""} onChange={(e) => setVals((cur) => ({ ...cur, [k.key]: e.target.value }))} />
          </div>
        ))}
        <Button onClick={save} disabled={saving} variant="gradient">{saving ? "..." : "Saqlash"}</Button>
      </CardContent>
    </Card>
  );
}
