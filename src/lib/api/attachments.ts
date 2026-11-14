/**
 * File attachments on the public forms. The homeowner forms (contact,
 * booking) post photos under PHOTO_UPLOAD; the builder portal posts plan
 * sets under BUILDER_UPLOAD. Files arrive as multipart entries, are checked
 * against the limits for that form (count, MIME type, size), get a safe
 * filename, and ride along on the office email as Resend attachments.
 * Nothing is stored on our side.
 */
import { PHOTO_UPLOAD } from "../photo-upload";

/** Resend attachment: base64 content, the API's documented wire format. */
export type Attachment = { filename: string; content: string };

export interface AttachmentLimits {
  /** multipart field name the form posts files under */
  field: string;
  maxFiles: number;
  maxBytesEach: number;
  maxBytesTotal: number;
  /** Accepted MIME types, as reported by the browser. */
  types: readonly string[];
}

/**
 * Builder portal plan sets. Mirrors the defaults FileUpload advertises
 * (10 files, 10 MB each) and the route's long-standing 25 MB total. Note
 * that Vercel rejects request bodies over 4.5 MB before this code runs, so
 * a full plan set still needs the "email large plan sets" fallback; the
 * limits here are the hard ceiling, not a promise.
 */
export const BUILDER_UPLOAD: AttachmentLimits = {
  field: "files",
  maxFiles: 10,
  maxBytesEach: 10 * 1024 * 1024,
  maxBytesTotal: 25 * 1024 * 1024,
  types: PHOTO_UPLOAD.types,
};

const mb = (bytes: number) => Math.round(bytes / 1024 / 1024);

/** Keep the customer's filename readable but free of path and control characters. */
export function safeFilename(name: string): string {
  const cleaned = name.replace(/[^\w.\-() ]+/g, "_").replace(/^\.+/, "_").slice(0, 120);
  return cleaned || "attachment";
}

export async function collectAttachments(
  formData: FormData,
  limits: AttachmentLimits = PHOTO_UPLOAD,
): Promise<{ attachments: Attachment[] } | { error: string }> {
  const accepted: ReadonlySet<string> = new Set(limits.types);
  const files = formData
    .getAll(limits.field)
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > limits.maxFiles) {
    return { error: `Please attach at most ${limits.maxFiles} files.` };
  }
  const badType = files.find((f) => !accepted.has(f.type));
  if (badType) {
    return { error: `${safeFilename(badType.name)}: only JPG, PNG and PDF files are accepted.` };
  }
  const tooLarge = files.find((f) => f.size > limits.maxBytesEach);
  if (tooLarge) {
    return { error: `${safeFilename(tooLarge.name)} is larger than ${mb(limits.maxBytesEach)} MB.` };
  }
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > limits.maxBytesTotal) {
    return {
      error: `Attachments add up to more than ${mb(limits.maxBytesTotal)} MB. Please send fewer or smaller files.`,
    };
  }

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: safeFilename(file.name),
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    })),
  );
  return { attachments };
}

/** Parse a request that may be JSON (no files) or multipart (with files). */
export async function readSubmission(
  request: Request,
): Promise<{ fields: Record<string, unknown>; attachments: Attachment[] } | { error: string }> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const fields = Object.fromEntries(
      [...formData.entries()].filter(([, v]) => typeof v === "string"),
    );
    const result = await collectAttachments(formData);
    if ("error" in result) return result;
    return { fields, attachments: result.attachments };
  }
  return { fields: (await request.json()) as Record<string, unknown>, attachments: [] };
}
