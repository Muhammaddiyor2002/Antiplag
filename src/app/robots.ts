import type { MetadataRoute } from "next";

const BASE = process.env.APP_URL ?? "https://antiplag.uz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard/", "/admin/"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
