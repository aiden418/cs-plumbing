import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Legacy: pages used to fade in on client navigations. The design moves one
 * thing at a time and never hides a page, so this renders its children in a
 * plain wrapper (kept so the page structure is unchanged). Deleted at cleanup.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  return <div>{children}</div>;
}
