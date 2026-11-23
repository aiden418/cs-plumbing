import { after, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { BUSINESS } from "../src/lib/constants";

/**
 * /api/builder-portal, driven the way the two builder forms drive it (a
 * multipart POST), with the Resend API replaced by a stub. Nothing leaves the
 * machine: the stub refuses any URL that is not Resend's send endpoint.
 *
 * The stub answers like the real API. That matters for the rejection cases:
 * Resend's SDK does not throw when a send is refused, it resolves with
 * `{ data: null, error }`, which is how a lost builder lead used to come back
 * to the browser as a success.
 */

// SMS_TO and ADMIN_EMAIL are read when src/lib/api/secure.ts loads, the API
// key on each request, so all three are settled before the route is imported.
process.env.RESEND_API_KEY = "re_test_not_a_real_key";
process.env.SMS_GATEWAY_TO = "2395550100@sms.invalid";
delete process.env.ADMIN_EMAIL;

interface SentEmail {
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
  reply_to?: string;
  attachments?: { filename: string; content: string }[];
}

let POST: (request: Request) => Promise<Response>;
let ADMIN_EMAIL: string;
/** Every send the route attempted, in order, including the ones the stub refused. */
let sent: SentEmail[] = [];
let refuse: (email: SentEmail) => boolean = () => false;

const realFetch = globalThis.fetch;
const realConsoleError = console.error;
let errorLog: unknown[][] = [];

before(async () => {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url !== "https://api.resend.com/emails") {
      throw new Error(`unexpected outbound request to ${url}`);
    }
    const email = JSON.parse(String(init?.body)) as SentEmail;
    sent.push(email);
    if (refuse(email)) {
      return Response.json(
        { statusCode: 422, name: "validation_error", message: "refused by the test stub" },
        { status: 422 },
      );
    }
    return Response.json({ id: `re_test_${sent.length}` });
  }) as typeof fetch;

  ({ ADMIN_EMAIL } = await import("../src/lib/api/secure"));
  ({ POST } = await import("../src/app/api/builder-portal/route"));
});

after(() => {
  globalThis.fetch = realFetch;
  console.error = realConsoleError;
});

beforeEach(() => {
  sent = [];
  refuse = () => false;
  errorLog = [];
  // The route logs every failure; keep the test output readable and let the
  // tests assert on what was logged.
  console.error = (...args: unknown[]) => {
    errorLog.push(args);
  };
});

const SMS_GATEWAY = "2395550100@sms.invalid";
const SUBMITTER = "builder@example.com";

const pdf = (name = "site plan.pdf") => new File([new Uint8Array(2048)], name, { type: "application/pdf" });
const png = (name = "lot.png") => new File([new Uint8Array(1024)], name, { type: "image/png" });
const txt = (name = "notes.txt") => new File(["hello"], name, { type: "text/plain" });

let lastIp = 0;
/** A fresh client address per request, so the 5-per-minute limiter never interferes. */
const nextIp = () => `10.20.${Math.floor(++lastIp / 250)}.${lastIp % 250}`;

/** The Builder Portal wizard's fields (see BuilderPortalPage.tsx), valid unless overridden. */
function submission(
  overrides: Record<string, string> = {},
  files: File[] = [],
  headers: Record<string, string> = {},
): Request {
  const fields: Record<string, string> = {
    name: "Test Builder",
    company: "QA Homes LLC",
    email: SUBMITTER,
    phone: "239-555-0100",
    address: "123 Test St, Cape Coral, FL 33904",
    community: "",
    projectType: "Residential New Construction",
    units: "12",
    sqft: "2,400",
    startDate: "2027-01-15",
    budget: "Not Sure",
    description: "Twelve single-family homes, two baths each.",
    website: "",
    ...overrides,
  };
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  for (const file of files) body.append("files", file);
  return new Request("http://localhost:3000/api/builder-portal", {
    method: "POST",
    body,
    headers: { "x-forwarded-for": nextIp(), ...headers },
  });
}

const logged = () => errorLog.map((args) => args.map(String).join(" ")).join("\n");

test("a valid submission emails the office with the plans, texts the SMS gateway, confirms to the builder and returns one Lead ID", async () => {
  const res = await POST(submission({}, [pdf(), png()]));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(Object.keys(body).sort(), ["eventId", "leadId", "leadType", "success"]);
  assert.equal(body.success, true);
  assert.match(body.leadId, /^CS-[0-9A-HJKMNP-TV-Z]{8}$/);
  assert.equal(body.eventId, body.leadId, "tracking and the office email carry the same ID");
  assert.equal(body.leadType, "builder_bid");

  assert.equal(sent.length, 3);
  const [office, sms, confirmation] = sent;

  assert.deepEqual(office.to, [ADMIN_EMAIL]);
  assert.equal(office.reply_to, SUBMITTER);
  assert.equal(
    office.subject,
    `Builder Bid Request: QA Homes LLC — Residential New Construction at 123 Test St, Cape Coral, FL 33904 [${body.leadId}]`,
  );
  assert.match(office.html ?? "", /Request type:<\/strong> Builder bid request/);
  assert.ok((office.html ?? "").includes(`Lead ID:</strong> ${body.leadId}`));
  assert.deepEqual(office.attachments?.map((a) => a.filename), ["site plan.pdf", "lot.png"]);
  assert.match(office.html ?? "", /2 files attached to this email/);
  assert.match(office.html ?? "", /Source: builder-portal/);

  assert.deepEqual(sms.to, [SMS_GATEWAY]);
  assert.equal(sms.subject, "Builder Bid Request");
  assert.ok((sms.text ?? "").length <= 160);
  assert.match(sms.text ?? "", /QA Homes LLC/);
  assert.equal(sms.attachments, undefined);

  assert.deepEqual(confirmation.to, [SUBMITTER]);
  assert.equal(confirmation.subject, `We received your bid request — C&S Plumbing [${body.leadId}]`);
  assert.ok((confirmation.html ?? "").includes(`Request ID ${body.leadId}`));
  assert.match(confirmation.html ?? "", /Files received:<\/strong> 2/);
  assert.equal(confirmation.attachments, undefined);

  assert.equal(errorLog.length, 0);
});

test("the short bid form (community instead of a street address, no description) is accepted", async () => {
  const res = await POST(
    submission({ address: "", description: "", community: "Cape Coral Unit 42", source: "builders-hub" }),
  );
  assert.equal(res.status, 200);
  assert.equal((await res.json()).success, true);
  assert.match(sent[0].subject, /at Cape Coral Unit 42 \(community\) \[CS-[0-9A-Z]{8}\]$/);
  assert.match(sent[0].html ?? "", /Source: builders-hub/);
  assert.match(sent[0].html ?? "", /No files uploaded/);
});

test("a rejected office email is a 500 with no success flag and no eventId, and nobody else is emailed", async () => {
  refuse = (email) => email.to.includes(ADMIN_EMAIL);
  const res = await POST(submission({}, [pdf()]));

  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: `Failed to submit. Please call ${BUSINESS.phone}.` });
  // Only the office send was attempted: no SMS, and above all no "we received
  // your request" email to a builder whose request the office never got.
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].to, [ADMIN_EMAIL]);
  assert.match(logged(), /Builder portal error:.*Resend rejected builder portal admin email: validation_error/);
});

test("a rejected SMS copy does not fail a lead the office already has", async () => {
  refuse = (email) => email.to.includes(SMS_GATEWAY);
  const res = await POST(submission());

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.eventId);
  assert.deepEqual(sent.map((email) => email.to[0]), [ADMIN_EMAIL, SMS_GATEWAY, SUBMITTER]);
  assert.match(logged(), /builder portal SMS notification failed \(non-fatal\)/);
});

test("a rejected submitter confirmation does not fail a lead the office already has", async () => {
  refuse = (email) => email.to.includes(SUBMITTER);
  const res = await POST(submission());

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.eventId);
  assert.equal(sent.length, 3);
  assert.match(logged(), /builder portal submitter confirmation failed \(non-fatal\)/);
});

test("the honeypot path answers success with no email and no eventId", async () => {
  const res = await POST(submission({ website: "qa" }, [pdf()]));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true });
  assert.equal(sent.length, 0);
});

test("a wrong file type is refused with code attachments and no email", async () => {
  const res = await POST(submission({}, [pdf(), txt()]));
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), {
    error: "notes.txt: only JPG, PNG and PDF files are accepted.",
    code: "attachments",
  });
  assert.equal(sent.length, 0);
});

test("a browser POST from another site is refused; a same-origin one is not", async () => {
  const foreign = await POST(submission({}, [], { origin: "https://evil.example", host: "localhost:3000" }));
  assert.equal(foreign.status, 403);
  assert.deepEqual(await foreign.json(), { error: "Forbidden" });
  assert.equal(sent.length, 0);

  const own = await POST(submission({}, [], { origin: "http://localhost:3000", host: "localhost:3000" }));
  assert.equal(own.status, 200);
});

test("invalid fields are a 400 with the generic message", async () => {
  const res = await POST(submission({ email: "not-an-email" }));
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: "Invalid submission" });

  // Neither a street address nor a community.
  const nowhere = await POST(submission({ address: "", community: "" }));
  assert.equal(nowhere.status, 400);
  assert.equal(sent.length, 0);
});

test("the checks keep their order: rate limit, origin, fields, honeypot, email key, attachments", async () => {
  const foreign = { origin: "https://evil.example", host: "localhost:3000" };

  // origin before fields
  assert.equal((await POST(submission({ email: "nope" }, [], foreign))).status, 403);
  // fields before honeypot
  assert.equal((await POST(submission({ email: "nope", website: "qa" }))).status, 400);
  // honeypot before the email key and before attachments
  const key = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  try {
    const trapped = await POST(submission({ website: "qa" }, [txt()]));
    assert.equal(trapped.status, 200);
    assert.deepEqual(await trapped.json(), { success: true });
    // email key before attachments
    const noKey = await POST(submission({}, [txt()]));
    assert.equal(noKey.status, 500);
    assert.deepEqual(await noKey.json(), {
      error: `Email service unavailable. Please call ${BUSINESS.phone}.`,
    });
  } finally {
    process.env.RESEND_API_KEY = key;
  }

  // rate limit before everything: the sixth request in a minute from one
  // address is refused even though it would otherwise be a 403.
  const ip = "10.99.0.1";
  for (let i = 0; i < 5; i++) {
    const ok = await POST(submission({ website: "qa" }, [], { "x-forwarded-for": ip }));
    assert.equal(ok.status, 200);
  }
  const limited = await POST(submission({}, [], { "x-forwarded-for": ip, ...foreign }));
  assert.equal(limited.status, 429);
  assert.deepEqual(await limited.json(), { error: "Too many requests" });
  assert.ok(Number(limited.headers.get("retry-after")) > 0);

  assert.equal(sent.length, 0);
});

// ── one bid request, one Lead ID ─────────────────────────────────────────────

const KEY = "3f2b8c1e-7a4d-4c9b-9e21-5d6f7a8b9c0d";

test("a retry with the same submission key gets the same Lead ID back and the office is emailed once", async () => {
  const first = await (await POST(submission({ submissionKey: KEY }))).json();
  const emailsAfterFirst = sent.length;
  const again = await POST(submission({ submissionKey: KEY }));
  assert.equal(again.status, 200);
  const second = await again.json();
  assert.equal(second.success, true);
  assert.equal(second.leadId, first.leadId);
  assert.equal(second.duplicate, true);
  assert.equal(first.duplicate, undefined);
  assert.equal(sent.length, emailsAfterFirst, "no second office email, SMS or confirmation");
});

test("a double tap (two requests at once, same key) sends the office one email", async () => {
  const key = "9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d";
  const [a, b] = await Promise.all([
    POST(submission({ submissionKey: key })),
    POST(submission({ submissionKey: key })),
  ]);
  const [first, second] = [await a.json(), await b.json()];
  assert.equal(first.leadId, second.leadId);
  assert.equal(sent.filter((email) => email.to.includes(ADMIN_EMAIL)).length, 1);
  assert.equal([first, second].filter((body) => body.duplicate).length, 1);
});

test("a failed submission is not remembered: the retry with the same key is delivered once", async () => {
  const key = "11111111-2222-4333-8444-555555555555";
  refuse = (email) => email.to.includes(ADMIN_EMAIL);
  const failed = await POST(submission({ submissionKey: key }));
  assert.equal(failed.status, 500);
  assert.equal((await failed.json()).leadId, undefined, "a failure carries no Lead ID to report");
  refuse = () => false;
  sent.length = 0;
  const retried = await (await POST(submission({ submissionKey: key }))).json();
  assert.equal(retried.success, true);
  assert.equal(retried.duplicate, undefined);
  assert.equal(sent.filter((email) => email.to.includes(ADMIN_EMAIL)).length, 1);
  assert.ok(sent[0].subject.endsWith(`[${retried.leadId}]`));
});

test("a marked test request reaches the office labelled TEST and is flagged in the answer", async () => {
  const body = await (await POST(submission({ test: "true" }))).json();
  assert.equal(body.test, true);
  assert.match(sent[0].subject, /^\[TEST\] Builder Bid Request: /);
  assert.match(sent[0].html ?? "", /TEST REQUEST/);
  assert.ok(!sent.some((email) => email.to.includes(SMS_GATEWAY)), "no text message for a test");
});
