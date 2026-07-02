"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient drone-footage layer for the homepage hero. The static hero JPG
 * stays as the LCP/poster underneath; this fades in on top only when
 * every condition is met:
 *  - /videos/hero-loop.mp4 exists (404/decode error keeps the image)
 *  - user doesn't prefer reduced motion
 *  - connection isn't save-data / 2g
 *  - hero is on screen (IntersectionObserver defers the network hit)
 * Ships dark until the video asset is added to public/videos/.
 */
const VIDEO_SRC = "/videos/hero-loop.mp4";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData || conn?.effectiveType === "2g") return;

    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || !videoRef.current) return;
    const el = videoRef.current;
    el.src = VIDEO_SRC;
    el.load();
    const play = el.play();
    if (play) play.catch(() => {});
  }, [shouldLoad]);

  if (failed) return null;

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      aria-hidden
      onCanPlay={() => setReady(true)}
      onError={() => setFailed(true)}
      className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
