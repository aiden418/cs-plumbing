"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Hook that returns whether a CSS media query matches.
 * Useful for conditionally rendering components or disabling animations on mobile.
 *
 * @param query - CSS media query string (e.g., "(min-width: 640px)")
 * @returns boolean indicating if the media query matches
 *
 * @example
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 * const isMobile = useMediaQuery("(max-width: 639px)");
 * const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
 */
export default function useMediaQuery(query: string): boolean {
  // matchMedia is an external store, so subscribing to it directly avoids the
  // extra render (and the setState-in-effect cascade) of the useState/useEffect
  // version this replaced.
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  );

  // No viewport on the server. `false` matches the old hook's initial state, so
  // the server HTML is unchanged.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

// Preset breakpoints matching Tailwind defaults
export const breakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
  mobile: "(max-width: 639px)",
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  /* Primary pointer is a touch surface (phones/tablets). Deliberately not
     any-pointer: touchscreen laptops should keep desktop behavior. */
  coarse: "(pointer: coarse)",
} as const;
