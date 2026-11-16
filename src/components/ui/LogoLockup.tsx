import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/lib/business";
import { image } from "@/lib/media";

/**
 * The logo lockup: the emblem cut from the logo artwork (marlin, compass,
 * "C&S" and "PLUMBING"; the crop is set in src/content/media.json under
 * crops["logo.emblem"]) and the name set as real text, "C&S Plumbing" in the
 * display face with "of Lee" under it.
 *
 * Server component (it reads the picture system). `surface` picks the text
 * colours: "light" (navy name, blue "of Lee": white and shell surfaces, the
 * emblem's black lettering reads there), "dark" (white: over a photograph or
 * a navy band) or "tone" (the section's tone variables, the default). The
 * header switches between its two states in CSS through the data-lockup-*
 * hooks (header.css).
 */

type LockupSize = "sm" | "md" | "lg";
type LockupSurface = "tone" | "light" | "dark";

const nameColor: Record<LockupSurface, string> = { tone: "text-fg", light: "text-navy", dark: "text-white" };
const suffixColor: Record<LockupSurface, string> = {
  tone: "text-accent",
  light: "text-primary-dark",
  dark: "text-white/90",
};

const heights: Record<LockupSize, string> = {
  // the header: 44 px on phones, 56 px from the nav breakpoint (the logo
  // stands alone there, without the name beside it)
  sm: "h-11 nav:h-14",
  md: "h-14",
  // 120 px from 40rem; 80 px on phones so the lockup fits a 320 px screen
  lg: "h-20 sm:h-[120px]",
};
const pixelHeight: Record<LockupSize, number> = { sm: 56, md: 56, lg: 120 };

const wordSizes: Record<LockupSize, string> = {
  sm: "text-[1.125rem] nav:text-[1.25rem]",
  md: "text-xl sm:text-2xl",
  lg: "text-xl sm:text-[2.5rem]",
};

/** "of Lee": the part of the full name after the short name. */
const SUFFIX = BUSINESS.fullName.startsWith(BUSINESS.name)
  ? BUSINESS.fullName.slice(BUSINESS.name.length).trim()
  : "";

interface LogoLockupProps {
  size?: LockupSize;
  /** The real-text name beside the emblem (default true). */
  wordmark?: boolean;
  /** Where the lockup links (default home). Pass null for a lockup that is not a link. */
  href?: string | null;
  /** The link's accessible name. */
  label?: string;
  /** Preload the emblem (the header on every page). */
  preload?: boolean;
  /** Text colours for a light or dark surface (default: the section tone). */
  surface?: LockupSurface;
  className?: string;
}

export default function LogoLockup({
  size = "sm",
  wordmark = true,
  href = "/",
  label = `${BUSINESS.fullName}, home`,
  preload = false,
  surface = "tone",
  className,
}: LogoLockupProps) {
  const emblem = image("derived:logo.emblem");
  const h = pixelHeight[size];
  const linked = href !== null;

  const content = (
    <>
      {emblem && (
        <Image
          src={emblem.src}
          // With the name beside it the picture is decoration; on its own it
          // carries the name (unless the link already does).
          alt={wordmark || linked ? "" : BUSINESS.fullName}
          width={emblem.width}
          height={emblem.height}
          sizes={`${Math.ceil((h * emblem.width) / emblem.height)}px`}
          preload={preload || undefined}
          className={cn("w-auto shrink-0", heights[size])}
        />
      )}
      {wordmark && (
        <span className="flex flex-col leading-none" aria-hidden={linked ? true : undefined}>
          <span
            className={cn(
              "font-display font-bold tracking-[-0.01em] whitespace-nowrap [font-stretch:112%]",
              nameColor[surface],
              wordSizes[size],
            )}
            data-lockup-name=""
          >
            {BUSINESS.name}
          </span>
          {SUFFIX && (
            <span
              className={cn("mt-1 text-[0.875rem] leading-none font-semibold", suffixColor[surface])}
              data-lockup-suffix=""
            >
              {SUFFIX}
            </span>
          )}
        </span>
      )}
    </>
  );

  const classes = cn("inline-flex items-center gap-3", className);
  if (!linked) {
    return (
      <span className={classes} role={wordmark ? "img" : undefined} aria-label={wordmark ? BUSINESS.fullName : undefined}>
        {content}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className={cn(classes, "min-h-11 rounded-control")}>
      {content}
    </Link>
  );
}
