import type { Metadata } from "next";
import EmergencyPage from "./EmergencyPage";

export const metadata: Metadata = {
  title: "24/7 Emergency Plumber",
  description:
    "24/7 emergency plumbing service in Cape Coral, Fort Myers, North Fort Myers & Southwest Florida. Burst pipes, sewage backups, gas leaks, flooding — call C&S Plumbing now at 833-PLUMB-IT.",
  keywords: [
    "emergency plumber Cape Coral",
    "24/7 plumber Fort Myers",
    "emergency plumbing SWFL",
    "burst pipe repair Lee County",
    "emergency plumber near me",
    "after hours plumber Fort Myers",
    "weekend plumber Cape Coral",
  ],
  openGraph: {
    title: "24/7 Emergency Plumber | Cape Coral, Fort Myers, SWFL",
    description:
      "Plumbing emergency? C&S Plumbing responds 24/7 across Southwest Florida. Call 833-PLUMB-IT now.",
    url: "https://www.csplumbinglee.com/emergency",
  },
};

export default function Page() {
  return <EmergencyPage />;
}
