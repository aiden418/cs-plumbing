import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/lib/business";
import { image } from "@/lib/media";

/**
 * The logo lockup: the emblem cut from the logo artwork (marlin, compass,
 * "C&S" and "PLUMBING"; the crop is set in src/content/media.json under
 * crops["logo.emblem"]) and the name set as real text, "C&S Plumbing" in the
 * display face with "of Lee" as a plan-drawing label.
 *
 * Server component (it reads the picture system). Text colours come from the
 * section tone.
 */

type LockupSize = "sm" | "md" | "lg";

const heights: Record<LockupSize, string> = {
  // the header: 34 px on phones, 40 px from the nav breakpoint
  sm: "h-[34px] nav:h-10",
  md: "h-14",
  // 120 px from 40rem; 80 px on phones so the lockup fits a 320 px screen
  lg: "h-20 sm:h-[120px]",
};
const pixelHeight: Record<LockupSize, number> = { sm: 40, md: 56, lg: 120 };

const wordSizes: Record<LockupSize, string> = {
  sm: "text-[1.0625rem] nav:text-[1.1875rem]",
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
  className?: string;
}

export default function LogoLockup({
  size = "sm",
  wordmark = true,
  href = "/",
  label = `${BUSINESS.fullName}, home`,
  preload = false,
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
              "font-display font-bold tracking-[-0.01em] whitespace-nowrap text-fg [font-stretch:112%]",
              wordSizes[size],
            )}
          >
            {BUSINESS.name}
          </span>
          {SUFFIX && <span className="label-tech mt-1 text-accent">{SUFFIX}</span>}
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
