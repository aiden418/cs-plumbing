/**
 * Just enough PDF reading to check Chrome's print output: page count, page
 * size, and the text on each page (so a running footer such as "Page 2 of 9",
 * which only exists in the printed document, can be read back).
 *
 * Written for the PDFs Chrome (Skia) produces: classic cross-reference table,
 * Flate streams, Type0 fonts with ToUnicode maps. Anything it cannot follow
 * makes readPdf() report `textError` instead of guessing.
 */

import zlib from "node:zlib";

const WHITE = new Set([0x00, 0x09, 0x0a, 0x0c, 0x0d, 0x20]);
const DELIM = new Set("()<>[]{}/%".split("").map((c) => c.charCodeAt(0)));

class Ref {
  constructor(num) {
    this.num = num;
  }
}
class Name {
  constructor(value) {
    this.value = value;
  }
}
class Op {
  constructor(value) {
    this.value = value;
  }
}

/** Tokenizer and parser for PDF object syntax, shared by objects and content streams. */
class Lexer {
  constructor(bytes, pos = 0) {
    this.b = bytes;
    this.p = pos;
  }

  skip() {
    const { b } = this;
    for (;;) {
      while (this.p < b.length && WHITE.has(b[this.p])) this.p++;
      if (b[this.p] !== 0x25) return; // %
      while (this.p < b.length && b[this.p] !== 0x0a && b[this.p] !== 0x0d) this.p++;
    }
  }

  /** Next value: number, string (Buffer), Name, array, dict (Map), Ref, Op, or undefined at the end. */
  value() {
    this.skip();
    const { b } = this;
    if (this.p >= b.length) return undefined;
    const c = b[this.p];
    if (c === 0x2f) {
      // /Name
      let end = this.p + 1;
      while (end < b.length && !WHITE.has(b[end]) && !DELIM.has(b[end])) end++;
      const name = b.latin1Slice(this.p + 1, end).replace(/#([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
      this.p = end;
      return new Name(name);
    }
    if (c === 0x28) return this.literalString();
    if (c === 0x3c) {
      if (b[this.p + 1] === 0x3c) {
        this.p += 2;
        const dict = new Map();
        for (;;) {
          this.skip();
          if (b[this.p] === 0x3e && b[this.p + 1] === 0x3e) {
            this.p += 2;
            return dict;
          }
          const key = this.value();
          if (!(key instanceof Name)) throw new Error(`PDF: expected a name in a dictionary at byte ${this.p}`);
          dict.set(key.value, this.value());
        }
      }
      const end = b.indexOf(0x3e, this.p);
      let hex = b.latin1Slice(this.p + 1, end).replace(/\s+/g, "");
      if (hex.length % 2) hex += "0";
      this.p = end + 1;
      return Buffer.from(hex, "hex");
    }
    if (c === 0x5b) {
      this.p++;
      const list = [];
      for (;;) {
        this.skip();
        if (b[this.p] === 0x5d) {
          this.p++;
          return list;
        }
        const item = this.value();
        if (item === undefined) throw new Error("PDF: unterminated array");
        list.push(item);
      }
    }
    // number, reference, or keyword
    let end = this.p;
    while (end < b.length && !WHITE.has(b[end]) && !DELIM.has(b[end])) end++;
    if (end === this.p) {
      this.p++; // a stray delimiter
      return new Op(String.fromCharCode(c));
    }
    const word = b.latin1Slice(this.p, end);
    this.p = end;
    if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(word)) {
      const number = Number(word);
      if (/^\d+$/.test(word)) {
        // "12 0 R" is a reference
        const save = this.p;
        this.skip();
        let e2 = this.p;
        while (e2 < b.length && b[e2] >= 0x30 && b[e2] <= 0x39) e2++;
        if (e2 > this.p) {
          let e3 = e2;
          while (e3 < b.length && WHITE.has(b[e3])) e3++;
          if (b[e3] === 0x52 && (e3 + 1 >= b.length || WHITE.has(b[e3 + 1]) || DELIM.has(b[e3 + 1]))) {
            this.p = e3 + 1;
            return new Ref(number);
          }
        }
        this.p = save;
      }
      return number;
    }
    if (word === "true") return true;
    if (word === "false") return false;
    if (word === "null") return null;
    return new Op(word);
  }

  literalString() {
    const { b } = this;
    const out = [];
    let depth = 1;
    this.p++;
    while (this.p < b.length) {
      const c = b[this.p++];
      if (c === 0x5c) {
        const n = b[this.p++];
        const simple = { 0x6e: 0x0a, 0x72: 0x0d, 0x74: 0x09, 0x62: 0x08, 0x66: 0x0c }[n];
        if (simple !== undefined) out.push(simple);
        else if (n >= 0x30 && n <= 0x37) {
          let octal = n - 0x30;
          for (let i = 0; i < 2 && b[this.p] >= 0x30 && b[this.p] <= 0x37; i++) octal = octal * 8 + (b[this.p++] - 0x30);
          out.push(octal & 0xff);
        } else if (n === 0x0d) {
          if (b[this.p] === 0x0a) this.p++;
        } else if (n !== 0x0a) out.push(n);
      } else if (c === 0x28) {
        depth++;
        out.push(c);
      } else if (c === 0x29) {
        if (--depth === 0) break;
        out.push(c);
      } else out.push(c);
    }
    return Buffer.from(out);
  }
}

class Document {
  constructor(bytes) {
    this.bytes = bytes;
    this.offsets = new Map();
    this.cache = new Map();
    this.readXref();
  }

  readXref() {
    const tail = this.bytes.latin1Slice(Math.max(0, this.bytes.length - 2048));
    const m = /startxref\s+(\d+)\s+%%EOF\s*$/.exec(tail);
    if (!m) throw new Error("PDF: no startxref");
    let pos = Number(m[1]);
    const seen = new Set();
    while (pos && !seen.has(pos)) {
      seen.add(pos);
      const lexer = new Lexer(this.bytes, pos);
      const head = lexer.value();
      if (!(head instanceof Op) || head.value !== "xref") throw new Error("PDF: cross-reference streams are not supported");
      for (;;) {
        const first = lexer.value();
        if (first instanceof Op && first.value === "trailer") break;
        const count = lexer.value();
        if (typeof first !== "number" || typeof count !== "number") throw new Error("PDF: malformed xref table");
        for (let i = 0; i < count; i++) {
          const offset = lexer.value();
          lexer.value(); // generation
          const flag = lexer.value();
          if (flag instanceof Op && flag.value === "n" && !this.offsets.has(first + i)) this.offsets.set(first + i, offset);
        }
      }
      const trailer = lexer.value();
      if (!this.trailer) this.trailer = trailer;
      const prev = trailer.get("Prev");
      pos = typeof prev === "number" ? prev : 0;
    }
  }

  /** The object a reference points at: { value, stream? }. */
  object(num) {
    if (this.cache.has(num)) return this.cache.get(num);
    const offset = this.offsets.get(num);
    if (offset === undefined) return { value: null };
    const lexer = new Lexer(this.bytes, offset);
    lexer.value(); // object number
    lexer.value(); // generation
    lexer.value(); // "obj"
    const value = lexer.value();
    const entry = { value };
    this.cache.set(num, entry);
    lexer.skip();
    if (value instanceof Map && this.bytes.latin1Slice(lexer.p, lexer.p + 6) === "stream") {
      let start = lexer.p + 6;
      if (this.bytes[start] === 0x0d) start++;
      if (this.bytes[start] === 0x0a) start++;
      const length = this.resolve(value.get("Length"));
      entry.raw = this.bytes.subarray(start, start + length);
    }
    return entry;
  }

  resolve(value) {
    return value instanceof Ref ? this.object(value.num).value : value;
  }

  /** Decoded bytes of a stream object (Flate or none). */
  stream(ref) {
    const entry = ref instanceof Ref ? this.object(ref.num) : ref;
    if (!entry?.raw) return Buffer.alloc(0);
    const filter = this.resolve(entry.value.get("Filter"));
    const names = (Array.isArray(filter) ? filter : filter ? [filter] : []).map((f) => f.value);
    let data = entry.raw;
    for (const name of names) {
      if (name === "FlateDecode") data = zlib.inflateSync(data);
      else throw new Error(`PDF: unsupported stream filter ${name}`);
    }
    return data;
  }

  pages() {
    const root = this.resolve(this.trailer.get("Root"));
    const out = [];
    const walk = (node, inherited) => {
      const dict = this.resolve(node);
      if (!(dict instanceof Map)) return;
      const next = { resources: dict.get("Resources") ?? inherited.resources, mediaBox: dict.get("MediaBox") ?? inherited.mediaBox };
      if (dict.get("Type")?.value === "Pages") for (const kid of this.resolve(dict.get("Kids")) ?? []) walk(kid, next);
      else out.push({ dict, ...next });
    };
    walk(root.get("Pages"), {});
    return out;
  }
}

/** code -> text, from a ToUnicode CMap. */
function parseToUnicode(bytes) {
  const text = bytes.latin1Slice();
  const map = new Map();
  let codeBytes = 2;
  const space = /begincodespacerange\s*<([0-9a-fA-F]+)>/.exec(text);
  if (space) codeBytes = space[1].length / 2;
  const utf16 = (hex) => {
    let out = "";
    for (let i = 0; i + 4 <= hex.length; i += 4) out += String.fromCharCode(parseInt(hex.slice(i, i + 4), 16));
    return out;
  };
  for (const section of text.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const m of section[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]*)>/g)) map.set(parseInt(m[1], 16), utf16(m[2]));
  }
  for (const section of text.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
    for (const m of section[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*(\[[^\]]*\]|<[0-9a-fA-F]*>)/g)) {
      const lo = parseInt(m[1], 16);
      const hi = parseInt(m[2], 16);
      if (m[3].startsWith("[")) {
        const items = [...m[3].matchAll(/<([0-9a-fA-F]*)>/g)].map((x) => utf16(x[1]));
        for (let code = lo; code <= hi && code - lo < items.length; code++) map.set(code, items[code - lo]);
      } else {
        const base = m[3].slice(1, -1);
        const head = base.slice(0, -4);
        const last = parseInt(base.slice(-4), 16);
        for (let code = lo; code <= hi; code++) map.set(code, utf16(head) + String.fromCharCode(last + (code - lo)));
      }
    }
  }
  return { map, codeBytes };
}

const multiply = (m, n) => [
  m[0] * n[0] + m[1] * n[2],
  m[0] * n[1] + m[1] * n[3],
  m[2] * n[0] + m[3] * n[2],
  m[2] * n[1] + m[3] * n[3],
  m[4] * n[0] + m[5] * n[2] + n[4],
  m[4] * n[1] + m[5] * n[3] + n[5],
];

/** Text runs of one content stream: [{ x, y, size, text, block }]. */
function textRuns(doc, content, resources, state, runs, depth = 0) {
  const res = doc.resolve(resources);
  const fontDict = res instanceof Map ? doc.resolve(res.get("Font")) : null;
  const xobjects = res instanceof Map ? doc.resolve(res.get("XObject")) : null;
  const fonts = new Map();
  const fontFor = (name) => {
    if (fonts.has(name)) return fonts.get(name);
    let font = { map: new Map(), codeBytes: 1, missing: true };
    const dict = fontDict instanceof Map ? doc.resolve(fontDict.get(name)) : null;
    if (dict instanceof Map) {
      const toUnicode = dict.get("ToUnicode");
      if (toUnicode) font = { ...parseToUnicode(doc.stream(toUnicode)), missing: false };
      else font = { map: null, codeBytes: dict.get("Subtype")?.value === "Type0" ? 2 : 1, missing: false };
    }
    fonts.set(name, font);
    return font;
  };
  const decode = (font, bytes) => {
    let out = "";
    for (let i = 0; i + font.codeBytes <= bytes.length; i += font.codeBytes) {
      const code = font.codeBytes === 2 ? bytes.readUInt16BE(i) : bytes[i];
      if (font.map) {
        const text = font.map.get(code);
        if (text === undefined) state.unmapped += 1;
        else out += text;
      } else if (font.codeBytes === 1) out += String.fromCharCode(code);
      else state.unmapped += 1;
    }
    return out;
  };

  const lexer = new Lexer(content);
  const stack = [];
  let ctm = state.ctm;
  const saved = [];
  let font = null;
  let size = 0;
  let tm = [1, 0, 0, 1, 0, 0];
  let lm = [1, 0, 0, 1, 0, 0];
  let leading = 0;
  const show = (bytes) => {
    if (!font) return;
    const text = decode(font, bytes);
    if (!text) return;
    const at = multiply(tm, ctm);
    runs.push({ x: at[4], y: at[5], size: Math.abs(size * Math.hypot(at[2], at[3])), text, block: state.block });
  };
  for (let token = lexer.value(); token !== undefined; token = lexer.value()) {
    if (!(token instanceof Op)) {
      stack.push(token);
      continue;
    }
    const args = stack.splice(0);
    switch (token.value) {
      case "q":
        saved.push(ctm);
        break;
      case "Q":
        ctm = saved.pop() ?? ctm;
        break;
      case "cm":
        if (args.length === 6) ctm = multiply(args, ctm);
        break;
      case "BT":
        tm = [1, 0, 0, 1, 0, 0];
        lm = tm;
        state.block += 1;
        break;
      case "Tf":
        font = fontFor(args[0]?.value);
        size = args[1] ?? 0;
        break;
      case "TL":
        leading = args[0] ?? 0;
        break;
      case "Tm":
        if (args.length === 6) tm = lm = args;
        break;
      case "Td":
      case "TD":
        if (token.value === "TD") leading = -args[1];
        lm = multiply([1, 0, 0, 1, args[0], args[1]], lm);
        tm = lm;
        break;
      case "T*":
        lm = multiply([1, 0, 0, 1, 0, -leading], lm);
        tm = lm;
        break;
      case "Tj":
        if (Buffer.isBuffer(args[0])) show(args[0]);
        break;
      case "'":
      case '"': {
        lm = multiply([1, 0, 0, 1, 0, -leading], lm);
        tm = lm;
        const bytes = args[args.length - 1];
        if (Buffer.isBuffer(bytes)) show(bytes);
        break;
      }
      case "TJ":
        if (Array.isArray(args[0])) show(Buffer.concat(args[0].filter((item) => Buffer.isBuffer(item))));
        break;
      case "Do": {
        const target = xobjects instanceof Map ? xobjects.get(args[0]?.value) : null;
        const entry = target instanceof Ref ? doc.object(target.num) : null;
        if (entry?.raw && entry.value.get("Subtype")?.value === "Form" && depth < 8) {
          const matrix = doc.resolve(entry.value.get("Matrix"));
          const inner = { ...state, ctm: Array.isArray(matrix) && matrix.length === 6 ? multiply(matrix, ctm) : ctm };
          textRuns(doc, doc.stream(entry), entry.value.get("Resources") ?? resources, inner, runs, depth + 1);
          state.block = inner.block;
          state.unmapped = inner.unmapped;
        }
        break;
      }
      case "BI": {
        // Inline image: skip to its end marker.
        const end = content.indexOf("EI", lexer.p);
        lexer.p = end === -1 ? content.length : end + 2;
        break;
      }
      default:
        break;
    }
  }
}

/** Runs sorted into lines, top to bottom. */
function toLines(runs) {
  const sorted = [...runs].sort((a, b) => b.y - a.y || a.x - b.x);
  const lines = [];
  for (const piece of sorted) {
    const line = lines.length ? lines[lines.length - 1] : null;
    if (line && Math.abs(line.y - piece.y) <= Math.max(2, piece.size * 0.3)) line.runs.push(piece);
    else lines.push({ y: piece.y, runs: [piece] });
  }
  return lines
    .map((line) => {
      let text = "";
      let previous = null;
      for (const piece of line.runs.sort((a, b) => a.x - b.x)) {
        // Inside one text object Chrome writes the spaces itself; between two, a gap is implied.
        const joined =
          previous === null ||
          previous.block === piece.block ||
          /\s$/.test(text) ||
          /^[\s,.;:!?)\]%]/.test(piece.text) ||
          /[([$#]$/.test(text);
        text += joined ? piece.text : ` ${piece.text}`;
        previous = piece;
      }
      return text.replace(/\s+/g, " ").trim();
    })
    .filter(Boolean);
}

/**
 * @param {Buffer} bytes a PDF printed by Chrome
 * @returns {{ pages: number, mediaBox: number[]|null, pageText: string[][]|null, textError: string|null, unmappedGlyphs: number }}
 *   pageText[i] is the lines of text on page i+1, top to bottom.
 */
export function readPdf(bytes) {
  // Works even when nothing else does: count the page objects.
  const counted = (bytes.latin1Slice().match(/\/Type\s*\/Page(?![a-zA-Z])/g) ?? []).length;
  try {
    const doc = new Document(bytes);
    const pages = doc.pages();
    let unmapped = 0;
    const pageText = pages.map((page) => {
      const contents = doc.resolve(page.dict.get("Contents"));
      const streams = Array.isArray(contents) ? contents : page.dict.get("Contents") ? [page.dict.get("Contents")] : [];
      const content = Buffer.concat(streams.flatMap((ref) => [doc.stream(ref), Buffer.from("\n")]));
      const state = { ctm: [1, 0, 0, 1, 0, 0], block: 0, unmapped: 0 };
      const runs = [];
      textRuns(doc, content, page.resources, state, runs);
      unmapped += state.unmapped;
      return toLines(runs);
    });
    const box = pages.length ? doc.resolve(pages[0].mediaBox) : null;
    return {
      pages: pages.length,
      mediaBox: Array.isArray(box) ? box.map((n) => Math.round(n * 100) / 100) : null,
      pageText,
      textError: null,
      unmappedGlyphs: unmapped,
    };
  } catch (err) {
    return { pages: counted, mediaBox: null, pageText: null, textError: err.message, unmappedGlyphs: 0 };
  }
}
