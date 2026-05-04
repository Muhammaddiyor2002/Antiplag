import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 font-bold", className)} aria-label="AntiPlag">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-white">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <span className="text-xl tracking-tight">AntiPlag</span>
    </Link>
  );
}
