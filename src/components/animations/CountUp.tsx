interface CountUpProps {
  end: number;
  /** Accepted and ignored: the number is shown final, never counted up. */
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

/** The final figure, formatted. The design has no count-up numbers. Deleted at cleanup. */
export function formatCount(end: number, prefix = "", suffix = ""): string {
  return `${prefix}${end.toLocaleString("en-US")}${suffix}`;
}

export default function CountUp({ end, suffix = "", prefix = "", className }: CountUpProps) {
  return <span className={className}>{formatCount(end, prefix, suffix)}</span>;
}
