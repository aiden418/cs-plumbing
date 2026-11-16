/**
 * scripts/indexnow.mjs: what counts as "this page changed", what is sent to
 * Bing, and what happens when the live site or the deploy does not cooperate.
 * No test here touches the network: fetch and sleep are passed in.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  ENDPOINT,
  KEY,
  KEY_URL,
  SITE,
  SecurityCheckError,
  comparePages,
  fingerprint,
  keyFileIsLive,
  main,
  pageContent,
  readLiveSite,
  requestBodies,
  send,
  urlsFromSitemap,
  waitForDeploy,
} from "../scripts/indexnow.mjs";

const ROOT = path.join(import.meta.dirname, "..");

/** A page the way Next writes one: hashed assets, a script payload, React comment markers. */
function page(over: Partial<{ title: string; description: string; main: string; build: string; header: string; jsonLd: string }> = {}) {
  const p = {
    title: "Water Heater Repair &amp; Installation | Fort Myers &amp; Cape Coral",
    description: "Tank and tankless water heaters.",
    main: '<h1 class="text-display-lg">Water heaters<!-- --> done right</h1><p>Same-day replacement.</p><img alt="A new tank water heater" src="/_next/image?url=%2Fa.jpg&amp;w=640&amp;q=75"/>',
    build: "a1b2c3",
    header: "<header><a href=\"/\">Home</a></header>",
    jsonLd: '{"@context":"https://schema.org","@type":"Service","name":"Water heaters"}',
    ...over,
  };
  return `<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><title>${p.title}</title>
<meta name="description" content="${p.description}"/><meta name="robots" content="index, follow"/>
<link rel="canonical" href="${SITE}/services/water-heaters"/>
<link rel="stylesheet" href="/_next/static/css/${p.build}.css"/><script src="/_next/static/chunks/main-${p.build}.js" async=""></script>
<script type="application/ld+json">${p.jsonLd}</script></head>
<body>${p.header}<main id="main">${p.main}</main><footer>© 2026</footer>
<script>self.__next_f.push([1,"build ${p.build} payload"])</script></body></html>`;
}

/* ---------------------------------------------------------- fingerprints -- */

test("a new build of the same content is not a change", () => {
  const before = fingerprint(page());
  assert.equal(fingerprint(page({ build: "zz99yy" })), before, "hashed file names and the script payload are ignored");
  assert.equal(
    fingerprint(page({ main: page().match(/<main[^>]*>([\s\S]*)<\/main>/)![1].replace('class="text-display-lg"', 'class="text-display-xl font-bold"') })),
    before,
    "class names are ignored",
  );
  assert.equal(fingerprint(page({ header: "<header><a href=\"/\">Home</a><a href=\"/new\">New link</a></header>" })), before, "the header and footer are ignored");
  assert.equal(
    fingerprint(page({ jsonLd: '{"name":"Water heaters","@type":"Service","@context":"https://schema.org"}' })),
    before,
    "JSON-LD key order is ignored",
  );
});

test("what a search engine reads is a change", () => {
  const before = fingerprint(page());
  const changes = {
    title: page({ title: "Water Heaters | C&amp;S Plumbing" }),
    description: page({ description: "Tank, tankless and hybrid water heaters." }),
    words: page({ main: "<h1>Water heaters done right</h1><p>Next-day replacement.</p>" }),
    "image description": page({ main: page().match(/<main[^>]*>([\s\S]*)<\/main>/)![1].replace("A new tank water heater", "A tankless water heater") }),
    "structured data": page({ jsonLd: '{"@context":"https://schema.org","@type":"Service","name":"Tankless water heaters"}' }),
  };
  for (const [what, html] of Object.entries(changes)) assert.notEqual(fingerprint(html), before, `${what} changed`);
});

test("the content read from a page is the title, description, canonical, words, image descriptions and JSON-LD", () => {
  const content = pageContent(page());
  assert.equal(content.title, "Water Heater Repair &amp; Installation | Fort Myers &amp; Cape Coral");
  assert.equal(content.description, "Tank and tankless water heaters.");
  assert.equal(content.robots, "index, follow");
  assert.equal(content.canonical, `${SITE}/services/water-heaters`);
  assert.equal(content.text, "Water heaters done right Same-day replacement.");
  assert.deepEqual(content.images, ["A new tank water heater"]);
  assert.equal(content.jsonLd.length, 1);
  // A page with no <main> (the print documents) is read from its <body>.
  assert.equal(pageContent("<html><head><title>T</title></head><body><p>Terms of service</p></body></html>").text, "Terms of service");
});

test("the sitemap's page addresses are read; image entries and other hosts are not", () => {
  const xml = `<?xml version="1.0"?><urlset><url><loc>${SITE}</loc><image:image><image:loc>${SITE}/images/a.jpg</image:loc></image:image></url>
<url><loc> ${SITE}/services/water-heaters </loc></url><url><loc>${SITE}/blog/a&amp;b</loc></url>
<url><loc>https://example.com/elsewhere</loc></url><url><loc>${SITE}/services/water-heaters</loc></url></urlset>`;
  assert.deepEqual(urlsFromSitemap(xml), [SITE, `${SITE}/services/water-heaters`, `${SITE}/blog/a&b`]);
});

test("new, changed and removed pages are sent; unchanged pages are not; a first run sends every page", () => {
  const previous = { [`${SITE}/a`]: "1", [`${SITE}/b`]: "2", [`${SITE}/gone`]: "3" };
  const current = { [`${SITE}/a`]: "1", [`${SITE}/b`]: "2x", [`${SITE}/new`]: "4" };
  assert.deepEqual(comparePages(previous, current), {
    firstRun: false,
    added: [`${SITE}/new`],
    changed: [`${SITE}/b`],
    removed: [`${SITE}/gone`],
  });
  assert.deepEqual(comparePages(null, current), {
    firstRun: true,
    added: [`${SITE}/a`, `${SITE}/b`, `${SITE}/new`],
    changed: [],
    removed: [],
  });
});

/* ------------------------------------------------------------ the notice -- */

test("the key file in public/ holds exactly the key the script sends", () => {
  assert.match(KEY, /^[a-f0-9]{32}$/, "8 to 128 characters of a-z, A-Z, 0-9 and dashes; this one is 32 hex digits");
  assert.equal(KEY_URL, `${SITE}/${KEY}.txt`);
  const file = path.join(ROOT, "public", `${KEY}.txt`);
  assert.ok(existsSync(file), `public/${KEY}.txt is missing`);
  assert.equal(readFileSync(file, "utf8"), KEY);
  // One key file only: an old one left behind would still vouch for whoever holds its key.
  const others = readdirSync(path.join(ROOT, "public")).filter((f) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(f) && f !== `${KEY}.txt` && f !== "robots.txt");
  assert.deepEqual(others, []);
});

test("a notice names the host, the key, where the key file is, and only this site's pages", () => {
  assert.deepEqual(requestBodies([SITE, `${SITE}/faq`]), [
    { host: "www.csplumbinglee.com", key: KEY, keyLocation: KEY_URL, urlList: [SITE, `${SITE}/faq`] },
  ]);
  assert.deepEqual(requestBodies([]), []);
  const many = Array.from({ length: 10_001 }, (_, i) => `${SITE}/p/${i}`);
  assert.deepEqual(requestBodies(many).map((b) => b.urlList.length), [10_000, 1]);
  assert.throws(() => requestBodies([`${SITE}/faq`, "https://example.com/x"]), /Only pages of/);
  assert.throws(() => requestBodies(["https://www.csplumbinglee.com.evil.example/x"]), /Only pages of/);
});

type Call = { url: string; init?: RequestInit };
const answer = (status: number, body = "", headers: Record<string, string> = {}) => new Response(status === 204 ? null : body, { status, headers });

/** Network stand-in: `routes` maps a URL (or a prefix ending in *) to a response factory. */
function fakeDeps(routes: Record<string, (call: Call) => Response>) {
  const calls: Call[] = [];
  const slept: number[] = [];
  const logs: string[] = [];
  return {
    calls,
    slept,
    logs,
    deps: {
      fetch: async (url: string, init?: RequestInit) => {
        const call = { url: String(url), init };
        calls.push(call);
        const key = Object.keys(routes).find((k) => (k.endsWith("*") ? call.url.startsWith(k.slice(0, -1)) : k === call.url));
        if (!key) throw new Error(`unexpected request to ${call.url}`);
        return routes[key](call);
      },
      sleep: async (ms: number) => {
        slept.push(ms);
      },
      log: (line: string) => {
        logs.push(line);
      },
    },
  };
}

test("send posts to Bing's IndexNow address and treats 200 and 202 as accepted", async () => {
  for (const status of [200, 202]) {
    const net = fakeDeps({ [ENDPOINT]: () => answer(status) });
    await send([`${SITE}/faq`], net.deps);
    assert.equal(net.calls.length, 1);
    assert.equal(net.calls[0].init?.method, "POST");
    assert.deepEqual(JSON.parse(String(net.calls[0].init?.body)), {
      host: "www.csplumbinglee.com",
      key: KEY,
      keyLocation: KEY_URL,
      urlList: [`${SITE}/faq`],
    });
  }
});

test("a refused notice stops the run with the reason", async () => {
  const net = fakeDeps({ [ENDPOINT]: () => answer(403) });
  await assert.rejects(send([`${SITE}/faq`], net.deps), /HTTP 403.*key was not accepted/);
  const busy = fakeDeps({ [ENDPOINT]: () => answer(429) });
  await assert.rejects(send([`${SITE}/faq`], busy.deps), /HTTP 429/);
});

test("the key file check wants the exact key at the exact address", async () => {
  assert.equal(await keyFileIsLive(fakeDeps({ [KEY_URL]: () => answer(200, `${KEY}\n`) }).deps), true);
  assert.equal(await keyFileIsLive(fakeDeps({ [KEY_URL]: () => answer(200, "something else") }).deps), false);
  assert.equal(await keyFileIsLive(fakeDeps({ [KEY_URL]: () => answer(404, "Not found") }).deps), false);
});

/* ---------------------------------------------------------- the live site -- */

const SITEMAP = `<urlset><url><loc>${SITE}</loc></url><url><loc>${SITE}/faq</loc></url><url><loc>${SITE}/old</loc></url></urlset>`;

test("every page in the live sitemap gets a fingerprint; a redirect or a missing page is recorded as that", async () => {
  const net = fakeDeps({
    [`${SITE}/sitemap.xml`]: () => answer(200, SITEMAP),
    [SITE]: () => answer(200, page()),
    [`${SITE}/faq`]: () => answer(200, page({ title: "FAQ" })),
    [`${SITE}/old`]: () => answer(308, "", { location: "/faq" }),
  });
  const pages = await readLiveSite(net.deps);
  assert.deepEqual(Object.keys(pages).sort(), [SITE, `${SITE}/faq`, `${SITE}/old`]);
  assert.equal(pages[SITE], fingerprint(page()));
  assert.notEqual(pages[`${SITE}/faq`], pages[SITE]);
  assert.equal(pages[`${SITE}/old`], "status 308 /faq");
});

test("a security check instead of a page stops the run and says so", async () => {
  const net = fakeDeps({
    [`${SITE}/sitemap.xml`]: () => answer(200, SITEMAP),
    [`${SITE}*`]: () => answer(403, "<title>Vercel Security Checkpoint</title>", { "x-vercel-mitigated": "challenge" }),
  });
  await assert.rejects(readLiveSite(net.deps), (error: unknown) => {
    assert.ok(error instanceof SecurityCheckError);
    assert.match((error as Error).message, /security check/);
    assert.match((error as Error).message, /Nothing was sent/);
    return true;
  });
});

test("a page that keeps answering with a server error stops the run after three tries", async () => {
  const net = fakeDeps({
    [`${SITE}/sitemap.xml`]: () => answer(200, `<urlset><url><loc>${SITE}/faq</loc></url></urlset>`),
    [`${SITE}/faq`]: () => answer(503, "busy"),
  });
  await assert.rejects(readLiveSite(net.deps), /Could not read .*\/faq.*503/);
  assert.equal(net.calls.filter((c) => c.url === `${SITE}/faq`).length, 3);
});

/* -------------------------------------------------------------- the deploy -- */

const API = "https://api.github.com/repos/owner/repo";
const SHA = "9a2afc4100000000000000000000000000000000";

test("the run waits until Vercel has reported the production deploy of the commit", async () => {
  let asked = 0;
  const net = fakeDeps({
    [`${API}/deployments?sha=${SHA}&environment=Production&per_page=5`]: () => {
      asked++;
      return answer(200, JSON.stringify(asked < 3 ? [] : [{ id: 77 }]));
    },
    [`${API}/deployments/77/statuses?per_page=5`]: () => answer(200, JSON.stringify([{ state: "success" }])),
  });
  assert.equal(await waitForDeploy({ repo: "owner/repo", sha: SHA, token: "t", everyMs: 10 }, net.deps), "live");
  assert.deepEqual(net.slept, [10, 10]);
  assert.equal((net.calls[0].init?.headers as Record<string, string>).authorization, "Bearer t");
});

test("a failed deploy, and a deploy that never shows up, end the wait without sending", async () => {
  const failed = fakeDeps({
    [`${API}/deployments*`]: (call) => answer(200, JSON.stringify(call.url.includes("/statuses") ? [{ state: "failure" }] : [{ id: 5 }])),
  });
  assert.equal(await waitForDeploy({ repo: "owner/repo", sha: SHA, everyMs: 10 }, failed.deps), "failed");

  const never = fakeDeps({ [`${API}/deployments*`]: () => answer(200, "[]") });
  assert.equal(await waitForDeploy({ repo: "owner/repo", sha: SHA, everyMs: 10, timeoutMs: 30 }, never.deps), "none");
  assert.equal(never.slept.length, 3);
});

/* -------------------------------------------------------------- whole runs -- */

function liveSite(extra: Record<string, (call: Call) => Response> = {}) {
  return {
    [`${SITE}/sitemap.xml`]: () => answer(200, `<urlset><url><loc>${SITE}</loc></url><url><loc>${SITE}/faq</loc></url></urlset>`),
    [SITE]: () => answer(200, page()),
    [`${SITE}/faq`]: () => answer(200, page({ title: "FAQ" })),
    [KEY_URL]: () => answer(200, KEY),
    [ENDPOINT]: () => answer(200),
    ...extra,
  };
}

/** The environment variables the script reads; each test starts without them and they are put back after. */
const ENV = ["INDEXNOW_STATE_DIR", "INDEXNOW_PREVIOUS", "GITHUB_ACTIONS", "GITHUB_OUTPUT", "GITHUB_STEP_SUMMARY", "GITHUB_SHA", "GITHUB_REPOSITORY", "GITHUB_TOKEN"];

async function withStateDir<T>(run: (dir: string) => Promise<T>): Promise<T> {
  const dir = mkdtempSync(path.join(tmpdir(), "indexnow-test-"));
  const saved = new Map(ENV.map((name) => [name, process.env[name]]));
  for (const name of ENV) delete process.env[name];
  process.env.INDEXNOW_STATE_DIR = dir;
  try {
    return await run(dir);
  } finally {
    for (const [name, value] of saved) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
    rmSync(dir, { recursive: true, force: true });
  }
}

const sentUrls = (calls: Call[]) => calls.filter((c) => c.url === ENDPOINT).flatMap((c) => JSON.parse(String(c.init?.body)).urlList as string[]);

test("changed: the first run sends every page and saves the fingerprints; the next run sends only what changed", async () => {
  await withStateDir(async (dir) => {
    const first = fakeDeps(liveSite());
    assert.equal(await main(["changed"], first.deps), 0);
    assert.deepEqual(sentUrls(first.calls).sort(), [SITE, `${SITE}/faq`]);
    const state = JSON.parse(readFileSync(path.join(dir, "state.json"), "utf8"));
    assert.deepEqual(Object.keys(state.pages).sort(), [SITE, `${SITE}/faq`]);

    const same = fakeDeps(liveSite());
    assert.equal(await main(["changed"], same.deps), 0);
    assert.deepEqual(sentUrls(same.calls), [], "nothing changed, nothing sent");
    assert.ok(!same.calls.some((c) => c.url === KEY_URL), "the key file is only checked when there is something to send");

    const edited = fakeDeps(liveSite({ [`${SITE}/faq`]: () => answer(200, page({ title: "FAQ", description: "New answers." })) }));
    assert.equal(await main(["changed"], edited.deps), 0);
    assert.deepEqual(sentUrls(edited.calls), [`${SITE}/faq`]);
  });
});

test("a dry run sends nothing and leaves the saved fingerprints alone", async () => {
  await withStateDir(async (dir) => {
    const net = fakeDeps(liveSite());
    assert.equal(await main(["changed", "--dry-run"], net.deps), 0);
    assert.deepEqual(sentUrls(net.calls), []);
    assert.ok(!existsSync(path.join(dir, "state.json")));
  });
});

test("a missing key file stops the run before anything is sent or saved", async () => {
  await withStateDir(async (dir) => {
    const net = fakeDeps(liveSite({ [KEY_URL]: () => answer(404, "Not found") }));
    await assert.rejects(main(["changed"], net.deps), /is not live or does not hold the key/);
    assert.deepEqual(sentUrls(net.calls), []);
    assert.ok(!existsSync(path.join(dir, "state.json")));
  });
});

test("named addresses are sent as given; another site's address is refused", async () => {
  await withStateDir(async () => {
    const net = fakeDeps(liveSite());
    assert.equal(await main([`${SITE}/faq`], net.deps), 0);
    assert.deepEqual(sentUrls(net.calls), [`${SITE}/faq`]);
    await assert.rejects(main(["https://example.com/x", "--dry-run"], fakeDeps({}).deps), /Only pages of/);
  });
});

test("on GitHub, a push waits for the deploy; a failed deploy sends nothing", async () => {
  await withStateDir(async (dir) => {
    process.env.GITHUB_ACTIONS = "true";
    process.env.GITHUB_REPOSITORY = "owner/repo";
    process.env.GITHUB_SHA = SHA;
    const failed = fakeDeps(
      liveSite({
        [`${API}/deployments*`]: (call) => answer(200, JSON.stringify(call.url.includes("/statuses") ? [{ state: "error" }] : [{ id: 5 }])),
      }),
    );
    assert.equal(await main(["changed"], failed.deps), 0);
    assert.deepEqual(sentUrls(failed.calls), []);
    assert.ok(!existsSync(path.join(dir, "state.json")));

    const live = fakeDeps(
      liveSite({
        [`${API}/deployments*`]: (call) => answer(200, JSON.stringify(call.url.includes("/statuses") ? [{ state: "success" }] : [{ id: 6 }])),
      }),
    );
    assert.equal(await main(["changed"], live.deps), 0);
    assert.deepEqual(sentUrls(live.calls).sort(), [SITE, `${SITE}/faq`]);
    assert.equal(JSON.parse(readFileSync(path.join(dir, "state.json"), "utf8")).commit, SHA);
    assert.deepEqual(live.slept, [45_000], "one pause after the deploy before reading the pages");
  });
});
