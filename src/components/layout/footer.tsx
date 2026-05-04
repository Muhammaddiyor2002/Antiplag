import Link from "next/link";
import { useTranslations } from "next-intl";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/common/logo";

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="text-sm text-muted-foreground mt-3 max-w-sm">
            {t("footer.tagline")}
          </p>
          <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            <a href="mailto:info@antiplag.uz" className="flex items-center gap-2 hover:text-foreground">
              <Mail className="h-4 w-4" /> info@antiplag.uz
            </a>
            <a href="tel:+998711231234" className="flex items-center gap-2 hover:text-foreground">
              <Phone className="h-4 w-4" /> +998 (71) 123-12-34
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Toshkent, O'zbekiston
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("footer.menu")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">{t("nav.home")}</Link></li>
            <li><Link href="/pricing" className="hover:text-foreground">{t("nav.pricing")}</Link></li>
            <li><Link href="/news" className="hover:text-foreground">{t("nav.news")}</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">{t("nav.faq")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("footer.company")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">{t("nav.about")}</Link></li>
            <li><Link href="/corporate" className="hover:text-foreground">{t("nav.corporate")}</Link></li>
            <li><Link href="/guide" className="hover:text-foreground">{t("nav.guide")}</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("footer.social")}</h3>
          <div className="flex gap-2">
            <a href="https://t.me/antiplag_uz" aria-label="Telegram" className="rounded-md p-2 bg-background hover:bg-accent border" target="_blank" rel="noreferrer">
              <Send className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AntiPlag. {t("footer.rights")}.
        </div>
      </div>
    </footer>
  );
}
