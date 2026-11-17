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

/** The homepage Opening's longest beat is about 2 s; never wait longer than this for it. */
const INTRO_WAIT_MS = 6000;

/**
 * dynamic({ssr:false}) alone still downloads both chunks at hydration — it
 * only skips server rendering. Gating the mount on idle time (or the first
 * interaction, whichever comes first) keeps these bundles off the critical
 * path on cell connections. The widgets' own appearance timers still apply
 * after mount.
 *
 * While the homepage Opening runs (<html data-intro> is set) nothing floats
 * over it: when the gate opens with the attribute present, the mount waits
 * for `cs:intro-done` on document, or INTRO_WAIT_MS at most.
 */
export default function DeferredWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    let done = false;
    let introTimer: number | null = null;

    const mount = () => {
      if (introTimer !== null) window.clearTimeout(introTimer);
      document.removeEventListener("cs:intro-done", mount);
      setReady(true);
    };

    const arm = () => {
      if (done) return;
      done = true;
      cleanupArm();
      if (document.documentElement.hasAttribute("data-intro")) {
        document.addEventListener("cs:intro-done", mount, { once: true });
        introTimer = window.setTimeout(mount, INTRO_WAIT_MS);
      } else {
        mount();
      }
    };

    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(arm, { timeout: 3000 })
        : null;
    const timeoutId = idleId === null ? window.setTimeout(arm, 3000) : null;
    window.addEventListener("pointerdown", arm, { once: true, passive: true });
    window.addEventListener("scroll", arm, { once: true, passive: true });

    const cleanupArm = () => {
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("scroll", arm);
    };
    return () => {
      cleanupArm();
      if (introTimer !== null) window.clearTimeout(introTimer);
      document.removeEventListener("cs:intro-done", mount);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <ChatWidget />
      <CouponPopup />
    </>
  );
}
