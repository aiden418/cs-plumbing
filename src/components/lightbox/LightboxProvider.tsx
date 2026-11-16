"use client";

import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { MediaRef } from "@/lib/media-types";

/**
 * One lightbox per page. Every filmstrip and the gallery grid register their
 * photos here as a collection; a photo opens the lightbox scoped to its own
 * collection. The dialog's code is fetched on first use (or when a pointer
 * or keyboard focus reaches a photo), so a page that is only read never
 * downloads it.
 *
 * Providers nest safely: an inner provider defers to the outer one, so a
 * page that holds several explorers still has a single <dialog>.
 */

export type LightboxNext = {
  /** Collection id of the next phase. */
  id: string;
  /** Its name, shown as "Continue to <label>". */
  label: string;
};

export type LightboxCollection = {
  id: string;
  /** The collection title in the top bar ("IFHA Community Center: Underground"). */
  title: string;
  items: MediaRef[];
  next?: LightboxNext;
  /**
   * Called when the lightbox closes on this collection: put focus back on
   * photo `index` and bring it into view.
   */
  restore?: (index: number) => void;
};

type ActiveState = {
  collection: LightboxCollection;
  index: number;
  opener: HTMLElement | null;
};

type LightboxApi = {
  register: (collection: LightboxCollection) => () => void;
  open: (id: string, index: number, opener?: HTMLElement | null) => void;
  preload: () => void;
};

const LightboxContext = createContext<LightboxApi | null>(null);

const loadLightbox = () => import("./Lightbox");
const Lightbox = lazy(loadLightbox);

let preloaded = false;
function preloadLightbox() {
  if (preloaded) return;
  preloaded = true;
  loadLightbox().catch(() => {
    preloaded = false;
  });
}

/** The page's lightbox, or null outside a provider (photos then stay links to their files). */
export function useLightbox(): LightboxApi | null {
  return useContext(LightboxContext);
}

export default function LightboxProvider({ children }: { children: ReactNode }) {
  const parent = useContext(LightboxContext);
  if (parent) return <>{children}</>;
  return <RootLightboxProvider>{children}</RootLightboxProvider>;
}

function RootLightboxProvider({ children }: { children: ReactNode }) {
  const registry = useRef(new Map<string, LightboxCollection>());
  const [active, setActive] = useState<ActiveState | null>(null);

  const register = useCallback((collection: LightboxCollection) => {
    registry.current.set(collection.id, collection);
    return () => {
      if (registry.current.get(collection.id) === collection) registry.current.delete(collection.id);
    };
  }, []);

  const open = useCallback((id: string, index: number, opener: HTMLElement | null = null) => {
    const collection = registry.current.get(id);
    if (!collection || collection.items.length === 0) return;
    preloadLightbox();
    setActive({
      collection,
      index: Math.min(Math.max(index, 0), collection.items.length - 1),
      opener,
    });
  }, []);

  const api = useMemo<LightboxApi>(() => ({ register, open, preload: preloadLightbox }), [register, open]);

  const onContinue = useCallback((nextId: string) => {
    const collection = registry.current.get(nextId);
    if (!collection || collection.items.length === 0) return;
    setActive((current) => (current ? { collection, index: 0, opener: null } : current));
  }, []);

  const onClose = useCallback(
    (lastIndex: number) => {
      const state = active;
      setActive(null);
      if (!state) return;
      // The collection's own rail puts focus back and scrolls to the last
      // photo seen; without one, the opener gets focus back.
      const live = registry.current.get(state.collection.id) ?? state.collection;
      if (live.restore) live.restore(lastIndex);
      else if (state.opener?.isConnected) state.opener.focus();
    },
    [active],
  );

  return (
    <LightboxContext.Provider value={api}>
      {children}
      {active && (
        <Suspense fallback={null}>
          <Lightbox
            collection={active.collection}
            startIndex={active.index}
            onClose={onClose}
            onContinue={onContinue}
          />
        </Suspense>
      )}
    </LightboxContext.Provider>
  );
}
