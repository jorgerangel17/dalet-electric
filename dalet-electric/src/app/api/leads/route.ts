import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { mailConfigured } from "@/lib/mail";
export const runtime = "nodejs";
// Shared Redis is recommended for a distributed deployment; memory is local fallback.
const buckets = new Map<string, { count: number; until: number }>();
async function limited(key: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, 900, "NX"],
      ]),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("Rate limit unavailable");
    const result = await res.json();
    if (
      !Array.isArray(result) ||
      result.some((item: { error?: string }) => item.error)
    )
      throw new Error("Rate limit unavailable");
    return Number(result[0].result) > 5;
  }
  const now = Date.now();
  if (buckets.size > 10000) {
    for (const [k, v] of buckets) if (v.until < now) buckets.delete(k);
    if (buckets.size > 10000) return true;
  }
  const current = buckets.get(key);
  if (!current || current.until < now) {
    buckets.set(key, { count: 1, until: now + 900000 });
    return false;
  }
  return ++current.count > 5;
}
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin)
    return NextResponse.json({ error: "origin" }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json({ error: "content-type" }, { status: 415 });
  if (Number(request.headers.get("content-length") || 0) > 20000)
    return NextResponse.json({ error: "size" }, { status: 413 });
  try {
    const body = await request.text();
    if (body.length > 20000)
      return NextResponse.json({ error: "size" }, { status: 413 });
    const data = leadSchema.safeParse(JSON.parse(body));
    if (!data.success)
      return NextResponse.json({ error: "validation" }, { status: 400 });
    const lead = data.data;
    if (Date.now() - lead.startedAt < 3000 || lead.startedAt > Date.now())
      return NextResponse.json({ error: "validation" }, { status: 400 });
    if (!mailConfigured())
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    // Vercel overwrites x-vercel-forwarded-for; never trust arbitrary client IP headers elsewhere.
    const ip = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "local";
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip),
    );
    const key =
      "dalet:leads:" +
      Array.from(new Uint8Array(digest))
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("");
    if (await limited(key))
      return NextResponse.json(
        { error: "rate_limit" },
        { status: 429, headers: { "Retry-After": "900" } },
      );
    const labels = {
      kind: "Solicitud",
      locale: "Idioma",
      name: "Nombre",
      company: "Empresa",
      email: "Correo",
      phone: "Teléfono",
      location: "Ubicación",
      projectType: "Tipo",
      capacity: "Capacidad",
      startDate: "Inicio estimado",
      message: "Descripción",
    };
    const text =
      Object.entries(labels)
        .map(
          ([key, label]) =>
            `${label}: ${lead[key as keyof typeof lead] || "—"}`,
        )
        .join("\n\n") +
      "\n\nConsentimiento de privacidad: aceptado.\nFecha: " +
      new Date().toISOString();
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEADS_FROM_EMAIL,
        to: [process.env.LEADS_TO_EMAIL],
        reply_to: lead.email,
        subject:
          lead.kind === "feasibility"
            ? "DALET — Solicitud de factibilidad"
            : "DALET — Solicitud de reunión",
        text,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok)
      return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
    const delivery = await response.json();
    if (!delivery.id)
      return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "request_failed" }, { status: 400 });
  }
}
