import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import ts from "typescript";
const projectRequire = createRequire(resolve("package.json"));
const cache = new Map();
function load(relative) {
  if (cache.has(relative)) return cache.get(relative);
  const code = ts.transpileModule(readFileSync(resolve(relative), "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const mod = { exports: {} };
  cache.set(relative, mod.exports);
  const requireModule = (name) =>
    name.startsWith("@/")
      ? load(`src/${name.slice(2)}.ts`)
      : projectRequire(name);
  new Function("require", "exports", "module", code)(
    requireModule,
    mod.exports,
    mod,
  );
  return mod.exports;
}
const { NextRequest } = projectRequire("next/server");
const { POST } = load("src/app/api/leads/route.ts");
const { leadSchema } = load("src/lib/validation.ts");
const valid = {
  kind: "feasibility",
  locale: "es",
  name: "Persona de prueba",
  company: "Empresa de prueba",
  email: "prueba@example.com",
  phone: "+52 555 123 4567",
  location: "México",
  projectType: "industrial-park",
  capacity: "2 MW",
  startDate: "2027-01-01",
  message: "Solicitud de prueba para un desarrollo industrial en México.",
  consent: true,
  website: "",
  startedAt: Date.now() - 5000,
};
const request = (body, headers = {}) =>
  new NextRequest("http://localhost:3000/api/leads", {
    method: "POST",
    headers: {
      origin: "http://localhost:3000",
      "content-type": "application/json",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
test("accepts valid feasibility and contact data; rejects zero capacity and missing consent", () => {
  assert.equal(leadSchema.safeParse(valid).success, true);
  assert.equal(
    leadSchema.safeParse({
      ...valid,
      kind: "contact",
      location: undefined,
      projectType: undefined,
      capacity: undefined,
      startDate: undefined,
    }).success,
    true,
  );
  assert.equal(
    leadSchema.safeParse({ ...valid, capacity: "0 MW" }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({ ...valid, consent: false }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({ ...valid, email: "invalid" }).success,
    false,
  );
});
test("rejects cross-origin requests", async () =>
  assert.equal(
    (await POST(request(valid, { origin: "https://other.example" }))).status,
    403,
  ));
test("rejects incorrect content type", async () =>
  assert.equal(
    (await POST(request(valid, { "content-type": "text/plain" }))).status,
    415,
  ));
test("rejects oversized bodies", async () =>
  assert.equal((await POST(request("x".repeat(20001)))).status, 413));
test("rejects malformed JSON", async () =>
  assert.equal((await POST(request("{"))).status, 400));
test("rejects invalid data and honeypot", async () => {
  assert.equal(
    (await POST(request({ ...valid, email: "invalid" }))).status,
    400,
  );
  assert.equal(
    (await POST(request({ ...valid, website: "spam" }))).status,
    400,
  );
  assert.equal(
    (await POST(request({ ...valid, startedAt: Date.now() }))).status,
    400,
  );
});
test("never confirms delivery without an active integration", async () => {
  const keys = [
    "RESEND_API_KEY",
    "LEADS_FROM_EMAIL",
    "LEADS_TO_EMAIL",
    "PRIVACY_NOTICE_APPROVED",
  ];
  const saved = keys.map((key) => process.env[key]);
  keys.forEach((key) => delete process.env[key]);
  try {
    const response = await POST(request(valid));
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "not_configured" });
  } finally {
    keys.forEach((key, i) => {
      if (saved[i] !== undefined) process.env[key] = saved[i];
    });
  }
});
