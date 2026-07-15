"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/chat/ChatWidget"), {
  ssr: false,
  loading: () => null,
});
const CouponPopup = dynamic(() => import("@/components/ui/CouponPopup"), {
  ssr: false,
  loading: () => null,
});

/**
 * dynamic({ssr:false}) alone still downloads both chunks at hydration — it
 * only skips server rendering. Gating the mount on idle time (or the first
 * interaction, whichever comes first) keeps these framer-motion-bearing
 * bundles off the critical path on cell connections. The widgets' own
 * appearance timers still apply after mount.
 */
export default function DeferredWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    let done = false;
    const arm = () => {
      if (done) return;
      done = true;
      setReady(true);
      cleanup();
    };

    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(arm, { timeout: 3000 })
        : null;
    const timeoutId = idleId === null ? window.setTimeout(arm, 3000) : null;
    window.addEventListener("pointerdown", arm, { once: true, passive: true });
    window.addEventListener("scroll", arm, { once: true, passive: true });

    const cleanup = () => {
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("scroll", arm);
    };
    return cleanup;
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <ChatWidget />
      <CouponPopup />
    </>
  );
}
