"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ChevronDown } from "@/components/ui/icons";

/**
 * The behaviour of the site header (.redesign/spec/chrome-and-opening.md
 * section 1). SiteHeader renders every link, panel and the mobile menu on
 * the server; these client shells only hold state: which panel is open,
 * whether the mobile menu is open, whether the page has scrolled, and which
 * link is the current page.
 *
 * One implementation for every browser (no Popover API). Never calls
 * stopPropagation and never puts a handler on a tel: link: call tracking
 * listens for clicks at the document.
 */

const HOVER_OPEN_MS = 80;
const HOVER_CLOSE_MS = 150;
const HOVER_GRACE_MS = 500;
/** The nav breakpoint (--breakpoint-nav). */
const DESKTOP_QUERY = "(min-width: 70rem)";

interface HeaderState {
  pathname: string;
  /** The open panel's id, or null. */
  open: string | null;
  toggle: (id: string) => void;
  close: () => void;
  hoverEnter: (id: string) => void;
  hoverLeave: (id: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const HeaderContext = createContext<HeaderState | null>(null);

export function useHeader(): HeaderState {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeader: outside HeaderController");
  return ctx;
}

export const panelId = (id: string) => `nav-panel-${id}`;
export const buttonId = (id: string) => `nav-button-${id}`;
export const MENU_BUTTON_ID = "menu-button";
export const MENU_DIALOG_ID = "mobile-nav";

/** True when `pathname` is `href` or a page under it. */
export function inSection(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((p) => p !== "/" && (pathname === p || pathname.startsWith(`${p}/`)));
}

/** The path of an href without its hash or query ("/builders#bid" -> "/builders"). */
export function hrefPath(href: string): string {
  return href.split(/[?#]/)[0] || "/";
}

interface HeaderControllerProps {
  /** The header's content: logo, navigation, actions. */
  children: ReactNode;
  /** The mobile menu dialog, rendered after the header. */
  sheet: ReactNode;
}

export default function HeaderController({ children, sheet }: HeaderControllerProps) {
  // Null outside the App Router (tests render the header with no router).
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // A route change closes every panel and the menu. Adjusted during render
  // so the new page never paints with the old page's panel still open.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(null);
    setMenuOpen(false);
  }

  const clearTimer = () => {
    if (timer.current !== undefined) window.clearTimeout(timer.current);
    timer.current = undefined;
  };

  // When hovering has just opened a panel, a click on its button (the
  // pointer arrived to press it) keeps it open instead of closing it again.
  const hoverOpenedAt = useRef(0);

  const toggle = useCallback((id: string) => {
    clearTimer();
    const justHovered = performance.now() - hoverOpenedAt.current < HOVER_GRACE_MS;
    setOpen((current) => (current === id && !justHovered ? null : id));
  }, []);

  const close = useCallback(() => {
    clearTimer();
    setOpen(null);
  }, []);

  const hoverEnter = useCallback((id: string) => {
    clearTimer();
    timer.current = window.setTimeout(() => {
      hoverOpenedAt.current = performance.now();
      setOpen(id);
    }, HOVER_OPEN_MS);
  }, []);

  const hoverLeave = useCallback((id: string) => {
    clearTimer();
    timer.current = window.setTimeout(() => setOpen((current) => (current === id ? null : current)), HOVER_CLOSE_MS);
  }, []);

  useEffect(() => () => clearTimer(), []);

  // data-scrolled: the hairline under the header appears once the page has
  // scrolled. Written straight to the element (React does not own the
  // attribute), so scrolling never re-renders the header.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      header.toggleAttribute("data-scrolled", window.scrollY > 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Escape closes the open panel (and returns focus to its button when focus
  // was inside it); a press outside the header closes it; crossing the nav
  // breakpoint closes whichever menu no longer exists at the new width.
  useEffect(() => {
    if (open === null) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const item = document.querySelector(`[data-nav-item="${open}"]`);
      const active = document.activeElement;
      clearTimer();
      setOpen(null);
      if (item && active && item.contains(active)) document.getElementById(buttonId(open))?.focus();
    };
    const onPointerDown = (event: globalThis.PointerEvent) => {
      const header = headerRef.current;
      if (header && event.target instanceof Node && !header.contains(event.target)) {
        clearTimer();
        setOpen(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (query.matches) setMenuOpen(false);
      else setOpen(null);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const value = useMemo<HeaderState>(
    () => ({ pathname, open, toggle, close, hoverEnter, hoverLeave, menuOpen, setMenuOpen }),
    [pathname, open, toggle, close, hoverEnter, hoverLeave, menuOpen],
  );

  return (
    <HeaderContext.Provider value={value}>
      <header ref={headerRef} className="site-header" data-tone="ink" data-panel-open={open ?? undefined}>
        {children}
      </header>
      {sheet}
    </HeaderContext.Provider>
  );
}

interface NavItemProps {
  id: string;
  /** "Show Services menu". */
  buttonLabel: string;
  /** The hub link (a HeaderLink). */
  children: ReactNode;
  /** The panel's content, rendered on the server. */
  panel: ReactNode;
}

/**
 * One ▾ item: the hub link, a separate disclosure button and its panel. The
 * panel sits inside the item in the DOM, so Tab moves from the button into
 * the panel; it is positioned against the header as a full-width sheet.
 */
export function NavItem({ id, buttonLabel, children, panel }: NavItemProps) {
  const { open, toggle, close, hoverEnter, hoverLeave } = useHeader();
  const isOpen = open === id;

  const onPointerEnter = (event: PointerEvent<HTMLLIElement>) => {
    if (event.pointerType === "mouse") hoverEnter(id);
  };
  const onPointerLeave = (event: PointerEvent<HTMLLIElement>) => {
    if (event.pointerType === "mouse") hoverLeave(id);
  };
  // Tab out of the item (button or panel) closes its panel.
  const onBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (!isOpen) return;
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    if (next === null) return; // focus left the document or went to nothing: a click elsewhere handles it
    close();
  };

  return (
    <li
      className="nav-item"
      data-nav-item={id}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={onBlur}
    >
      {children}
      <button
        type="button"
        id={buttonId(id)}
        className="nav-disclosure"
        aria-expanded={isOpen}
        aria-controls={panelId(id)}
        onClick={() => toggle(id)}
      >
        <ChevronDown className="size-4" />
        <span className="sr-only">{buttonLabel}</span>
      </button>
      <div id={panelId(id)} className="nav-panel" hidden={!isOpen}>
        {panel}
      </div>
    </li>
  );
}

interface HeaderLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Path prefixes that make this link's section current (top-level items). */
  sections?: readonly string[];
  /** Extra attributes for the Opening contract and the like. */
  [key: `data-${string}`]: string | boolean | undefined;
}

/**
 * A header link that knows the current page: aria-current="page" on an exact
 * match, data-current when the page is inside its section.
 */
export function HeaderLink({ href, children, className, sections, ...data }: HeaderLinkProps) {
  const pathname = useContext(HeaderContext)?.pathname ?? "";
  const exact = !href.includes("#") && pathname === hrefPath(href);
  const current = exact || (sections ? inSection(pathname, sections) : false);
  return (
    <Link
      href={href}
      className={className}
      aria-current={exact ? "page" : undefined}
      data-current={current || undefined}
      {...data}
    >
      {children}
    </Link>
  );
}
