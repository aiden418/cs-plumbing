/**
 * Limits for the optional photo/PDF upload on the homeowner forms (contact,
 * booking). Shared by the browser (FileUpload hints, client-side checks) and
 * the API routes (server-side validation), so the two never drift.
 *
 * The totals are deliberately small: Vercel rejects request bodies over
 * 4.5 MB before our code runs, so photos are downscaled in the browser
 * (see compress-image.ts) and the whole submission must stay under 4 MB.
 *
 * Dependency-free: it is imported by client components.
 */
export const PHOTO_UPLOAD = {
  /** multipart field name the forms post files under */
  field: "photos",
  maxFiles: 5,
  maxBytesEach: 4 * 1024 * 1024,
  maxBytesTotal: 4 * 1024 * 1024,
  types: ["image/jpeg", "image/png", "application/pdf"],
  /** Longest edge after browser-side downscaling; plenty for a leak or fixture photo. */
  maxImageEdge: 1600,
  jpegQuality: 0.82,
} as const;

export const PHOTO_TOTAL_MB = Math.round(PHOTO_UPLOAD.maxBytesTotal / 1024 / 1024);

/** Client-side check that mirrors the server's total-size rule. */
export function photoTotalError(files: File[]): string | null {
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total <= PHOTO_UPLOAD.maxBytesTotal) return null;
  return `Your attachments add up to more than ${PHOTO_TOTAL_MB} MB. Please remove one, or send PDFs under ${PHOTO_TOTAL_MB} MB total.`;
}
