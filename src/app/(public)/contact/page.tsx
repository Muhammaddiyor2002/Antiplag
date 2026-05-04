import type { Metadata } from "next";
import { ContactForm } from "@/components/home/contact-form";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

export const metadata: Metadata = { title: "Bog'lanish" };

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">Biz bilan bog'lanish</h1>
        <p className="mt-4 text-muted-foreground">Savollaringiz bormi? Quyidagi forma yoki to'g'ridan-to'g'ri kontaktlarimiz orqali yozing.</p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        <div className="space-y-3">
          <ContactInfo Icon={Mail} title="Email" value="info@antiplag.uz" href="mailto:info@antiplag.uz" />
          <ContactInfo Icon={Phone} title="Telefon" value="+998 (71) 123-12-34" href="tel:+998711231234" />
          <ContactInfo Icon={Send} title="Telegram" value="@antiplag_uz" href="https://t.me/antiplag_uz" />
          <ContactInfo Icon={MessageCircle} title="WhatsApp" value="+998 90 123 45 67" href="https://wa.me/998901234567" />
          <ContactInfo Icon={MapPin} title="Manzil" value="Toshkent, O'zbekiston" />

          <div className="rounded-2xl overflow-hidden border mt-4">
            <iframe
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11984.038907!2d69.2792!3d41.3111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent!5e0!3m2!1suz!2suz!4v0000000000"
              loading="lazy"
              className="w-full h-64 border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function ContactInfo({
  Icon,
  title,
  value,
  href,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-xl border bg-card p-4 flex items-start gap-4 hover:border-primary transition">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-white shrink-0">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{inner}</a> : inner;
}
