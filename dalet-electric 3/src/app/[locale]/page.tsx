import { GroupAffiliation } from "@/components/group-affiliation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Zap,
  Network,
  DraftingCompass,
  FileCheck2,
  Landmark,
  ChartNoAxesCombined,
  Workflow,
  FolderOpen,
  Check,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { LeadForm } from "@/components/lead-form";
import { mailConfigured } from "@/lib/mail";
import { metadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { projects } from "@/lib/projects";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return metadata((await params).locale, "home");
}
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const services = t.raw("services.items") as {
    title: string;
    description: string;
    tag: string;
  }[];
  const stages = t.raw("process.items") as {
    title: string;
    description: string;
  }[];
  const icons = [
    Network,
    DraftingCompass,
    Zap,
    FileCheck2,
    ChartNoAxesCombined,
    Workflow,
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dalet Electric",
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.group.name,
      url: siteConfig.group.url,
    },
    url: siteConfig.configured ? siteConfig.url : undefined,
    ...(siteConfig.logo
      ? { logo: new URL(siteConfig.logo, siteConfig.url).toString() }
      : {}),
    description: t("seo.homeDescription"),
    areaServed: { "@type": "Country", name: "Mexico" },
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
  };
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <section className="hero">
        <Image
          src="/images/infrastructure.jpg"
          alt={t("hero.imageAlt")}
          fill
          priority
          sizes="100vw"
          className="hero-photo"
        />
        <div className="hero-shade" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-content">
          <div className="eyebrow light">
            <span className="status-dot" />
            {t("hero.eyebrow")}
          </div>
          <h1>{t("hero.title")}</h1>
          <p>{t("hero.subtitle")}</p>
          <div className="hero-buttons">
            <Link href="#factibilidad" className="button button-white">
              {t("hero.primary")}
              <ArrowUpRight size={19} />
            </Link>
            <Link href="#soluciones" className="button button-outline">
              {t("hero.secondary")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="container hero-bottom">
          <span>{t("hero.bottom")}</span>
          <a href="#nosotros">
            {t("hero.scroll")}
            <ArrowDown size={16} />
          </a>
        </div>
      </section>
      <section
        className="sector-strip"
        aria-label={locale === "es" ? "Sectores" : "Sectors"}
      >
        <div className="container sectors">
          {(t.raw("about.sectors") as string[]).map((sector, i) => (
            <span key={sector}>
              <span className="sector-mark" aria-hidden="true">
                {["01", "02", "03", "04"][i]}
              </span>
              {sector}
              <ArrowUpRight size={15} />
            </span>
          ))}
        </div>
      </section>
      <section id="nosotros" className="section about">
        <div className="container">
          <Reveal>
            <span className="eyebrow">{t("about.eyebrow")}</span>
          </Reveal>
          <div className="about-grid">
            <Reveal>
              <h2>{t("about.title")}</h2>
              <span className="small-rule" />
              <p className="about-lead">{t("about.lead")}</p>
            </Reveal>
            <Reveal delay={0.1} className="about-copy">
              <span className="eyebrow muted">{t("about.note")}</span>
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
              <p>{t("about.p3")}</p>
              <GroupAffiliation />
              <Link className="text-link" href="#modelo">
                {t("nav.model")}
                <ArrowUpRight size={18} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
      <section id="soluciones" className="section solutions">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">{t("services.eyebrow")}</span>
              <h2 className="line-break">{t("services.title")}</h2>
            </div>
            <p>{t("services.intro")}</p>
          </Reveal>
          <div className="services-grid">
            {services.map((service, i) => {
              const Icon = icons[i];
              return (
                <Reveal
                  key={service.title}
                  delay={(i % 3) * 0.06}
                  className={`service-card ${i === 0 ? "service-card-visual" : ""}`}
                >
                  {i === 0 && (
                    <Image
                      src="/images/infrastructure.jpg"
                      alt={t("hero.imageAlt")}
                      fill
                      sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 33vw"
                      className="service-photo"
                    />
                  )}
                  <div className="service-top">
                    <Icon size={30} strokeWidth={1.25} />
                    <span>0{i + 1}</span>
                  </div>
                  <div>
                    <span className="eyebrow card-tag">{service.tag}</span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                  <Link
                    href="#factibilidad"
                    className="service-link"
                    aria-label={`${service.title} — ${t("services.more")}`}
                  >
                    <span>{t("services.more")}</span>
                    <ArrowUpRight size={20} />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <section id="modelo" className="section model">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow light">{t("model.eyebrow")}</span>
              <h2 className="line-break">{t("model.title")}</h2>
            </div>
            <p>{t("model.description")}</p>
          </Reveal>
          <Reveal className="model-diagram">
            <div className="model-dalet">
              <span className="eyebrow">{t("model.daletLabel")}</span>
              <strong>
                DALET <span>ELECTRIC</span>
              </strong>
              <p>{t("model.dalet")}</p>
            </div>
            <div className="model-connector" aria-hidden="true">
              <ArrowRight size={26} />
            </div>
            <div className="model-crexa">
              <span className="eyebrow">{t("model.crexaLabel")}</span>
              <strong>CREXA</strong>
              <p>{t("model.crexa")}</p>
              <a
                href="https://www.grupocrexa.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
                aria-label={`${t("model.cta")} — ${t("model.newTab")}`}
              >
                {t("model.cta")}
                <ArrowUpRight size={17} />
              </a>
            </div>
          </Reveal>
          <p className="model-philosophy">{t("model.philosophy")}</p>
        </div>
      </section>
      <section id="factibilidad" className="section feasibility">
        <div className="container feasibility-grid">
          <Reveal className="feasibility-intro">
            <span className="eyebrow">{t("feasibility.eyebrow")}</span>
            <h2>{t("feasibility.title")}</h2>
            <p className="large-copy">{t("feasibility.description")}</p>
            <div className="feasibility-note">
              <Check size={20} />
              <p>{t("feasibility.note")}</p>
            </div>
            <div className="image-detail">
              <Image
                src="/images/substation-web.jpg"
                alt={t("feasibility.imageAlt")}
                fill
                sizes="(max-width: 900px) 100vw, 35vw"
              />
              <span>
                {t("feasibility.imageCaption")}
                <ArrowUpRight size={17} />
              </span>
            </div>
            <a
              className="photo-credit"
              href="https://commons.wikimedia.org/wiki/File:DSC04737_APG_Leoben_Substation,_Leoben-Donawitz,_2026-04.jpg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("feasibility.imageCredit")} · Aciarium / CC BY-SA 4.0 ↗
            </a>
          </Reveal>
          <Reveal className="form-panel" delay={0.1}>
            <h3>{t("feasibility.formTitle")}</h3>
            <p>{t("feasibility.formSubtitle")}</p>
            <LeadForm enabled={mailConfigured()} />
          </Reveal>
        </div>
      </section>
      <section id="proyectos" className="section projects">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">{t("projects.eyebrow")}</span>
              <h2>{t("projects.title")}</h2>
            </div>
            <p>{t("projects.description")}</p>
          </Reveal>
          {projects.length === 0 ? (
            <Reveal className="project-empty">
              <div className="empty-icon">
                <FolderOpen size={32} strokeWidth={1} />
              </div>
              <div>
                <h3>{t("projects.emptyTitle")}</h3>
                <p>{t("projects.emptyDescription")}</p>
              </div>
              <Link href={`/${locale}/contacto`} className="text-link">
                {t("projects.cta")}
                <ArrowUpRight size={19} />
              </Link>
            </Reveal>
          ) : (
            <div
              className={`project-grid ${projects.length === 1 ? "project-grid-single" : ""}`}
            >
              {projects.map((project) => {
                const lang = locale as "es" | "en";
                return (
                  <article key={project.slug} className="project-card">
                    {project.images[0] && (
                      <Image
                        src={project.images[0].src}
                        alt={project.images[0].alt[lang]}
                        width={900}
                        height={600}
                      />
                    )}
                    <div className="project-heading">
                      <h3>{project.name[lang]}</h3>
                      {project.status && (
                        <span className="project-status">
                          <span aria-hidden="true" />
                          {t(`projects.status.${project.status}`)}
                        </span>
                      )}
                    </div>
                    <dl>
                      {project.location && (
                        <>
                          <dt>{t("projects.location")}</dt>
                          <dd>{project.location}</dd>
                        </>
                      )}
                      <dt>{t("projects.infrastructure")}</dt>
                      <dd>{project.infrastructure[lang]}</dd>
                      {project.capacity && (
                        <>
                          <dt>{t("projects.capacity")}</dt>
                          <dd>{project.capacity}</dd>
                        </>
                      )}
                      {project.status && (
                        <>
                          <dt>{t("projects.statusLabel")}</dt>
                          <dd>{t(`projects.status.${project.status}`)}</dd>
                        </>
                      )}
                      <dt>
                        {t(
                          project.scopeAttribution === "project"
                            ? "projects.worksScope"
                            : "projects.scope",
                        )}
                      </dt>
                      <dd>{project.scope[lang]}</dd>
                    </dl>
                    <p>{project.description[lang]}</p>
                    {project.images.slice(1).map((img) => (
                      <Image
                        key={img.src}
                        src={img.src}
                        alt={img.alt[lang]}
                        width={900}
                        height={600}
                      />
                    ))}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section id="proceso" className="section process">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">{t("process.eyebrow")}</span>
              <h2 className="line-break">{t("process.title")}</h2>
            </div>
            <p>{t("process.intro")}</p>
          </Reveal>
          <ol className="process-grid">
            {stages.map((stage, i) => (
              <li key={stage.title}>
                <Reveal delay={i * 0.04}>
                  <div className="process-line">
                    <span>0{i + 1}</span>
                    <ArrowRight size={18} />
                  </div>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="contact-banner">
        <div className="container">
          <Reveal>
            <span className="eyebrow light">{t("contact.eyebrow")}</span>
            <h2>{t("contact.title")}</h2>
            <div className="banner-bottom">
              <p>{t("contact.description")}</p>
              <Link
                href={`/${locale}/contacto`}
                className="button button-white"
              >
                {t("contact.cta")}
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </Reveal>
        </div>
        <Landmark
          className="banner-icon"
          size={380}
          strokeWidth={0.4}
          aria-hidden="true"
        />
      </section>
    </main>
  );
}
