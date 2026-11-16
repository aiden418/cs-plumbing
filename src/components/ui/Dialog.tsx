"use client";

import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "@/components/ui/icons";

export type DialogVariant = "modal" | "sheet-bottom" | "sheet-right" | "sheet" | "fullscreen";

interface DialogProps {
  open: boolean;
  /** Called whenever the dialog closes: Esc, the close button, a backdrop click or `open` turning false. */
  onClose: () => void;
  /** Required: it labels the dialog. */
  title: ReactNode;
  /** Shown visually hidden when false (the dialog stays labelled). */
  showTitle?: boolean;
  /**
   * modal: centred panel. sheet-bottom / sheet-right: slides in from that
   * edge. sheet: bottom on phones, right from 48rem. fullscreen: the whole
   * window.
   */
  variant?: DialogVariant;
  /** The dialog's own surface (it sits outside the page's sections). */
  tone?: "white" | "shell" | "ink";
  closeLabel?: string;
  children: ReactNode;
  className?: string;
  /** Extra content in the top bar, before the close button. */
  headerExtra?: ReactNode;
}

const panel: Record<DialogVariant, string> = {
  modal: cn(
    "m-auto w-[calc(100%-2rem)] max-w-lg max-h-[min(44rem,calc(100dvh-2rem))] rounded-frame shadow-float",
    "translate-y-3 opacity-0 open:translate-y-0 open:opacity-100 starting:open:translate-y-3 starting:open:opacity-0",
  ),
  "sheet-bottom": cn(
    "mx-0 mt-auto mb-0 w-full max-w-none max-h-[88dvh] rounded-t-frame shadow-float",
    "translate-y-full open:translate-y-0 starting:open:translate-y-full",
  ),
  "sheet-right": cn(
    "my-0 mr-0 ml-auto h-dvh max-h-none w-[min(30rem,100%)] max-w-none shadow-float",
    "translate-x-full open:translate-x-0 starting:open:translate-x-full",
  ),
  sheet: cn(
    "mx-0 mt-auto mb-0 w-full max-w-none max-h-[88dvh] rounded-t-frame shadow-float",
    "translate-y-full open:translate-y-0 starting:open:translate-y-full",
    "md:my-0 md:mr-0 md:ml-auto md:h-dvh md:max-h-none md:w-[min(30rem,100%)] md:rounded-none",
    "md:translate-x-full md:translate-y-0 md:open:translate-x-0 md:starting:open:translate-x-full md:starting:open:translate-y-0",
  ),
  fullscreen: cn(
    "m-0 h-dvh max-h-none w-full max-w-none",
    "opacity-0 open:opacity-100 starting:open:opacity-0",
  ),
};

/**
 * A native modal <dialog> opened with showModal(): the browser traps focus,
 * makes the page inert, closes on Esc and puts focus back where it was.
 * Scroll lock comes from the base CSS (html:has(dialog:modal[open])).
 * Enter and exit use @starting-style and transition-behavior where the
 * browser has them, and are instant elsewhere.
 *
 * Never stops propagation: call tracking listens for clicks at the document.
 */
export default function Dialog({
  open,
  onClose,
  title,
  showTitle = true,
  variant = "modal",
  tone = "white",
  closeLabel = "Close",
  children,
  className,
  headerExtra,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      const target = returnFocus.current;
      returnFocus.current = null;
      if (target && target.isConnected && document.activeElement !== target) target.focus();
      onCloseRef.current();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  // A click whose target is the <dialog> itself landed on the backdrop: the
  // panel's content fills the dialog box, so clicks inside never target it.
  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      data-tone={tone}
      data-variant={variant}
      onClick={onBackdropClick}
      className={cn(
        "overflow-hidden bg-canvas p-0 text-body",
        "transition-[opacity,transform,display,overlay] duration-250 ease-enter [transition-behavior:allow-discrete]",
        "backdrop:opacity-0 backdrop:transition-[opacity,display,overlay] backdrop:duration-250 backdrop:[transition-behavior:allow-discrete]",
        "open:backdrop:opacity-100 starting:open:backdrop:opacity-0 motion-reduce:backdrop:transition-none",
        panel[variant],
        className,
      )}
    >
      <div className="flex max-h-[inherit] h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-rule py-2 pr-2 pl-5">
          <h2
            id={titleId}
            className={cn(
              "font-sans text-lg leading-snug font-semibold tracking-normal [font-stretch:100%]",
              !showTitle && "sr-only",
            )}
          >
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {headerExtra}
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="inline-flex size-11 items-center justify-center rounded-control text-fg transition-colors duration-150 hover:bg-fg/[0.06] active:scale-[0.96]"
            >
              <X className="size-6" />
              <span className="sr-only">{closeLabel}</span>
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">{children}</div>
      </div>
    </dialog>
  );
}
