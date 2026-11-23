import CtaBand from "@/components/ui/CtaBand";
import { picture } from "@/lib/media";

/**
 * The closing band used by 35 pages. A thin wrapper around CtaBand with the
 * same words and links as before the redesign: the heading, the line under
 * it, Call and Request Service, and the small promise line.
 */
export default function CTASection() {
  return (
    <CtaBand
      title="Ready to Get Started?"
      body="Whether it's an emergency or a planned project, our team is ready to deliver the quality and reliability that's made us Southwest Florida's most trusted plumbing company."
      secondary={{ label: "Request Service", href: "/booking" }}
      showHours={false}
      note="Free estimates · No hidden fees · Satisfaction guaranteed"
      media={picture("contact.band")}
    />
  );
}
