"use client";

import { PHOTO_UPLOAD } from "./photo-upload";

/**
 * Downscale a photo in the browser before upload so a 4 MB phone picture
 * becomes a few hundred KB. Non-images and anything the browser cannot
 * decode pass through untouched; the server re-checks size either way.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (typeof createImageBitmap !== "function" || typeof document === "undefined") return file;
  try {
    // from-image honours EXIF orientation, so phone photos stay upright.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const longest = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, PHOTO_UPLOAD.maxImageEdge / longest);
    // Already small: skip the re-encode and keep the original bytes.
    if (scale === 1 && file.size <= 600 * 1024) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", PHOTO_UPLOAD.jpegQuality),
    );
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.(jpe?g|png|heic|heif|webp)$/i, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: file.lastModified });
  } catch {
    return file;
  }
}

/** Compress every image in a selection; PDFs and failures pass through. */
export function compressAll(files: File[]): Promise<File[]> {
  return Promise.all(files.map(compressImage));
}
