"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { slugify } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: string;
}

export function AdminNewsManager({ initial }: { initial: NewsItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);

  function openNew() {
    setEditing(null);
    setTitle("");
    setContent("");
    setPublished(true);
    setOpen(true);
  }

  function openEdit(it: NewsItem) {
    setEditing(it);
    setTitle(it.title);
    setContent(it.content);
    setPublished(it.published);
    setOpen(true);
  }

  async function save() {
    const slug = slugify(title) || `news-${Date.now()}`;
    const payload = { title, slug, content, published };
    const url = editing ? `/api/admin/news/${editing.id}` : "/api/admin/news";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      toast.success("Saqlandi");
      setOpen(false);
      if (editing) {
        setItems((cur) => cur.map((i) => (i.id === editing.id ? { ...i, ...payload } : i)));
      } else {
        setItems((cur) => [{ ...data.item, createdAt: new Date().toISOString() }, ...cur]);
      }
      router.refresh();
    } else {
      toast.error("Xatolik");
    }
  }

  async function remove(id: string) {
    if (!confirm("O'chirilsinmi?")) return;
    const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((cur) => cur.filter((i) => i.id !== id));
      toast.success("O'chirildi");
    } else {
      toast.error("Xatolik");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Yangiliklar</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} variant="gradient"><Plus className="h-4 w-4" /> Yangi</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Tahrirlash" : "Yangi yangilik"}</DialogTitle>
              <DialogDescription>Yangilik matni va sarlavhasini kiriting</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label>Sarlavha</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label>Matn</Label>
                <Textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                Nashr qilingan
              </label>
              <Button onClick={save} variant="gradient">Saqlash</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.length === 0 ? <p className="text-muted-foreground py-8 text-center">Yangiliklar yo'q</p> : null}
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between gap-2 rounded-md border p-3">
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{it.title}</div>
                <div className="text-xs text-muted-foreground">/{it.slug} · {new Date(it.createdAt).toLocaleDateString("uz-UZ")}</div>
              </div>
              <Badge variant={it.published ? "success" : "secondary"}>{it.published ? "Nashr" : "Qoralama"}</Badge>
              <Button size="sm" variant="ghost" onClick={() => openEdit(it)}><Edit3 className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => remove(it.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
