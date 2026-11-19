export function mailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
    process.env.LEADS_FROM_EMAIL &&
    process.env.LEADS_TO_EMAIL &&
    process.env.PRIVACY_NOTICE_APPROVED === "true",
  );
}
