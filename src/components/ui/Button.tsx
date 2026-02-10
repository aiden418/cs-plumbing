import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "emergency";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  onClick?: never;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-dark text-white shadow-[0_0_0_rgba(0,153,255,0)] hover:shadow-[0_0_25px_rgba(0,153,255,0.3)] active:scale-[0.98]",
  secondary:
    "bg-transparent border border-white/20 text-white hover:border-primary hover:text-primary active:scale-[0.98]",
  ghost:
    "bg-transparent text-gray-300 hover:text-white hover:bg-white/5 active:scale-[0.98]",
  emergency:
    "bg-emergency hover:bg-red-600 text-white shadow-[0_0_0_rgba(255,59,48,0)] hover:shadow-[0_0_25px_rgba(255,59,48,0.3)] active:scale-[0.98]",
};

const sizes: Record<string, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 sm:px-6 py-2.5 sm:py-3 text-sm",
  lg: "px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  icon,
  href,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 cursor-pointer",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {icon}
      {children}
    </button>
  );
}
