/**
 * Browser side of the builder portal's plan upload (limits in plan-upload.ts).
 *
 * Each file goes straight from the browser to Vercel Blob: the SDK asks
 * /api/builder-portal/upload for a client token, PUTs the file to the Blob
 * API and returns its public URL. The form then posts those URLs as JSON to
 * /api/builder-portal. The SDK is loaded on demand so the builder pages do
 * not carry it on first paint.
 *
 * The SDK reports a token-route failure with one fixed message and drops the
 * route's JSON body, so uploads start with a GET probe of the same route:
 * that is how "uploads are unavailable, email your plans" reaches the form.
 */
import { PLAN_UPLOAD, planPathname, type PlanFileRef } from "./plan-upload";

export const UPLOAD_TOKEN_URL = "/api/builder-portal/upload";

export type PlanUploadErrorCode = "uploads-unavailable" | "rate-limited" | "upload-failed";

export class PlanUploadError extends Error {
  code: PlanUploadErrorCode;
  constructor(code: PlanUploadErrorCode, message: string) {
    super(message);
    this.name = "PlanUploadError";
    this.code = code;
  }
}

/** Per-file state the forms render while uploading. */
export type PlanFileStatus = { progress?: number; done?: boolean; error?: string };

/** Finished uploads survive a failed submit, so a retry only sends what is missing. */
const uploaded = new WeakMap<File, PlanFileRef>();

/**
 * Uploads every file that is not already in the store and returns one ref per
 * input file, in order. Throws PlanUploadError (customer-facing message) or
 * rethrows an abort.
 */
export async function uploadPlanFiles(
  files: File[],
  opts: {
    officeEmail: string;
    onStatus?: (file: File, status: PlanFileStatus) => void;
    signal?: AbortSignal;
  }
): Promise<PlanFileRef[]> {
  const { officeEmail, onStatus, signal } = opts;
  if (files.length === 0) return [];

  const pending: File[] = [];
  for (const file of files) {
    if (uploaded.has(file)) onStatus?.(file, { progress: 100, done: true });
    else pending.push(file);
  }

  if (pending.length > 0) {
    await assertUploadsAvailable(officeEmail, signal);
    const { upload } = await import("@vercel/blob/client");
    for (const file of pending) {
      onStatus?.(file, { progress: 0 });
      try {
        const blob = await upload(planPathname(file), file, {
          access: "public",
          handleUploadUrl: UPLOAD_TOKEN_URL,
          contentType: file.type,
          multipart: file.size > PLAN_UPLOAD.multipartFromBytes,
          abortSignal: signal,
          onUploadProgress: ({ percentage }) => onStatus?.(file, { progress: percentage }),
        });
        uploaded.set(file, { url: blob.url, name: file.name, size: file.size });
        onStatus?.(file, { progress: 100, done: true });
      } catch (err) {
        if (isAbort(err, signal)) throw err;
        // The SDK's messages are written for developers; keep them out of the form.
        const message = `Upload of ${file.name} failed. Please try again, or email your plans to ${officeEmail}.`;
        onStatus?.(file, { error: message });
        throw new PlanUploadError("upload-failed", message);
      }
    }
  }

  return files.map((file) => uploaded.get(file) as PlanFileRef);
}

async function assertUploadsAvailable(officeEmail: string, signal?: AbortSignal): Promise<void> {
  let res: Response;
  try {
    res = await fetch(UPLOAD_TOKEN_URL, { method: "GET", cache: "no-store", signal });
  } catch (err) {
    if (isAbort(err, signal)) throw err;
    throw new PlanUploadError(
      "upload-failed",
      `We could not start the upload. Please check your connection and try again, or email your plans to ${officeEmail}.`
    );
  }
  if (res.ok) return;
  const data = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
  if (res.status === 429) {
    throw new PlanUploadError(
      "rate-limited",
      "Too many uploads from your network right now. Please wait a minute and try again."
    );
  }
  throw new PlanUploadError(
    data.code === "uploads-unavailable" ? "uploads-unavailable" : "upload-failed",
    data.error ??
      `File uploads are temporarily unavailable. Send your request without files and email your plans to ${officeEmail}.`
  );
}

function isAbort(err: unknown, signal?: AbortSignal): boolean {
  return Boolean(signal?.aborted) || (err instanceof Error && err.name === "AbortError");
}
