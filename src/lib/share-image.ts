/**
 * A jobsite photo as a link-preview image (Open Graph / Twitter card).
 *
 * The raw files are whatever the crew uploaded: some are WebP, several are
 * close to 1 MB, and none declared a size. Messaging apps skip a preview
 * picture that is heavy or in a format they do not read, so the preview goes
 * through the image optimizer instead: 1200 px wide, and JPEG for any
 * crawler that does not ask for WebP. Width and height are stated so the
 * first share of a page shows the picture without a second fetch.
 */
import "server-only";
import { imageMeta } from "./media";

const SHARE_WIDTH = 1200; // in next.config.ts images.deviceSizes
const SHARE_QUALITY = 60; // in next.config.ts images.qualities

export function sharePhoto(path: string, alt: string) {
  const meta = imageMeta(path);
  const width = meta ? Math.min(SHARE_WIDTH, meta.width) : undefined;
  const height = meta && width ? Math.round((meta.height * width) / meta.width) : undefined;
  return {
    url: `/_next/image?url=${encodeURIComponent(path)}&w=${SHARE_WIDTH}&q=${SHARE_QUALITY}`,
    ...(width && height ? { width, height } : {}),
    alt,
  };
}
