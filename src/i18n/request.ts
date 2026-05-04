import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/constants";

function pickLocale(cookieValue?: string, acceptLanguage?: string): Locale {
  if (cookieValue && (LOCALES as readonly string[]).includes(cookieValue)) return cookieValue as Locale;
  if (acceptLanguage) {
    for (const tag of acceptLanguage.split(",")) {
      const code = tag.split(";")[0].trim().slice(0, 2).toLowerCase();
      if ((LOCALES as readonly string[]).includes(code)) return code as Locale;
    }
  }
  return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const headerStore = headers();
  const locale = pickLocale(
    cookieStore.get("locale")?.value,
    headerStore.get("accept-language") ?? undefined
  );
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
});
