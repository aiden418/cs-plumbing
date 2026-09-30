"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// Client-only flag: false during SSR and the first hydration, true once any
// page has mounted. The fade is for in-app navigations; on the initial load
// it must not run, because `initial={{ opacity: 0 }}` is server-rendered as
// an inline opacity:0 on the whole page and nothing is visible until the JS
// bundle arrives — on a throttled phone that was a 4 s LCP on /builders.
let hasMountedOnce = false;

export default function PageTransition({ children }: PageTransitionProps) {
  // Captured once per mount so SSR and hydration agree (both see `false`).
  const [fadeIn] = useState(hasMountedOnce);

  useEffect(() => {
    hasMountedOnce = true;
  }, []);

  return (
    <motion.div
      // opacity-only: a transformed ancestor breaks position:fixed and
      // ScrollTrigger pin measurements taken during the entrance
      initial={fadeIn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
