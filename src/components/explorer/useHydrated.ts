"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False in the server HTML and during hydration, true once React runs in the
 * browser. Lets a control render its no-JavaScript form (a link) first and
 * upgrade itself (a button) after hydration without a mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
