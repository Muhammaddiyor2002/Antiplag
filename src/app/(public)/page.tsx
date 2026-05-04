import { Hero } from "@/components/home/hero";
import { AboutSection } from "@/components/home/about-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { Ecosystem } from "@/components/home/ecosystem";
import { PricingSection } from "@/components/home/pricing-section";
import { Partners } from "@/components/home/partners";
import { ContactForm } from "@/components/home/contact-form";
import { Newsletter } from "@/components/home/newsletter";
import { useTranslations } from "next-intl";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <HowItWorks />
      <Ecosystem />
      <PricingSection />
      <Partners />
      <ContactSection />
      <Newsletter />
    </>
  );
}

function ContactSection() {
  const t = useTranslations("home.contact");
  return (
    <section className="container py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground mt-3">{t("subtitle")}</p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-xl border bg-card p-4">
              <div className="font-semibold">Email</div>
              <a href="mailto:info@antiplag.uz" className="text-primary hover:underline">info@antiplag.uz</a>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <div className="font-semibold">Telefon</div>
              <a href="tel:+998711231234" className="text-primary hover:underline">+998 (71) 123-12-34</a>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <div className="font-semibold">Telegram</div>
              <a href="https://t.me/antiplag_uz" target="_blank" rel="noreferrer" className="text-primary hover:underline">@antiplag_uz</a>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
