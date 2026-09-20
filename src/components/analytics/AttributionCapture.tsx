"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Records how the visitor arrived (ad click, tagged link, referrer) on the
 * first render of each page load, so lead forms can attach it later.
 * Mounted once in the root layout; renders nothing.
 */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
