"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { TAG_IDS } from "@/lib/pixel";

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

  // Tags off (NEXT_PUBLIC_ANALYTICS=off): no pixel script, so window.oaiq
  // never exists and the effect above has nothing to call.
  if (!TAG_IDS) return null;
  // Named as before so the tag markup below is unchanged. This is the real
  // id unless the build is in placeholder mode.
  const OPENAI_PIXEL_ID = TAG_IDS.openai;

  // lazyOnload, like the Meta pixel: the SDK is fetched once the page has
  // loaded, so it never competes with the first screen. Its click cookie is
  // read on init either way, and a form lead comes long after that.
  return (
    <Script id="openai-pixel" strategy="lazyOnload">
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
