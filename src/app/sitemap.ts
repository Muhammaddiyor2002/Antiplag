import type { MetadataRoute } from "next";

const BASE = process.env.APP_URL ?? "https://antiplag.uz";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/faq", "/news", "/pricing", "/contact", "/guide", "/corporate", "/login", "/register"];
  return routes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1.0 : 0.7,
  }));
}
