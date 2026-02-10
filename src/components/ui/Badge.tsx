import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "surface" | "emergency";
  className?: string;
}

const variants = {
  primary: "bg-primary/10 text-primary border-primary/20",
  surface: "bg-surface-light text-gray-300 border-white/10",
  emergency: "bg-emergency/10 text-emergency border-emergency/20",
};

export default function Badge({
  children,
  variant = "primary",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
