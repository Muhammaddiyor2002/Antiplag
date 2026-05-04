import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { LanguageSwitcher } from "@/components/common/language-switcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <header className="container flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
      <main className="container flex items-center justify-center py-8 md:py-16">{children}</main>
      <footer className="container py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AntiPlag. <Link href="/" className="hover:text-foreground">Bosh sahifa</Link>
      </footer>
    </div>
  );
}
