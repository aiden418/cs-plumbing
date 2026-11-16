"use client";

import { useEffect, useRef, useSyncExternalStore, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { X } from "@/components/ui/icons";
import { trackTextClick } from "@/lib/pixel";
import { MENU_BUTTON_ID, MENU_DIALOG_ID, useHeader } from "./HeaderController";

/**
 * The mobile menu (.redesign/spec/chrome-and-opening.md section 2): a modal
 * <dialog> opened with showModal(), so the browser traps focus, makes the
 * page inert and closes it on Escape. Its content (groups, links, actions,
 * facts) is rendered by SiteHeader on the server and passed in as children.
 *
 * While open it sets body[data-drawer-open] (the phone dock and the request
 * button hide). It closes on Escape, the close button, a link tap and a route
 * change, and focus returns to the menu button.
 */

const subscribeNothing = () => () => {};

/** False during the server render and hydration, true afterwards. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}

interface MenuButtonProps {
  children: ReactNode;
  className?: string;
}

/**
 * The menu button: a real link to the footer navigation, so it works without
 * JavaScript, upgraded to a button that opens the dialog once hydrated.
 */
export function MenuButton({ children, className }: MenuButtonProps) {
  const { menuOpen, setMenuOpen } = useHeader();
  const hydrated = useHydrated();

  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenuOpen(true);
  };
  // A link answers Enter only; as a button it answers Space as well.
  const onKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === " ") {
      event.preventDefault();
      setMenuOpen(true);
    }
  };

  return (
    <a
      href="#footer-nav"
      id={MENU_BUTTON_ID}
      className={className}
      data-intro-in=""
      role={hydrated ? "button" : undefined}
      aria-haspopup={hydrated ? "dialog" : undefined}
      aria-expanded={hydrated ? menuOpen : undefined}
      aria-controls={hydrated ? MENU_DIALOG_ID : undefined}
      onClick={open}
      onKeyDown={onKeyDown}
    >
      {children}
    </a>
  );
}

interface MobileNavSheetProps {
  /** The top bar's logo (a server-rendered LogoLockup). */
  logo: ReactNode;
  /** The menu's content. */
  children: ReactNode;
  /** The dialog's accessible name. */
  label: string;
}

export default function MobileNavSheet({ logo, children, label }: MobileNavSheetProps) {
  const { menuOpen, setMenuOpen } = useHeader();
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Keep the dialog and the body attribute in step with the state.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (menuOpen) {
      if (!dialog.open) {
        dialog.showModal();
        closeRef.current?.focus();
      }
      document.body.setAttribute("data-drawer-open", "");
    } else {
      if (dialog.open) dialog.close();
      document.body.removeAttribute("data-drawer-open");
    }
  }, [menuOpen]);

  useEffect(() => () => document.body.removeAttribute("data-drawer-open"), []);

  // Escape, the close button and dialog.close() all end here.
  const onClose = () => {
    document.body.removeAttribute("data-drawer-open");
    setMenuOpen(false);
    const button = document.getElementById(MENU_BUTTON_ID);
    if (button && button.offsetParent !== null) button.focus();
  };

  // A tap on any link in the menu closes it (the route change would too, but
  // not for a link to the page already open). Delegated: no handler is put on
  // a tel: link and nothing stops propagation.
  const onClick = (event: MouseEvent<HTMLDialogElement>) => {
    const target = event.target;
    if (target instanceof Element && target.closest("a[href]")) ref.current?.close();
  };

  return (
    <dialog
      ref={ref}
      id={MENU_DIALOG_ID}
      className="mnav-dialog"
      data-tone="ink"
      aria-label={label}
      onClose={onClose}
      onClick={onClick}
    >
      <div className="mnav-top">
        {logo}
        <button
          ref={closeRef}
          type="button"
          className="mnav-close"
          onClick={() => ref.current?.close()}
        >
          <X className="size-6" />
          <span className="sr-only">Close menu</span>
        </button>
      </div>
      <div className="mnav-body">{children}</div>
    </dialog>
  );
}

interface TextUsLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/** The "Text us" link: keeps trackTextClick, as the phone dock's Text link does. */
export function TextUsLink({ href, className, children }: TextUsLinkProps) {
  return (
    <a href={href} className={className} onClick={trackTextClick}>
      {children}
    </a>
  );
}
