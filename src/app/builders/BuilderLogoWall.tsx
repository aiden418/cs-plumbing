import BuilderLogoImage from "@/components/ui/BuilderLogoImage";
import { BUILDERS } from "@/lib/builders-data";
import { cn } from "@/lib/utils";

/**
 * The builders who work with C&S as a hairline grid of logos on white cells
 * (2 columns on phones, 4 from 48rem). Static: no marquee, no hover effects
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
        "grid grid-cols-2 gap-px overflow-hidden rounded-frame border border-rule bg-rule md:grid-cols-4",
        className,
      )}
    >
      {BUILDERS.map((builder) => (
        <li
          key={builder.name}
          className="flex min-h-32 flex-col items-center justify-center gap-4 bg-white px-4 py-7 sm:min-h-36 sm:px-6"
        >
          <span className="flex h-10 items-center justify-center sm:h-12">
            <BuilderLogoImage
              builder={builder}
              alt={altSuffix ? `${builder.name} — ${altSuffix}` : undefined}
              sizes="(max-width: 640px) 120px, 140px"
              className="h-8 w-auto max-w-[120px] object-contain sm:h-10 sm:max-w-[140px]"
            />
          </span>
          {showNames && <span className="text-center text-sm font-medium text-steel-500">{builder.name}</span>}
        </li>
      ))}
    </ul>
  );
}
