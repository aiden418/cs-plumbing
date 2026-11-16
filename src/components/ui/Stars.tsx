import { Star } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * A star rating, gold on every surface: the one place gold is used as a fill
 * (v2 keeps it out of labels and buttons). The edge is a shade darker so a
 * star holds its shape on white. The rating is always given in words too:
 * the label here, and usually the number beside the stars.
 */
export default function Stars({
  rating,
  className = "size-4",
  label,
}: {
  rating: number;
  /** Size of each star, e.g. "size-6". */
  className?: string;
  /** Accessible name; defaults to "<rating> out of 5 stars". */
  label?: string;
}) {
  const filled = Math.round(rating);
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={label ?? `${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          strokeWidth={1.5}
          className={cn(className, i < filled ? "fill-star stroke-star-edge" : "fill-transparent stroke-steel-300")}
        />
      ))}
    </span>
  );
}
