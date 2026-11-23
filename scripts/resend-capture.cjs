/**
 * Local form-delivery harness. Loaded with NODE_OPTIONS=--require by
 * `npm run start:capture`, it intercepts every call to the Resend API and
 * writes the would-be email (to, subject, html, attachments) to
 * .resend-capture.jsonl instead of sending it. Nothing else is touched.
 *
 *   npm run build && npm run start:capture
 *   curl -F name="Test" -F email="you@example.com" -F phone="2395551234" \
 *        -F zip="33903" -F service="leak" -F photos=@leak.jpg \
 *        http://localhost:3000/api/contact
 *   tail -1 .resend-capture.jsonl | node -e 'const r=JSON.parse(require("fs").readFileSync(0,"utf8"));const b=JSON.parse(r.body);console.log(b.to,b.subject,(b.attachments||[]).map(a=>a.filename))'
 *
 * See docs/forms-and-photos.md.
 */
const fs = require("fs");
const out = process.env.RESEND_CAPTURE || ".resend-capture.jsonl";
// Failed-delivery tests: write a number N to this file and the next N sends
// are refused the way Resend refuses one (the form then shows its error and
// no lead is counted). Each refusal is recorded with "refused": true and
// lowers the number; the file is removed at zero.
//
//   echo 1 > .resend-capture.fail
const failFile = process.env.RESEND_CAPTURE_FAIL || ".resend-capture.fail";
const realFetch = globalThis.fetch;

function shouldRefuse() {
  let left = 0;
  try {
    left = parseInt(fs.readFileSync(failFile, "utf8"), 10) || 0;
  } catch {
    return false;
  }
  if (left <= 0) return false;
  if (left === 1) fs.rmSync(failFile, { force: true });
  else fs.writeFileSync(failFile, String(left - 1));
  return true;
}

globalThis.fetch = async function capturingFetch(input, init) {
  const url = typeof input === "string" ? input : input && input.url ? input.url : String(input);
  if (url.startsWith("https://api.resend.com/")) {
    const body = init && init.body ? String(init.body) : "";
    const refused = shouldRefuse();
    fs.appendFileSync(
      out,
      JSON.stringify({ at: new Date().toISOString(), url, method: init && init.method, ...(refused ? { refused: true } : {}), body }) + "\n",
    );
    if (refused) {
      return new Response(
        JSON.stringify({ statusCode: 422, name: "validation_error", message: "refused by the capture harness (.resend-capture.fail)" }),
        { status: 422, headers: { "content-type": "application/json" } },
      );
    }
    return new Response(JSON.stringify({ id: `re_local_${Date.now()}` }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
  return realFetch(input, init);
};

console.log(`[resend-capture] Resend calls are written to ${out}; no email is sent.`);
