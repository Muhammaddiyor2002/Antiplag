"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit3, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserItem {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  plan: string;
  checksLeft: number;
  createdAt: Date | string;
  _count?: { checks: number };
}

export function AdminUsersManager({ initial }: { initial: UserItem[] }) {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>(initial);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserItem | null>(null);
  const [role, setRole] = useState("USER");
  const [plan, setPlan] = useState("FREE");
  const [checksLeft, setChecksLeft] = useState(0);

  function openEdit(u: UserItem) {
    setEditing(u);
    setRole(u.role);
    setPlan(u.plan);
    setChecksLeft(u.checksLeft);
    setOpen(true);
  }

  async function save() {
    if (!editing) return;
    try {
      const res = await fetch(`/api/admin/users/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, plan, checksLeft }),
      });
      if (res.ok) {
        toast.success("Foydalanuvchi ma'lumotlari yangilandi");
        setOpen(false);
        setUsers((c) =>
          c.map((u) =>
            u.id === editing.id
              ? { ...u, role, plan, checksLeft }
              : u
          )
        );
        router.refresh();
      } else {
        toast.error("Xatolik yuz berdi");
      }
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  }

  const filtered = users.filter((u) => {
    const s = search.toLowerCase();
    return (
      (u.name?.toLowerCase() || "").includes(s) ||
      (u.email?.toLowerCase() || "").includes(s) ||
      (u.phone?.toLowerCase() || "").includes(s)
    );
  });

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <CardTitle>Foydalanuvchilar ({filtered.length})</CardTitle>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ism, email yoki telefon bo'yicha qidirish..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ism</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Tarif</TableHead>
                <TableHead>Qolgan tekshirishlar</TableHead>
                <TableHead>Jami tekshirishlar</TableHead>
                <TableHead>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Foydalanuvchilar topilmadi
                  </TableCell>
                </TableRow>
              ) : null}
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name || "—"}</TableCell>
                  <TableCell>{u.email || "—"}</TableCell>
                  <TableCell>{u.phone || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === "ADMIN" ? "default" : "outline"}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.plan === "PREMIUM" ? "success" : u.plan === "STANDARD" ? "secondary" : "outline"}>
                      {u.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{u.plan === "PREMIUM" ? "∞" : u.checksLeft}</TableCell>
                  <TableCell>{u._count?.checks ?? 0}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                      <Edit3 className="mr-1 h-3.5 w-3.5" /> O'zgartirish
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Foydalanuvchini tahrirlash</DialogTitle>
            </DialogHeader>
            {editing ? (
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">{editing.name}</span>
                  <span className="text-xs text-muted-foreground">{editing.email}</span>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Rol</Label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="plan">Tarif rejasi</Label>
                  <select
                    id="plan"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                  >
                    <option value="FREE">FREE (Bepul)</option>
                    <option value="STANDARD">STANDARD (Standart)</option>
                    <option value="PREMIUM">PREMIUM (Premium)</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="checksLeft">Qolgan tekshirishlar soni (Bonus)</Label>
                  <Input
                    id="checksLeft"
                    type="number"
                    value={checksLeft}
                    onChange={(e) => setChecksLeft(parseInt(e.target.value, 10) || 0)}
                    disabled={plan === "PREMIUM"}
                  />
                  {plan === "PREMIUM" ? (
                    <p className="text-xs text-muted-foreground">Premium tarifida tekshirishlar soni cheksiz.</p>
                  ) : null}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button onClick={save} variant="gradient">
                    Saqlash
                  </Button>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
