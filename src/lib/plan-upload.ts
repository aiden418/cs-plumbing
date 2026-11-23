/**
 * Plan-set uploads on the builder forms (the Builder Portal wizard and the
 * short "Send plans for a bid" form).
 *
 * Plan files go up exactly as picked: a plan PDF cannot be downscaled in the
 * browser the way a phone photo is (see compress-image.ts). Production
 * refuses request bodies over about 4.5 MB before our code runs, so the whole
 * selection has to fit in one request. The browser therefore stops a larger
 * set as soon as it is chosen and offers email instead, rather than letting
 * the builder find out from a failed submit.
 *
 * The cap is the homeowner forms' total, not a new number. The server keeps
 * its own, higher ceiling (BUILDER_UPLOAD in api/attachments.ts), which only a
 * local run can reach.
 *
 * Dependency-free: it is imported by client components.
 */
import { PHOTO_UPLOAD } from "./photo-upload";

/** The most the files on a builder form may add up to, in bytes. */
export const PLAN_SET_MAX_BYTES = PHOTO_UPLOAD.maxBytesTotal;

/** True when the files together are more than one request can carry. */
export function planSetTooLarge(
  files: readonly { size: number }[],
  maxBytes: number = PLAN_SET_MAX_BYTES,
): boolean {
  return files.reduce((sum, file) => sum + file.size, 0) > maxBytes;
}
