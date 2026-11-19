import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { metadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { mailConfigured } from "@/lib/mail";
import { LeadForm } from "@/components/lead-form";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return metadata((await params).locale, "contact", "/contacto");
}
export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  return (
    <main id="main" className="contact-page">
      <div className="container">
        <span className="eyebrow">{t("eyebrow")}</span>
        <div className="contact-page-grid">
          <div>
            <h1>{t("pageTitle")}</h1>
            <p className="large-copy">{t("pageDescription")}</p>
            <div className="contact-details">
              <h2>{t("details")}</h2>
              {siteConfig.email && (
                <a href={`mailto:${siteConfig.email}`}>
                  <Mail size={20} />
                  {siteConfig.email}
                  <ArrowUpRight size={16} />
                </a>
              )}
              {siteConfig.phone && (
                <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}>
                  <Phone size={20} />
                  {siteConfig.phone}
                </a>
              )}
              {siteConfig.address && (
                <p>
                  <MapPin size={20} />
                  {siteConfig.address}
                </p>
              )}
              {!siteConfig.email &&
                !siteConfig.phone &&
                !siteConfig.address && <p>{t("pending")}</p>}
              <span className="eyebrow">{t("mexico")}</span>
            </div>
          </div>
          <div className="form-panel">
            <h2>{t("formTitle")}</h2>
            <p>{t("formSubtitle")}</p>
            <LeadForm kind="contact" enabled={mailConfigured()} />
          </div>
        </div>
      </div>
    </main>
  );
}
