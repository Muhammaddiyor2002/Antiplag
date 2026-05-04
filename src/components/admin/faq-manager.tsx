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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FaqItem { id: string; question: string; answer: string; order: number }

export function AdminFaqManager({ initial }: { initial: FaqItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState(0);

  function openNew() {
    setEditing(null); setQuestion(""); setAnswer(""); setOrder(items.length); setOpen(true);
  }
  function openEdit(it: FaqItem) {
    setEditing(it); setQuestion(it.question); setAnswer(it.answer); setOrder(it.order); setOpen(true);
  }

  async function save() {
    const url = editing ? `/api/admin/faq/${editing.id}` : "/api/admin/faq";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer, order }),
    });
    if (res.ok) {
      const data = await res.json();
      toast.success("Saqlandi");
      setOpen(false);
      if (editing) setItems((c) => c.map((i) => (i.id === editing.id ? { ...i, question, answer, order } : i)));
      else setItems((c) => [...c, data.item]);
      router.refresh();
    } else toast.error("Xatolik");
  }

  async function remove(id: string) {
    if (!confirm("O'chirilsinmi?")) return;
    const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    if (res.ok) { setItems((c) => c.filter((i) => i.id !== id)); toast.success("O'chirildi"); }
    else toast.error("Xatolik");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>FAQ</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} variant="gradient"><Plus className="h-4 w-4" /> Yangi</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Tahrirlash" : "Yangi savol"}</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-1.5"><Label>Savol</Label><Input value={question} onChange={(e) => setQuestion(e.target.value)} /></div>
              <div className="grid gap-1.5"><Label>Javob</Label><Textarea rows={5} value={answer} onChange={(e) => setAnswer(e.target.value)} /></div>
              <div className="grid gap-1.5"><Label>Tartib</Label><Input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)} /></div>
              <Button onClick={save} variant="gradient">Saqlash</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.length === 0 ? <p className="text-muted-foreground py-8 text-center">FAQ yo'q</p> : null}
          {items.map((it) => (
            <div key={it.id} className="rounded-md border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{it.question}</div>
                  <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{it.answer}</div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(it)}><Edit3 className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(it.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
