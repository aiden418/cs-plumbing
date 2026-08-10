"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { OPENAI_PIXEL_ID } from "@/lib/pixel";

const OAIQ_DEBUG = process.env.NODE_ENV !== "production";

export default function OpenAIPixel() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // The SDK fires page_viewed on init for the landing page; this covers
  // client-side route changes, which never reload the pixel.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (window.oaiq) {
      window.oaiq("measure", "page_viewed", { type: "contents" });
    }
  }, [pathname]);

  return (
    <Script id="openai-pixel" strategy="afterInteractive">
      {`
        !function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};
        q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=!0;j.src=u;
        var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}
        (window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
        oaiq("init",{pixelId:"${OPENAI_PIXEL_ID}",debug:${OAIQ_DEBUG}});
      `}
    </Script>
  );
}
