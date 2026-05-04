import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/common/theme-provider";
import { AuthProvider } from "@/components/common/auth-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "AntiPlag — Milliy Antiplagiat Tizimi",
    template: "%s | AntiPlag",
  },
  description:
    "AntiPlag — O'zbekiston talabalari, ilmiy xodimlar va tashkilotlar uchun matnli plagiat va AI-detektor xizmati. .doc, .docx, .pdf, .txt formatlari uchun tezkor va aniq tahlil.",
  keywords: ["antiplagiat", "plagiat tekshirish", "originallik", "AI detektor", "uzbekistan", "antiplag"],
  authors: [{ name: "AntiPlag" }],
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "AntiPlag — Milliy Antiplagiat Tizimi",
    description: "Matnli plagiat va sun'iy intellekt detektori",
    siteName: "AntiPlag",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AntiPlag — Milliy Antiplagiat Tizimi",
    description: "Matnli plagiat va sun'iy intellekt detektori",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              {children}
              <Toaster richColors position="top-right" closeButton />
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
