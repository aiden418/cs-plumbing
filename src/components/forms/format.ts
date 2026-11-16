/**
 * Forgiving input helpers for the forms kit.
 *
 * The browser never rejects what a visitor types: these only tidy a value
 * once the visitor leaves the field (on blur), and leave anything they do not
 * recognise exactly as typed, minus surrounding whitespace. The API routes
 * stay strict and do the real validation.
 *
 * Plain functions and data only, so server components, client components and
 * node:test can all import this file.
 */

/** Surrounding whitespace removed; nothing else changes. */
export function trimValue(value: string): string {
  return value.trim();
}

/** A copy of `fields` with every string value trimmed; other values untouched. */
export function trimFields<T extends Record<string, unknown>>(fields: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    out[key] = typeof value === "string" ? value.trim() : value;
  }
  return out as T;
}

const EXTENSION = /\s*(?:ext\.?|extension|x|#)\s*(\d{1,6})\s*$/i;

/**
 * A US phone number written the way the site prints one: "(239) 555-0134".
 *
 * Applied on blur only, never while typing. Ten digits (or eleven starting
 * with the country code 1) in any arrangement are formatted, with a trailing
 * extension kept as "ext. 12". Anything else (letters, too few or too many
 * digits, an international number) comes back trimmed but otherwise exactly
 * as typed: it is never rejected here.
 */
export function formatPhoneDisplay(raw: string): string {
  const value = raw.trim();
  if (!value) return value;

  const ext = EXTENSION.exec(value);
  const main = ext ? value.slice(0, ext.index) : value;
  // Letters in the number itself ("833-PLUMB-IT") are left alone.
  if (/[a-z]/i.test(main)) return value;
  if (main.trim().startsWith("+") && !main.trim().startsWith("+1")) return value;

  let digits = main.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length !== 10) return value;

  const area = digits.slice(0, 3);
  const exchange = digits.slice(3, 6);
  const line = digits.slice(6);
  const formatted = "(" + area + ") " + exchange + "-" + line;
  return ext ? formatted + " ext. " + ext[1] : formatted;
}

/**
 * A ZIP code as "33903" or "33903-1234". Five or nine digits separated by
 * anything ("33903 1234", "339031234") are normalised; any other value comes
 * back trimmed and otherwise unchanged.
 */
export function normalizeZip(raw: string): string {
  const value = raw.trim();
  if (!/^[\d\s-]+$/.test(value)) return value;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 5) return digits;
  if (digits.length === 9) return digits.slice(0, 5) + "-" + digits.slice(5);
  return value;
}

/** What a blur does to a field's value. */
export type BlurFormat = "phone" | "zip" | "trim" | "none";

export function applyBlurFormat(format: BlurFormat, value: string): string {
  switch (format) {
    case "phone":
      return formatPhoneDisplay(value);
    case "zip":
      return normalizeZip(value);
    case "trim":
      return trimValue(value);
    default:
      return value;
  }
}

/** Attributes a preset sets on an `<input>`. Explicit props on the control win. */
export interface InputPresetAttributes {
  type: "text" | "tel" | "email";
  autoComplete: string;
  inputMode: "text" | "tel" | "email" | "numeric";
  enterKeyHint: "next";
  autoCapitalize: "words" | "off";
  spellCheck: boolean;
}

export type InputPresetName = "name" | "tel" | "email" | "postal-code" | "street-address";

/**
 * The right keyboard, autofill and correction behaviour for the fields every
 * C&S form asks for. Names and addresses capitalise words; phone, email and
 * ZIP never autocapitalise; none of them spell-check (a spell checker flags
 * every surname and street name).
 */
export const INPUT_PRESETS: Readonly<Record<InputPresetName, Readonly<InputPresetAttributes>>> = {
  name: {
    type: "text",
    autoComplete: "name",
    inputMode: "text",
    enterKeyHint: "next",
    autoCapitalize: "words",
    spellCheck: false,
  },
  tel: {
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
    enterKeyHint: "next",
    autoCapitalize: "off",
    spellCheck: false,
  },
  email: {
    type: "email",
    autoComplete: "email",
    inputMode: "email",
    enterKeyHint: "next",
    autoCapitalize: "off",
    spellCheck: false,
  },
  "postal-code": {
    type: "text",
    autoComplete: "postal-code",
    inputMode: "numeric",
    enterKeyHint: "next",
    autoCapitalize: "off",
    spellCheck: false,
  },
  "street-address": {
    type: "text",
    autoComplete: "street-address",
    inputMode: "text",
    enterKeyHint: "next",
    autoCapitalize: "words",
    spellCheck: false,
  },
};

/** The blur formatting that suits each preset. */
export const PRESET_BLUR_FORMAT: Readonly<Record<InputPresetName, BlurFormat>> = {
  name: "trim",
  tel: "phone",
  email: "trim",
  "postal-code": "zip",
  "street-address": "trim",
};

/** The ids a Field gives its hint and error, derived from the control's id. */
export function fieldIds(id: string) {
  return { hintId: `${id}-hint`, errorId: `${id}-error` };
}

/** Space-separated id list for aria-describedby, or undefined when empty. */
export function describedBy(...ids: Array<string | false | null | undefined>): string | undefined {
  const list = ids.filter((id): id is string => typeof id === "string" && id.length > 0);
  return list.length ? Array.from(new Set(list)).join(" ") : undefined;
}

/** Human file size for a file list: "820 KB", "1.4 MB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
