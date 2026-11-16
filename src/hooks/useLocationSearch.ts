"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

// The address bar tells nobody when it changes. React reads it again by itself
// after hydrating and after each commit, which is all this hook needs.
const subscribe = () => () => {};
const getServerSnapshot = () => null;

/**
 * The query string the page on screen was opened with (e.g. "?plan=comfort"),
 * or null when it has none or it cannot be known yet:
 *
 * - in the server HTML and while hydrating. Pages are prerendered without
 *   their query string, and next/navigation's useSearchParams() would take the
 *   calling component out of that HTML (QuoteBuilderPage is wrapped in
 *   <Suspense> for that reason; a page whose H1 sits in the same component
 *   cannot be).
 * - on the first render of an in-site navigation. Next updates the address
 *   bar when it commits the new page, so until then window.location still
 *   describes the page being left, and its query string is not this page's.
 *
 * In both cases React renders again with the real value straight away. A page
 * opened without a query string stays at null and is never re-rendered by
 * this hook.
 *
 * Use it instead of reading window.location.search in a mount effect and
 * copying the result into state there (react-hooks/set-state-in-effect).
 */
export default function useLocationSearch(): string | null {
  const pathname = usePathname();
  return useSyncExternalStore(
    subscribe,
    () => (window.location.pathname === pathname && window.location.search) || null,
    getServerSnapshot
  );
}
