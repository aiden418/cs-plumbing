import Image from "next/image";
import type { Builder } from "@/lib/types";

interface BuilderLogoImageProps {
  builder: Builder;
  /** Defaults to the builder name. */
  alt?: string;
  className?: string;
  /** Upper bound on the rendered CSS width, so the optimizer picks a small
   *  srcset entry instead of a full-width one. */
  sizes: string;
  loading?: "eager" | "lazy";
}

/**
 * Builder logos render 24–40px tall but the source files run up to 2560px
 * wide, so they go through next/image rather than a raw <img>. Shared across
 * the home marquee, the builders grid, and the builder-portal wall.
 */
export default function BuilderLogoImage({
  builder,
  alt,
  className,
  sizes,
  loading = "lazy",
}: BuilderLogoImageProps) {
  return (
    <Image
      src={builder.logo}
      alt={alt ?? builder.name}
      width={builder.logoWidth}
      height={builder.logoHeight}
      sizes={sizes}
      loading={loading}
      // The optimizer refuses SVG unless `dangerouslyAllowSVG` is set. This is
      // the one SVG logo and it's 5KB, so pass it through rather than loosen
      // the global image config.
      unoptimized={builder.logo.endsWith(".svg")}
      className={className}
    />
  );
}
