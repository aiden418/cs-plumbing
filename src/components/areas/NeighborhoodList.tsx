import { cn } from "@/lib/utils";

/**
 * Neighborhoods as a quiet list: a small heading, then the names in two
 * columns on hairline rows. Plain text (they are not links); used by the
 * area pages and the service-city landings.
 */
export default function NeighborhoodList({
  heading,
  names,
  columns = 2,
  className,
}: {
  heading: string;
  names: string[];
  /** Columns from 640 px. */
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  if (names.length === 0) return null;
  return (
    <div className={className}>
      <h3 className="text-lg leading-snug font-semibold text-fg">{heading}</h3>
      <ul className={cn("mt-5 grid grid-cols-2 gap-x-6", columns === 3 && "sm:grid-cols-3", columns === 4 && "sm:grid-cols-3 lg:grid-cols-4")}>
        {names.map((name) => (
          <li key={name} className="-mt-px border-y border-rule py-2.5 text-[0.9375rem] leading-snug text-body">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
