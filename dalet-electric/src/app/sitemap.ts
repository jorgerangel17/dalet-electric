import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return siteConfig.configured
    ? ["", "/contacto", "/privacidad"].flatMap((path) =>
        ["es", "en"].map((locale) => ({
          url: `${siteConfig.url}/${locale}${path}`,
          alternates: {
            languages: {
              es: `${siteConfig.url}/es${path}`,
              en: `${siteConfig.url}/en${path}`,
            },
          },
          changeFrequency: "monthly" as const,
          priority: path ? 0.6 : 1,
        })),
      )
    : [];
}
