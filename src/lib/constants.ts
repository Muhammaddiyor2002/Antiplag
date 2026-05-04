export const APP_NAME = "AntiPlag";
export const APP_DESCRIPTION = "Milliy Antiplagiat Tizimi — matnli plagiat va AI detektori";

export const PLAN_LIMITS = {
  FREE: { checksPerDay: 3, maxFileSizeMb: 5, label: "Bepul" },
  STANDARD: { checksPerDay: 50, maxFileSizeMb: 10, label: "Standart" },
  PREMIUM: { checksPerDay: -1, maxFileSizeMb: 25, label: "Premium" },
} as const;

export const PLAN_PRICES = {
  FREE: { uzs: 0, usd: 0 },
  STANDARD: { uzs: 99000, usd: 8 },
  PREMIUM: { uzs: 299000, usd: 24 },
} as const;

export const ALLOWED_FILE_TYPES = [".doc", ".docx", ".pdf", ".txt"] as const;
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE ?? "10485760", 10);

export const LOCALES = ["uz", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "uz";

export const SOCIAL_LINKS = [
  { name: "Telegram", url: "https://t.me/antiplag_uz", icon: "telegram" },
  { name: "Facebook", url: "https://facebook.com/antiplag.uz", icon: "facebook" },
  { name: "Instagram", url: "https://instagram.com/antiplag.uz", icon: "instagram" },
  { name: "YouTube", url: "https://youtube.com/@antiplag_uz", icon: "youtube" },
];
