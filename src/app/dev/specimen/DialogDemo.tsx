"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Dialog, { type DialogVariant } from "@/components/ui/Dialog";

const VARIANTS: { variant: DialogVariant; label: string }[] = [
  { variant: "modal", label: "Open modal" },
  { variant: "sheet-bottom", label: "Open bottom sheet" },
  { variant: "sheet-right", label: "Open right sheet" },
  { variant: "sheet", label: "Open responsive sheet" },
  { variant: "fullscreen", label: "Open fullscreen" },
];

/** Specimen only: one button per Dialog variant. */
export default function DialogDemo() {
  const [open, setOpen] = useState<DialogVariant | null>(null);
  return (
    <div className="flex flex-wrap gap-3">
      {VARIANTS.map(({ variant, label }) => (
        <Button key={variant} variant="secondary" size="sm" onClick={() => setOpen(variant)} data-dialog-open={variant}>
          {label}
        </Button>
      ))}
      {VARIANTS.map(({ variant }) => (
        <Dialog
          key={variant}
          open={open === variant}
          onClose={() => setOpen(null)}
          variant={variant}
          title={`Dialog: ${variant}`}
          tone={variant === "fullscreen" ? "ink" : "white"}
        >
          <div className="space-y-4">
            <p className="max-w-[56ch]">
              Esc, the close button and a click on the backdrop close this dialog, and focus goes back to the button
              that opened it. Tab stays inside.
            </p>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-fg">A field to tab to</span>
              <input className="min-h-12 w-full rounded-control border border-steel-300 bg-white px-3 text-base text-ink" />
            </label>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setOpen(null)}>Done</Button>
              <Button variant="ghost" href="/contact">
                A link inside
              </Button>
            </div>
            {variant !== "modal" &&
              Array.from({ length: 8 }, (_, i) => (
                <p key={i} className="text-muted">
                  Filler paragraph {i + 1} so the body scrolls inside the dialog while the page behind stays put.
                </p>
              ))}
          </div>
        </Dialog>
      ))}
    </div>
  );
}
