import { Star } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** A star rating drawn in the tone's accent (brass on dark, bronze on light). */
export default function Stars({ rating, className = "size-4" }: { rating: number; className?: string }) {
  const filled = Math.round(rating);
  return (
    <span className="inline-flex gap-0.5 text-accent" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          strokeWidth={1.5}
          className={cn(className, i < filled ? "fill-current" : "opacity-40")}
        />
      ))}
    </span>
  );
}
