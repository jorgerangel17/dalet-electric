import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "./config";
export async function metadata(
  locale: string,
  page: "home" | "contact" | "privacy",
  path = "",
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t(`${page}Title`);
  const description = t(`${page}Description`);
  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        es: `/es${path}`,
        en: `/en${path}`,
        "x-default": `/es${path}`,
      },
    },
    robots: { index: siteConfig.configured, follow: siteConfig.configured },
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      siteName: "Dalet Electric",
      locale: locale === "es" ? "es_MX" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_MX"],
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Dalet Electric — Electrical infrastructure development in Mexico",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
