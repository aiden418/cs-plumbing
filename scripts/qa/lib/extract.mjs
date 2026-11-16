/**
 * Content extraction for the snapshot. `extractContent` is serialized and run
 * inside a Chrome page, so it must not reference anything outside itself.
 *
 * Given raw HTML it parses with DOMParser, which builds an inert document:
 * no script runs, no image, stylesheet or beacon is requested. Given null it
 * reads the live document (used only for routes whose server HTML leaves a
 * section to be rendered in the browser).
 */

export function extractContent(html, siteOrigins) {
  const doc = html === null ? document : new DOMParser().parseFromString(html, "text/html");
  const PLACEHOLDER = "https://snapshot.invalid";
  // \p{Cf}: zero-width spaces and joiners, soft hyphens, byte-order marks.
  const clean = (s) => (s ?? "").replace(/\p{Cf}/gu, "");
  const norm = (s) => clean(s).replace(/\s+/g, " ").trim();
  const strip = (s) => clean(s).replace(/\s+/g, "");
  const attr = (el, name) => (el ? el.getAttribute(name) : null);

  /** "/x", "https://www.site.com/x" and "/_next/image?url=%2Fx&w=640&q=75" all become "/x". */
  const localize = (raw) => {
    if (raw === null || raw === undefined || raw === "") return null;
    let u;
    try {
      u = new URL(raw, PLACEHOLDER);
    } catch {
      return raw;
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") return raw;
    if (u.origin === PLACEHOLDER || siteOrigins.includes(u.origin)) return u.pathname + u.search + u.hash;
    return u.href;
  };
  const underlying = (raw) => {
    if (!raw) return null;
    if (raw.startsWith("data:")) return null;
    let u;
    try {
      u = new URL(raw, PLACEHOLDER);
    } catch {
      return raw;
    }
    if (u.pathname === "/_next/image" && u.searchParams.get("url")) return localize(u.searchParams.get("url"));
    return localize(raw);
  };
  const firstCandidate = (srcset) => {
    if (!srcset) return null;
    const first = srcset.trim().split(/\s+/)[0];
    return first ? first.replace(/,$/, "") : null;
  };

  const main = doc.querySelector("main");
  const regionOf = (el) => {
    if (main && main.contains(el)) return "main";
    if (el.closest("footer")) return "footer";
    if (el.closest("header, nav, [role='banner'], [role='navigation']")) return "header";
    return "other";
  };

  /* ---- head ---- */
  const titleEl = [...doc.querySelectorAll("title")].find((t) => !t.closest("svg"));
  const metas = [...doc.querySelectorAll("meta")];
  const metaByName = (name) => {
    const m = metas.find((el) => (el.getAttribute("name") ?? "").toLowerCase() === name);
    return m ? (m.getAttribute("content") ?? "") : null;
  };
  const og = [];
  const twitter = [];
  const otherMeta = [];
  for (const m of metas) {
    const key = m.getAttribute("property") ?? m.getAttribute("name") ?? m.getAttribute("http-equiv");
    if (!key) continue;
    const entry = { key, content: m.getAttribute("content") ?? "" };
    const lower = key.toLowerCase();
    if (lower.startsWith("og:")) og.push(entry);
    else if (lower.startsWith("twitter:")) twitter.push(entry);
    else if (!["description", "robots", "googlebot"].includes(lower)) otherMeta.push(entry);
  }
  const canonicals = [...doc.querySelectorAll("link[rel~='canonical']")].map((l) => attr(l, "href"));
  const alternates = [...doc.querySelectorAll("link[rel~='alternate']")].map((l) => ({
    href: attr(l, "href"),
    hreflang: attr(l, "hreflang"),
    type: attr(l, "type"),
  }));
  const preloads = {};
  const imagePreloads = [];
  for (const l of doc.querySelectorAll("link[rel~='preload'], link[rel~='modulepreload']")) {
    const as = attr(l, "as") ?? (attr(l, "rel").includes("modulepreload") ? "script" : "unknown");
    preloads[as] = (preloads[as] ?? 0) + 1;
    if (as === "image") {
      imagePreloads.push(underlying(attr(l, "href") ?? firstCandidate(attr(l, "imagesrcset"))));
    }
  }

  /* ---- headings ---- */
  const h1 = [...doc.querySelectorAll("h1")].map((h) => ({ text: norm(h.textContent), stripped: strip(h.textContent) }));
  const outline = [...doc.querySelectorAll("h2, h3")]
    .map((h) => ({ level: Number(h.tagName[1]), text: norm(h.textContent) }))
    .filter((h) => h.text);

  /* ---- structured data ---- */
  const jsonLd = [...doc.querySelectorAll("script[type='application/ld+json']")].map((s) => s.textContent);

  /* ---- ids ---- */
  const idCounts = new Map();
  for (const el of doc.querySelectorAll("[id]")) {
    if (el.id) idCounts.set(el.id, (idCounts.get(el.id) ?? 0) + 1);
  }
  const ids = [...idCounts.keys()].sort();
  const duplicateIds = [...idCounts].filter(([, n]) => n > 1).map(([id]) => id).sort();

  /* ---- links ---- */
  const links = { header: [], main: [], footer: [], other: [] };
  const externalLinks = [];
  const contactLinks = [];
  for (const a of doc.querySelectorAll("a[href]")) {
    const raw = a.getAttribute("href").trim();
    const region = regionOf(a);
    const img = a.querySelector("img[alt]");
    const text = norm(a.textContent) || norm(attr(a, "aria-label")) || norm(attr(a, "title")) || norm(attr(img, "alt"));
    if (/^(tel|sms|mailto):/i.test(raw)) {
      contactLinks.push({ href: raw, text, region });
      continue;
    }
    if (raw.startsWith("#")) {
      links[region].push({ href: raw, text });
      continue;
    }
    const local = localize(raw);
    if (local === null) continue;
    if (local.startsWith("/")) links[region].push({ href: local, text });
    else if (/^https?:/i.test(local)) externalLinks.push({ href: local, text, region });
  }

  /* ---- images and other media ---- */
  const images = [];
  let dataImages = 0;
  for (const img of doc.querySelectorAll("img")) {
    const rawSrc = attr(img, "src");
    const src = underlying(rawSrc) ?? underlying(firstCandidate(attr(img, "srcset")));
    if (!src) {
      if (rawSrc && rawSrc.startsWith("data:")) dataImages += 1;
      continue;
    }
    images.push({
      src,
      alt: attr(img, "alt"),
      loading: attr(img, "loading"),
      priority: (attr(img, "fetchpriority") ?? "").toLowerCase() === "high",
      region: regionOf(img),
      noscript: Boolean(img.closest("noscript")),
    });
  }
  const media = [];
  for (const video of doc.querySelectorAll("video")) {
    const sources = [attr(video, "src"), ...[...video.querySelectorAll("source")].map((s) => attr(s, "src"))]
      .map(localize)
      .filter(Boolean);
    for (const src of sources) media.push({ kind: "video", src });
    const poster = underlying(attr(video, "poster"));
    if (poster) media.push({ kind: "poster", src: poster });
  }
  for (const source of doc.querySelectorAll("picture source[srcset]")) {
    const src = underlying(firstCandidate(attr(source, "srcset")));
    if (src) media.push({ kind: "picture-source", src });
  }
  for (const el of doc.querySelectorAll("[style*='url(']")) {
    for (const m of (attr(el, "style") ?? "").matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
      const src = underlying(m[2]);
      if (src) media.push({ kind: "background", src });
    }
  }
  for (const frame of doc.querySelectorAll("iframe[src]")) {
    media.push({ kind: "iframe", src: localize(attr(frame, "src")) });
  }

  /* ---- text ---- */
  const BLOCKS =
    "h1,h2,h3,h4,h5,h6,p,li,td,th,dt,dd,summary,figcaption,label,button,a,blockquote,legend,caption,option";
  const INLINE = new Set([
    "SPAN", "STRONG", "EM", "B", "I", "U", "S", "SMALL", "MARK", "SUP", "SUB", "ABBR", "TIME", "CODE", "KBD",
    "BDI", "BDO", "CITE", "Q", "VAR", "FONT", "BR", "WBR",
  ]);
  const textOf = (root) => {
    if (!root) return { blocks: [], text: "" };
    const copy = root.cloneNode(true);
    for (const el of copy.querySelectorAll("script, style, template, noscript, svg")) el.remove();
    const blocks = [];
    for (const el of copy.querySelectorAll(BLOCKS)) {
      const text = norm(el.textContent);
      if (text) blocks.push({ tag: el.tagName.toLowerCase(), text });
    }
    // Text that sits in no listed element (a bare <div> or <span>): grouped by
    // its nearest non-inline ancestor so a sentence split across spans stays whole.
    const loose = new Map();
    const walker = doc.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!clean(node.nodeValue).trim()) continue;
      const parent = node.parentElement;
      if (!parent || parent.closest(BLOCKS)) continue;
      let holder = parent;
      while (holder !== copy && INLINE.has(holder.tagName) && holder.parentElement) holder = holder.parentElement;
      if (!loose.has(holder)) loose.set(holder, []);
      loose.get(holder).push(node.nodeValue);
    }
    for (const [holder, parts] of loose) {
      const text = norm(parts.join(""));
      if (text) blocks.push({ tag: holder === copy ? "#root" : holder.tagName.toLowerCase(), text });
    }
    return { blocks, text: norm(copy.textContent) };
  };
  const mainText = textOf(main);
  // Site chrome: the outermost header/nav and footer elements that are not part of <main>.
  const outermost = (selector, region) =>
    [...doc.querySelectorAll(selector)].filter(
      (el) => regionOf(el) === region && !(el.parentElement && el.parentElement.closest(selector))
    );
  const siteHeaders = outermost("header, nav, [role='banner'], [role='navigation']", "header");
  const siteFooters = outermost("footer", "footer");
  let otherText = [];
  if (doc.body) {
    const rest = doc.body.cloneNode(true);
    for (const el of rest.querySelectorAll("main, footer, header, nav, [role='banner'], [role='navigation']")) el.remove();
    otherText = textOf(rest).blocks;
  }

  return {
    lang: attr(doc.documentElement, "lang"),
    title: titleEl ? norm(titleEl.textContent) : null,
    description: metaByName("description"),
    canonical: canonicals.length ? canonicals[0] : null,
    canonicalCount: canonicals.length,
    robots: metaByName("robots"),
    googlebot: metaByName("googlebot"),
    og,
    twitter,
    otherMeta,
    alternates,
    preloads,
    imagePreloads,
    stylesheets: doc.querySelectorAll("link[rel~='stylesheet']").length,
    scripts: doc.querySelectorAll("script[src]").length,
    h1,
    outline,
    jsonLd,
    ids,
    duplicateIds,
    links,
    externalLinks,
    contactLinks,
    images,
    dataImages,
    media,
    // A <video> may carry no src in the server HTML (the homepage sets it from script).
    videoElements: doc.querySelectorAll("video").length,
    hasMain: Boolean(main),
    text: mainText.blocks,
    mainText: mainText.text,
    headerText: siteHeaders.flatMap((el) => textOf(el).blocks),
    footerText: siteFooters.flatMap((el) => textOf(el).blocks),
    otherText,
  };
}
