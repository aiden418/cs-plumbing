/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS on purpose: loaded with NODE_OPTIONS=--require before Next starts. */
/**
 * Local form-delivery harness. Loaded with NODE_OPTIONS=--require by
 * `npm run start:capture`, it intercepts every call to the Resend API and
 * writes the would-be email (to, subject, html, attachments) to
 * .resend-capture.jsonl instead of sending it.
 *
 * It also stands in for Vercel Blob storage on the builder portal: a GET of
 * a public blob URL (https://<store>.public.blob.vercel-storage.com/builder-portal/x.pdf)
 * is served from BLOB_FIXTURE_DIR (default .blob-fixtures) by the URL's
 * basename, so /api/builder-portal can be exercised with plan files of any
 * size and no network. The Blob API itself (vercel.com/api/blob and the bare
 * storage host) answers 501 so a plain fetch of it can never pass silently;
 * note the server SDK uses its own undici fetch, which this patch cannot see.
 * Nothing else is touched.
 *
 *   npm run build && npm run start:capture
 *   curl -F name="Test" -F email="you@example.com" -F phone="2395551234" \
 *        -F zip="33903" -F service="leak" -F photos=@leak.jpg \
 *        http://localhost:3000/api/contact
 *   tail -1 .resend-capture.jsonl | node -e 'const r=JSON.parse(require("fs").readFileSync(0,"utf8"));const b=JSON.parse(r.body);console.log(b.to,b.subject,(b.attachments||[]).map(a=>a.filename))'
 *
 * See docs/forms-and-photos.md (builder-portal JSON examples included).
 */
const fs = require("fs");
const path = require("path");
const out = process.env.RESEND_CAPTURE || ".resend-capture.jsonl";
const fixtureDir = path.resolve(process.env.BLOB_FIXTURE_DIR || ".blob-fixtures");
const realFetch = globalThis.fetch;

const CONTENT_TYPES = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

globalThis.fetch = async function capturingFetch(input, init) {
  const url = typeof input === "string" ? input : input && input.url ? input.url : String(input);
  if (url.startsWith("https://api.resend.com/")) {
    const body = init && init.body ? String(init.body) : "";
    fs.appendFileSync(
      out,
      JSON.stringify({ at: new Date().toISOString(), url, method: init && init.method, body }) + "\n",
    );
    return new Response(JSON.stringify({ id: `re_local_${Date.now()}` }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
  let parsed = null;
  try {
    parsed = new URL(url);
  } catch {
    // relative or odd URL: not ours
  }
  if (parsed && parsed.hostname.endsWith(".public.blob.vercel-storage.com")) {
    return serveFixture(parsed);
  }
  if (
    parsed &&
    (parsed.hostname === "blob.vercel-storage.com" ||
      (parsed.hostname === "vercel.com" && parsed.pathname.startsWith("/api/blob")))
  ) {
    return new Response(JSON.stringify({ error: "Blob API calls are not mocked by resend-capture" }), {
      status: 501,
      headers: { "content-type": "application/json" },
    });
  }
  return realFetch(input, init);
};

function serveFixture(parsed) {
  const name = path.basename(decodeURIComponent(parsed.pathname));
  const file = path.join(fixtureDir, name);
  if (!name || !fs.existsSync(file)) {
    return new Response("Not found", { status: 404 });
  }
  const body = fs.readFileSync(file);
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": CONTENT_TYPES[path.extname(name).toLowerCase()] || "application/octet-stream",
      "content-length": String(body.length),
    },
  });
}

console.log(`[resend-capture] Resend calls are written to ${out}; no email is sent. Blob files are read from ${fixtureDir}.`);
