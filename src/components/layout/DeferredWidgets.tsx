"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/chat/ChatWidget"), {
  ssr: false,
  loading: () => null,
});
const CouponPopup = dynamic(() => import("@/components/ui/CouponPopup"), {
  ssr: false,
  loading: () => null,
});

export default function DeferredWidgets() {
  return (
    <>
      <ChatWidget />
      <CouponPopup />
    </>
  );
}
