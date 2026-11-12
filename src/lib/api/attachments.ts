/**
 * Optional photo/PDF attachments on the homeowner forms (contact, booking).
 * Mirrors the builder portal's handling: files arrive as multipart entries,
 * are validated against PHOTO_UPLOAD, and ride along on the office email as
 * Resend attachments. Nothing is stored.
 */
import { PHOTO_UPLOAD } from "../photo-upload";

/** Resend attachment: base64 content, the API's documented wire format. */
export type Attachment = { filename: string; content: string };

const ACCEPTED: ReadonlySet<string> = new Set(PHOTO_UPLOAD.types);
const mb = (bytes: number) => Math.round(bytes / 1024 / 1024);

export async function collectAttachments(
  formData: FormData,
): Promise<{ attachments: Attachment[] } | { error: string }> {
  const files = formData
    .getAll(PHOTO_UPLOAD.field)
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > PHOTO_UPLOAD.maxFiles) {
    return { error: `Please attach at most ${PHOTO_UPLOAD.maxFiles} files.` };
  }
  const badType = files.find((f) => !ACCEPTED.has(f.type));
  if (badType) {
    return { error: `${badType.name}: only JPG, PNG and PDF files are accepted.` };
  }
  const tooLarge = files.find((f) => f.size > PHOTO_UPLOAD.maxBytesEach);
  if (tooLarge) {
    return { error: `${tooLarge.name} is larger than ${mb(PHOTO_UPLOAD.maxBytesEach)} MB.` };
  }
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > PHOTO_UPLOAD.maxBytesTotal) {
    return {
      error: `Attachments add up to more than ${mb(PHOTO_UPLOAD.maxBytesTotal)} MB. Please send fewer or smaller photos.`,
    };
  }

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name.replace(/[^\w.\-() ]+/g, "_").slice(0, 120),
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
