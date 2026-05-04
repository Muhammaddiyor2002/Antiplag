"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PartnerItem { id: string; name: string; logo: string; url?: string | null; order: number }

export function AdminPartnersManager({ initial }: { initial: PartnerItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerItem | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [url, setUrl] = useState("");
  const [order, setOrder] = useState(0);

  function openNew() { setEditing(null); setName(""); setLogo(""); setUrl(""); setOrder(items.length); setOpen(true); }
  function openEdit(p: PartnerItem) { setEditing(p); setName(p.name); setLogo(p.logo); setUrl(p.url ?? ""); setOrder(p.order); setOpen(true); }

  async function save() {
    const u = editing ? `/api/admin/partners/${editing.id}` : "/api/admin/partners";
    const m = editing ? "PUT" : "POST";
    const res = await fetch(u, { method: m, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, logo, url, order }) });
    if (res.ok) {
      const data = await res.json();
      toast.success("Saqlandi");
      setOpen(false);
      if (editing) setItems((c) => c.map((i) => (i.id === editing.id ? { ...i, name, logo, url, order } : i)));
      else setItems((c) => [...c, data.item]);
      router.refresh();
    } else toast.error("Xatolik");
  }

  async function remove(id: string) {
    if (!confirm("O'chirilsinmi?")) return;
    const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
    if (res.ok) { setItems((c) => c.filter((i) => i.id !== id)); toast.success("O'chirildi"); }
    else toast.error("Xatolik");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hamkorlar</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} variant="gradient"><Plus className="h-4 w-4" /> Yangi</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Tahrirlash" : "Yangi hamkor"}</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5"><Label>Nom</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="grid gap-1.5"><Label>Logo URL</Label><Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="/uploads/logo.png" /></div>
              <div className="grid gap-1.5"><Label>Veb-sayt</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." /></div>
              <div className="grid gap-1.5"><Label>Tartib</Label><Input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)} /></div>
              <Button onClick={save} variant="gradient">Saqlash</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? <p className="text-muted-foreground py-8 text-center md:col-span-3">Hamkorlar yo'q</p> : null}
          {items.map((p) => (
            <div key={p.id} className="rounded-md border p-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded bg-muted overflow-hidden relative shrink-0">
                {p.logo ? <Image src={p.logo} alt={p.name} fill className="object-contain" unoptimized /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground truncate">{p.url ?? "—"}</div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Edit3 className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
