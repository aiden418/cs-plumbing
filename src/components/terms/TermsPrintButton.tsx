"use client";

import { Printer } from "lucide-react";
import Button from "@/components/ui/Button";

// The only client island on /terms. Everything else on the page is static.
export default function TermsPrintButton() {
  return (
    <Button
      variant="secondary"
      size="sm"
      icon={<Printer className="w-4 h-4" aria-hidden="true" />}
      onClick={() => window.print()}
      className="w-full sm:w-auto print:hidden"
    >
      Print / Save as PDF
    </Button>
  );
}
