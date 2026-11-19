import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import { GroupAffiliation } from "./group-affiliation";
export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href={`/${locale}`} className="brand">
            <Brand />
          </Link>
          <p>{t("description")}</p>
          <GroupAffiliation compact />
        </div>
        <div>
          <span className="eyebrow">{t("navigation")}</span>
          <Link href={`/${locale}#nosotros`}>{n("about")}</Link>
          <Link href={`/${locale}#soluciones`}>{n("services")}</Link>
          <Link href={`/${locale}#proceso`}>{n("process")}</Link>
        </div>
        <div>
          <span className="eyebrow">{t("connect")}</span>
          <Link href={`/${locale}/contacto`} className="footer-contact">
            {n("contact")}
            <ArrowUpRight size={20} />
          </Link>
          <Link href={`/${locale}/privacidad`}>{t("privacy")}</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Dalet Electric. {t("rights")}
        </span>
        <span>{t("credit")}</span>
      </div>
    </footer>
  );
}
