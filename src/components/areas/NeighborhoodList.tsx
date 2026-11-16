import { cn } from "@/lib/utils";

/**
 * Neighborhoods as a quiet list: a heading, then the names in two columns
 * on phones (more from 640 px) on hairline rows. Plain text (they are not
 * links); used by the area pages and the service-city landings.
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
      <h3 className="text-xl leading-snug font-semibold text-fg">{heading}</h3>
      <ul
        className={cn(
          "mt-4 grid grid-cols-2 gap-x-6 border-b border-rule",
          columns === 3 && "sm:grid-cols-3",
          columns === 4 && "sm:grid-cols-3 lg:grid-cols-4"
        )}
      >
        {names.map((name) => (
          <li key={name} className="-mb-px border-y border-rule py-2.5 leading-snug text-body">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
