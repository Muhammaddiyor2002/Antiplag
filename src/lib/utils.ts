import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale = "uz"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const map: Record<string, string> = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };
  return new Intl.DateTimeFormat(map[locale] ?? "uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string, locale = "uz"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const map: Record<string, string> = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };
  return new Intl.DateTimeFormat(map[locale] ?? "uz-UZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "…";
}

export function pctColor(pct: number): "success" | "warning" | "danger" {
  if (pct < 25) return "success";
  if (pct < 60) return "warning";
  return "danger";
}

export function originalityFromPlagiarism(plagPct: number): number {
  return Math.max(0, Math.min(100, 100 - plagPct));
}
