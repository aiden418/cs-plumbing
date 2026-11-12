/**
 * Limits and helpers for the builder portal's plan-set upload: the "Submit
 * plans for a bid" form (/builders and the new-construction city pages) and
 * the /builder-portal wizard.
 *
 * Plan sets are PDFs of 5-30 MB, far over the 4.5 MB request body a Vercel
 * Function accepts, so they never travel through our API. The browser uploads
 * each file straight to Vercel Blob with a short-lived client token minted by
 * /api/builder-portal/upload, then posts the resulting URLs as JSON to
 * /api/builder-portal, which checks them and attaches or links the files in
 * the office email. See docs/forms-and-photos.md.
 *
 * Shared by the browser (hints, pre-submit checks, the blob pathname) and the
 * server (token constraints, URL validation), so the two never drift.
 * Dependency-free: it is imported by client components.
 */
export const PLAN_UPLOAD = {
  /** JSON field the forms post the uploaded files under. */
  field: "files",
  maxFiles: 10,
  /** Enforced in the client token (maximumSizeInBytes) and again on the server. */
  maxBytesEach: 50 * 1024 * 1024,
  maxBytesTotal: 200 * 1024 * 1024,
  /**
   * Raw bytes the office email carries as attachments. Base64 adds a third,
   * so 15 MB is about 20 MB on the wire: under Resend's 40 MB email cap and
   * under the inbound limit of common office mailboxes. Larger sets arrive as
   * links only (the links are always in the email).
   */
  attachBytesTotal: 15 * 1024 * 1024,
  /** Files above this size upload in parts, each retried on its own. */
  multipartFromBytes: 20 * 1024 * 1024,
  types: ["application/pdf", "image/jpeg", "image/png"],
  extensions: [".pdf", ".jpg", ".jpeg", ".png"],
  /** Every plan blob lives under this folder in the store. */
  pathPrefix: "builder-portal/",
  /** Blobs delete themselves after this many days (set in the client token). */
  ttlDays: 30,
} as const;

const mb = (bytes: number) => Math.round(bytes / 1024 / 1024);
export const PLAN_SIZE_MB = mb(PLAN_UPLOAD.maxBytesEach);
export const PLAN_TOTAL_MB = mb(PLAN_UPLOAD.maxBytesTotal);
export const PLAN_ATTACH_MB = mb(PLAN_UPLOAD.attachBytesTotal);

/** One uploaded file as the browser reports it to /api/builder-portal. */
export type PlanFileRef = {
  /** Public blob URL returned by the upload. */
  url: string;
  /** Original filename, for the email. */
  name: string;
  size: number;
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Client-side check that mirrors the server's total-size rule. */
export function planTotalError(files: { size: number }[], officeEmail: string): string | null {
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total <= PLAN_UPLOAD.maxBytesTotal) return null;
  return `Your plan set adds up to more than ${PLAN_TOTAL_MB} MB. Please remove a file, or email the full set to ${officeEmail}.`;
}

const EXTENSION_BY_TYPE: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

/**
 * Filename as stored in the blob pathname: ASCII letters, digits, dot, dash
 * and underscore only, at most 100 characters, with a lowercase extension
 * taken from the MIME type when the name has none we accept. The server
 * checks the result against PLAN_PATHNAME_RE, so keep the two in step.
 */
export function safeFilename(name: string, type?: string): string {
  const dot = name.lastIndexOf(".");
  let ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
  const stem = dot > 0 ? name.slice(0, dot) : name;
  if (!(PLAN_UPLOAD.extensions as readonly string[]).includes(ext)) {
    ext = EXTENSION_BY_TYPE[type ?? ""] ?? ext;
  }
  const base =
    stem
      .replace(/[^A-Za-z0-9._-]+/g, "_")
      .replace(/^[._-]+|[._-]+$/g, "")
      .slice(0, 100 - ext.length) || "plans";
  return `${base}${ext}`;
}

/** Pathname the browser asks the token route for. */
export function planPathname(file: { name: string; type: string }): string {
  return `${PLAN_UPLOAD.pathPrefix}${safeFilename(file.name, file.type)}`;
}

/** What the token route accepts as a pathname (no slashes beyond the prefix). */
export const PLAN_PATHNAME_RE = /^builder-portal\/[A-Za-z0-9._-]{1,100}\.(pdf|jpe?g|png)$/;

/** Stored pathname: the same, plus the random suffix Blob appends before the extension. */
const PLAN_BLOB_PATH_RE = /^\/builder-portal\/[A-Za-z0-9._-]{1,160}\.(pdf|jpe?g|png)$/;

/**
 * Store id embedded in a BLOB_READ_WRITE_TOKEN (vercel_blob_rw_<store>_<secret>),
 * parsed the way the SDK does. Null when the token is missing or malformed.
 */
export function blobStoreIdFromToken(token: string | undefined): string | null {
  if (!token) return null;
  const [, , , storeId = ""] = token.split("_");
  return storeId ? storeId.toLowerCase() : null;
}

/**
 * True only for a public blob URL in OUR store, under the plan folder, with
 * nothing but a plain path. Anything else (another store, a query string,
 * credentials, a traversal attempt) is refused before we fetch or link it.
 */
export function isPlanBlobUrl(raw: string, storeId: string): boolean {
  if (typeof raw !== "string" || raw.length > 600) return false;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  return (
    url.protocol === "https:" &&
    url.username === "" &&
    url.password === "" &&
    url.port === "" &&
    url.hostname === `${storeId.toLowerCase()}.public.blob.vercel-storage.com` &&
    url.search === "" &&
    url.hash === "" &&
    PLAN_BLOB_PATH_RE.test(url.pathname)
  );
}
