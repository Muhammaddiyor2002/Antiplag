"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileSearch,
  Newspaper,
  HelpCircle,
  Building2,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Foydalanuvchilar" },
  { href: "/admin/checks", icon: FileSearch, label: "Tekshirishlar" },
  { href: "/admin/news", icon: Newspaper, label: "Yangiliklar" },
  { href: "/admin/faq", icon: HelpCircle, label: "FAQ" },
  { href: "/admin/partners", icon: Building2, label: "Hamkorlar" },
  { href: "/admin/contacts", icon: MessageSquare, label: "Aloqa xabarlari" },
  { href: "/admin/settings", icon: Settings, label: "Sozlamalar" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 border-r bg-card hidden lg:block">
      <div className="p-4 sticky top-16">
        <div className="text-xs uppercase tracking-wide text-muted-foreground px-3 pb-2">Admin panel</div>
        <nav className="flex flex-col gap-1">
          {ITEMS.map((it) => {
            const active = pathname === it.href || (it.href !== "/admin" && pathname.startsWith(it.href));
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground/80"
                )}
              >
                <it.icon className="h-4 w-4" /> {it.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
