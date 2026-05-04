"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, FilePlus, FileText, User, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardSidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const ta = useTranslations("admin");

  const items = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("title") },
    { href: "/dashboard/check", icon: FilePlus, label: t("newCheck") },
    { href: "/dashboard/reports", icon: FileText, label: t("reports.title") },
    { href: "/dashboard/profile", icon: User, label: t("profile.title") },
    { href: "/dashboard/subscription", icon: CreditCard, label: t("subscription.title") },
  ];

  return (
    <aside className="w-64 shrink-0 border-r bg-card hidden lg:block">
      <div className="p-4 sticky top-16">
        <nav className="flex flex-col gap-1">
          {items.map((it) => {
            const active = pathname === it.href || (it.href !== "/dashboard" && pathname.startsWith(it.href));
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground/80"
                )}
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
          {isAdmin ? (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mt-3 border-t pt-3",
                pathname.startsWith("/admin") ? "text-primary" : "hover:bg-accent text-foreground/80"
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              {ta("title")}
            </Link>
          ) : null}
        </nav>
      </div>
    </aside>
  );
}
