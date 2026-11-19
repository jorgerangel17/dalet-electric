"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, LoaderCircle, Info } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validation";
export function LeadForm({
  kind = "feasibility",
  enabled = false,
}: {
  kind?: "feasibility" | "contact";
  enabled?: boolean;
}) {
  const t = useTranslations("form");
  const locale = useLocale() as "es" | "en";
  const [status, setStatus] = useState("");
  const [startedAt] = useState(() => Date.now());
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { kind, locale, website: "", startedAt },
  });
  const submit = async (data: LeadInput) => {
    setStatus("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setStatus("success");
        reset({ kind, locale, website: "", startedAt });
      } else {
        setStatus(
          response.status === 503
            ? "unavailable"
            : response.status === 429
              ? "rate"
              : "error",
        );
      }
    } catch {
      setStatus("error");
    }
  };
  const field = (
    key:
      | "name"
      | "company"
      | "email"
      | "phone"
      | "location"
      | "capacity"
      | "startDate",
    type = "text",
  ) => (
    <div className="field" key={key}>
      <label htmlFor={`${kind}-${key}`}>
        {t(key)}
        <span aria-hidden="true"> *</span>
      </label>
      <input
        id={`${kind}-${key}`}
        type={type}
        {...register(key)}
        autoComplete={
          (
            {
              name: "name",
              company: "organization",
              email: "email",
              phone: "tel",
            } as Record<string, string>
          )[key] || "off"
        }
        aria-required="true"
        aria-invalid={!!errors[key]}
        aria-describedby={
          errors[key]
            ? `${kind}-${key}-error`
            : key === "capacity"
              ? `${kind}-capacity-hint`
              : undefined
        }
        placeholder={key === "capacity" ? "500 kW / 2 MW" : undefined}
      />
      {key === "capacity" && (
        <small id={`${kind}-capacity-hint`}>{t("capacityHint")}</small>
      )}
      {errors[key] && (
        <small className="field-error" id={`${kind}-${key}-error`}>
          {key === "capacity" ? t("capacityError") : t("validation")}
        </small>
      )}
    </div>
  );
  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="lead-form">
      <p className="form-required">{t("required")}</p>
      <div className="form-grid">
        {field("name")}
        {field("company")}
        {field("email", "email")}
        {field("phone", "tel")}
        {kind === "feasibility" && (
          <>
            {field("location")}
            <div className="field">
              <label htmlFor={`${kind}-projectType`}>
                {t("projectType")} *
              </label>
              <select
                id={`${kind}-projectType`}
                {...register("projectType")}
                aria-required="true"
                aria-invalid={!!errors.projectType}
                aria-describedby={
                  errors.projectType ? `${kind}-projectType-error` : undefined
                }
              >
                <option value="">{t("select")}</option>
                {(t.raw("types") as string[]).map((label, i) => (
                  <option
                    value={
                      [
                        "industrial-park",
                        "manufacturing",
                        "real-estate",
                        "commercial",
                        "other",
                      ][i]
                    }
                    key={label}
                  >
                    {label}
                  </option>
                ))}
              </select>
              {errors.projectType && (
                <small className="field-error" id={`${kind}-projectType-error`}>
                  {t("validation")}
                </small>
              )}
            </div>
            {field("capacity")}
            {field("startDate", "date")}
          </>
        )}
      </div>
      <div className="field message-field">
        <label htmlFor={`${kind}-message`}>
          {t(kind === "contact" ? "contactMessage" : "message")} *
        </label>
        <textarea
          id={`${kind}-message`}
          rows={4}
          {...register("message")}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? `${kind}-message-error` : undefined
          }
        />
        {errors.message && (
          <small className="field-error" id={`${kind}-message-error`}>
            {t("validation")}
          </small>
        )}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${kind}-website`}>{t("spam")}</label>
        <input
          id={`${kind}-website`}
          {...register("website")}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label className="consent">
        <input
          type="checkbox"
          {...register("consent")}
          aria-required="true"
          aria-invalid={!!errors.consent}
          aria-describedby={
            errors.consent ? `${kind}-consent-error` : undefined
          }
        />
        <span>
          {t("consent")}{" "}
          <Link
            href={`/${locale}/privacidad`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("privacyLink")} ↗
          </Link>
        </span>
      </label>
      {errors.consent && (
        <p className="field-error" id={`${kind}-consent-error`}>
          {t("consentError")}
        </p>
      )}
      {!enabled && (
        <p className="form-notice">
          <Info size={17} />
          <span>{t("unavailable")}</span>
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting || !enabled}
        className="button submit-button"
      >
        {isSubmitting
          ? t("sending")
          : t(kind === "contact" ? "meeting" : "submit")}
        {isSubmitting ? (
          <LoaderCircle size={18} className="spin" />
        ) : (
          <ArrowUpRight size={18} />
        )}
      </button>
      <div role="status" aria-live="polite">
        {status && (
          <p className={`form-status ${status === "success" ? "success" : ""}`}>
            {status === "success" && <CheckCircle2 size={20} />} {t(status)}
          </p>
        )}
      </div>
    </form>
  );
}
