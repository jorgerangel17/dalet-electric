"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "./brand";
export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const other = locale === "es" ? "en" : "es";
  const destination = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${other}`);
  const links = [
    ["about", "nosotros"],
    ["services", "soluciones"],
    ["model", "modelo"],
    ["projects", "proyectos"],
  ];
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <>
      <a className="skip" href="#main">
        {t("skip")}
      </a>
      <header className="header">
        <div className="header-inner">
          <Link
            href={`/${locale}`}
            aria-label="Dalet Electric — Home"
            className="brand"
            onClick={() => setOpen(false)}
          >
            <Brand />
          </Link>
          <nav className="desktop-nav" aria-label={t("home")}>
            {links.map(([label, id]) => (
              <Link key={id} href={`/${locale}#${id}`}>
                {t(label)}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              className="language"
              href={destination}
              aria-label={t("language")}
              hrefLang={other}
            >
              <span className={locale === "es" ? "active" : ""}>ES</span>
              <i>/</i>
              <span className={locale === "en" ? "active" : ""}>EN</span>
            </Link>
            <Link href={`/${locale}/contacto`} className="button header-cta">
              {t("contact")}
              <ArrowUpRight size={15} />
            </Link>
            <button
              className="menu-button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t("close") : t("menu")}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="mobile-nav" id="mobile-nav" aria-label={t("menu")}>
            {links.map(([label, id]) => (
              <Link
                key={id}
                href={`/${locale}#${id}`}
                onClick={() => setOpen(false)}
              >
                {t(label)}
                <ArrowUpRight size={20} />
              </Link>
            ))}
            <Link href={`/${locale}#proceso`} onClick={() => setOpen(false)}>
              {t("process")}
            </Link>
            <Link href={`/${locale}/contacto`} onClick={() => setOpen(false)}>
              {t("contact")}
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
