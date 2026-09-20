import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// Intentionally a passthrough. This used to fade the whole page in from
// opacity 0 with framer-motion, which put `opacity:0` in the server HTML of
// every route: nothing painted until the JS bundle downloaded and hydrated,
// so LCP was tied to hydration and the page was blank with JS off. Per-section
// entrances (PageHero's CSS animation, ScrollReveal) cover the motion.
export default function PageTransition({ children }: PageTransitionProps) {
  return <>{children}</>;
}
