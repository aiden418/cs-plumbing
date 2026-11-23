import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import LogoLockup from "@/components/ui/LogoLockup";
import { Menu, Minus, Phone, Plus, MessageSquareText } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { LATEST_AWARD } from "@/lib/awards";
import { picture } from "@/lib/media";
import type { MediaRef } from "@/lib/media-types";
import { cn } from "@/lib/utils";
import {
  MOBILE_GROUPS,
  MOBILE_LINKS,
  NAV_ACTIONS,
  NAV_ORDER,
  type NavGroup,
  type NavItem as NavItemData,
} from "@/content/navigation";
import HeaderController, { HeaderLink, NavItem } from "./HeaderController";
import MobileNavSheet, { MenuButton, TextUsLink } from "./MobileNavSheet";

/**
 * The site header (.redesign/spec/chrome-and-opening.md sections 1 and 2;
 * version 2 look: .redesign/spec/v2-bright.md, Chrome). White with navy
 * text; transparent over a [data-hero-photo] hero until the page scrolls
 * (header.css).
 *
 * Server component: the whole header, all four panels (hidden) and the full
 * mobile menu are in the server HTML, so every link is in the page source
 * and works without JavaScript. HeaderController and MobileNavSheet are thin
 * client shells that receive this content as children.
 *
 * Opening contract: data-intro-in marks what the homepage intro holds back
 * (the navigation list, "Get a quote", "Request Service", the menu button).
 * The logo and the Call button never carry it.
 */

const CALL_LABEL = `Call ${BUSINESS.phone}`;

function PanelLink({ link, className }: { link: NavItemData; className?: string }) {
  return (
    <li>
      <HeaderLink href={link.href} className={cn("panel-link", className)}>
        {link.label}
      </HeaderLink>
    </li>
  );
}

/**
 * One panel's content. `lookup` resolves the photo positions (picture() by
 * default); a position without a picture simply leaves the panel without
 * that photo.
 */
export function Panel({ group, lookup = picture }: { group: NavGroup; lookup?: (id: string) => MediaRef | null }) {
  const photos = group.photos
    .map((p) => ({ ...p, media: lookup(p.id) }))
    .filter((p) => p.media !== null);
  const linkSpan =
    photos.length === 2 ? "col-span-8" : photos.length === 1 ? "col-span-9" : group.columns.length === 1 ? "col-span-8" : "col-span-12";
  const columnCount = group.columns.length;

  return (
    <Container size="wide" className="max-w-none">
      <div className="grid max-w-[84rem] grid-cols-12 gap-x-8 pt-8 pb-9">
        <div className={cn(linkSpan, "grid gap-x-8")} style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
          {group.columns.map((column, i) => (
            <div key={column.title ?? i} className="min-w-0">
              {column.title && <p className="panel-title">{column.title}</p>}
              <ul className={cn("panel-list", group.id === "about" && "panel-list--split")}>
                {column.links.map((link) => (
                  <PanelLink key={link.href} link={link} />
                ))}
              </ul>
            </div>
          ))}
        </div>
        {photos.length > 0 && (
          <div className={cn(photos.length === 1 ? "col-span-3" : "col-span-4", "flex justify-end gap-6")}>
            {photos.map((p) => (
              <Frame
                key={p.id}
                media={p.media}
                aspect="4/5"
                sizes="160px"
                alt=""
                caption={p.caption}
                className="w-[9.5rem] shrink-0"
              />
            ))}
          </div>
        )}
        {group.footer && group.footer.length > 0 && (
          <ul className="panel-footer col-span-12">
            {group.footer.map((link) => (
              <li key={link.href}>
                <HeaderLink href={link.href} className="panel-link panel-link--inline">
                  {link.label}
                </HeaderLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}

function MobileMenu() {
  return (
    <nav aria-label="Menu" className="mnav">
      <div className="mnav-groups">
        {MOBILE_GROUPS.map((group) => {
          const links = [
            group.hub,
            ...group.columns.flatMap((c) => c.links),
            ...(group.footer ?? []),
          ].filter((link, i, all) => all.findIndex((l) => l.href === link.href) === i);
          return (
            <details key={group.id} name="mnav" className="mnav-group group">
              <summary className="mnav-row mnav-summary">
                <span>{group.label}</span>
                <Plus className="size-6 group-open:hidden" />
                <Minus className="hidden size-6 group-open:block" />
              </summary>
              <ul className="mnav-list">
                {links.map((link) => (
                  <li key={link.href}>
                    <HeaderLink href={link.href} className="mnav-link">
                      {link.label}
                    </HeaderLink>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
        {MOBILE_LINKS.map((link) => (
          <HeaderLink key={link.href} href={link.href} className="mnav-row">
            {link.label}
          </HeaderLink>
        ))}
      </div>

      <div className="mnav-actions">
        <a href={BUSINESS.phoneHref} className="mnav-action mnav-action--primary">
          <Phone className="size-5" />
          {CALL_LABEL}
        </a>
        <TextUsLink href={BUSINESS.smsHref} className="mnav-action">
          <MessageSquareText className="size-5" />
          {NAV_ACTIONS.text.label}
        </TextUsLink>
        <HeaderLink href={NAV_ACTIONS.book.href} className="mnav-action">
          {NAV_ACTIONS.book.label}
        </HeaderLink>
        <HeaderLink href={NAV_ACTIONS.quote.href} className="mnav-action">
          {NAV_ACTIONS.quote.label}
        </HeaderLink>
      </div>

      <ul className="mnav-facts">
        <li>{BUSINESS.hours.open}</li>
        <li>{`Licensed ${BUSINESS.license}`}</li>
        <li>{LATEST_AWARD.title}</li>
      </ul>
    </nav>
  );
}

export default function SiteHeader() {
  return (
    <HeaderController
      sheet={
        <MobileNavSheet label="Menu" logo={<LogoLockup size="sm" surface="light" wordmark={false} className="header-logo" />}>
          <MobileMenu />
        </MobileNavSheet>
      }
    >
      <Container size="wide" className="header-bar max-w-none">
        <LogoLockup size="sm" surface="light" wordmark={false} preload className="header-logo" />

        <nav aria-label="Main" className="header-nav">
          <ul data-intro-in="" className="header-nav-list">
            {NAV_ORDER.map((item) =>
              item.kind === "link" ? (
                <li key={item.link.href} className="nav-item">
                  <HeaderLink href={item.link.href} sections={item.sections} className="nav-link">
                    {item.link.label}
                  </HeaderLink>
                </li>
              ) : (
                <NavItem
                  key={item.group.id}
                  id={item.group.id}
                  buttonLabel={`Show ${item.group.label} menu`}
                  panel={<Panel group={item.group} />}
                >
                  <HeaderLink href={item.group.href} sections={item.group.sections} className="nav-link">
                    {item.group.short ? (
                      <>
                        <span className="nav-label-long">{item.group.label}</span>
                        <span className="nav-label-short" aria-hidden="true">
                          {item.group.short}
                        </span>
                      </>
                    ) : (
                      item.group.label
                    )}
                  </HeaderLink>
                </NavItem>
              ),
            )}
          </ul>
        </nav>

        <div className="header-actions">
          <HeaderLink href={NAV_ACTIONS.quote.href} className="nav-link header-quote" data-intro-in="">
            <span className="header-quote-long">{NAV_ACTIONS.quote.label}</span>
            <span className="header-quote-short" aria-hidden="true">
              {NAV_ACTIONS.quote.short}
            </span>
          </HeaderLink>
          <a href={BUSINESS.phoneHref} className="header-call">
            <Phone className="size-5 shrink-0" />
            <span className="header-call-text">
              <span className="header-call-label">
                <span className="header-call-word">Call </span>
                <span className="header-call-number">{BUSINESS.phone}</span>
              </span>
              <span className="header-hours">{BUSINESS.hours.open}</span>
            </span>
          </a>
          <HeaderLink href={NAV_ACTIONS.book.href} className="header-book" data-intro-in="">
            {NAV_ACTIONS.book.label}
          </HeaderLink>
          <MenuButton className="header-menu">
            <Menu className="size-6" />
            <span className="sr-only">Menu</span>
          </MenuButton>
        </div>
      </Container>
    </HeaderController>
  );
}
