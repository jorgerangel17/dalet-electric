import { getTranslations, setRequestLocale } from "next-intl/server";
import { metadata } from "@/lib/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return metadata((await params).locale, "privacy", "/privacidad");
}
export default async function Privacy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  return (
    <main id="main" className="privacy-page container">
      <span className="eyebrow">{t("eyebrow")}</span>
      <h1>{t("title")}</h1>
      <p className="large-copy">{t("intro")}</p>
      <div className="privacy-draft">{t("draft")}</div>
      {(t.raw("sections") as { title: string; text: string }[]).map(
        (section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ),
      )}
    </main>
  );
}
