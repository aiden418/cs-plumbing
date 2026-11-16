import BuilderLogoImage from "@/components/ui/BuilderLogoImage";
import { BUILDERS } from "@/lib/builders-data";
import { cn } from "@/lib/utils";

/**
 * The builders who work with C&S as a hairline grid of logos on white cells
 * (4 columns at every width; the names print from 40rem and stay in the HTML on phones). Static: no marquee, no hover effects
 * on the logos. Client-safe (no picture registry), so the portal wizard can
 * render it too.
 */
export default function BuilderLogoWall({
  showNames = false,
  altSuffix,
  className,
}: {
  /** Print each builder's name under its logo. */
  showNames?: boolean;
  /** Appended to the builder name as the logo's alt text ("Name — suffix"). */
  altSuffix?: string;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        // The 1 px gaps show the rule colour behind the cells: one hairline between every pair.
        "grid grid-cols-4 gap-px overflow-hidden rounded-2xl border border-rule bg-rule",
        className,
      )}
    >
      {BUILDERS.map((builder) => (
        <li
          key={builder.name}
          className="flex min-h-22 flex-col items-center justify-center gap-3 bg-white px-2 py-4 sm:min-h-32 sm:px-6 sm:py-6"
        >
          <span className="flex h-9 items-center justify-center sm:h-12">
            <BuilderLogoImage
              builder={builder}
              alt={altSuffix ? `${builder.name} — ${altSuffix}` : undefined}
              sizes="(max-width: 640px) 120px, 140px"
              className="h-7 w-auto max-w-[68px] object-contain sm:h-10 sm:max-w-[140px]"
            />
          </span>
          {showNames && <span className="sr-only text-center text-[0.9375rem] font-medium text-steel-700 sm:not-sr-only">{builder.name}</span>}
        </li>
      ))}
    </ul>
  );
}
