"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string | null;
}

export function Partners() {
  const t = useTranslations("home.partners");
  const [partners, setPartners] = useState<Partner[]>([]);
  useEffect(() => {
    fetch("/api/partners")
      .then((r) => r.json())
      .then((data) => setPartners(data.partners ?? []))
      .catch(() => setPartners([]));
  }, []);

  if (!partners.length) return null;
  return (
    <section className="container py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t("title")}</h2>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
        {partners.map((p) => (
          <a
            key={p.id}
            href={p.url ?? "#"}
            target={p.url ? "_blank" : undefined}
            rel="noreferrer"
            className="grayscale hover:grayscale-0 transition opacity-70 hover:opacity-100"
          >
            <Image
              src={p.logo}
              alt={p.name}
              width={120}
              height={48}
              className="h-12 w-auto object-contain"
              unoptimized
            />
          </a>
        ))}
      </div>
    </section>
  );
}
