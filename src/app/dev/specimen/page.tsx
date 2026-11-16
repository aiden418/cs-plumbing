import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/lib/business";
import { collection, slot } from "@/lib/media";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import CtaBand from "@/components/ui/CtaBand";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import Frame, { FrameLink, type FrameAspect } from "@/components/ui/Frame";
import LogoLockup from "@/components/ui/LogoLockup";
import Reveal from "@/components/ui/Reveal";
import Section, { type Tone } from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Stepper from "@/components/ui/Stepper";
import WizardProgress from "@/components/ui/WizardProgress";
import { LinkGrid } from "@/components/links/LinkGrid";
import { ArrowUpRight, Calendar, Phone, Send } from "@/components/ui/icons";
import DialogDemo from "./DialogDemo";

/**
 * Development-only specimen of the design system's primitives: every
 * component in every state on all four tones. 404 in a production build
 * unless it was built with NEXT_PUBLIC_ANALYTICS=off (review builds).
 * Never in the sitemap; noindex.
 */

export const metadata: Metadata = {
  title: "Specimen",
  robots: { index: false, follow: false },
};

const TONES: Tone[] = ["white", "shell", "navy", "ink"];

function specimenEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ANALYTICS === "off";
}

// Palette and contrast ------------------------------------------------------

const PALETTE: { name: string; hex: string }[] = [
  { name: "ink", hex: "#0A1730" },
  { name: "ink-700", hex: "#12244A" },
  { name: "navy", hex: "#1B2B4B" },
  { name: "primary", hex: "#0077CC" },
  { name: "primary-dark", hex: "#005FA3" },
  { name: "primary-300", hex: "#66B5F2" },
  { name: "brass", hex: "#B8975A" },
  { name: "brass-300", hex: "#D4BC8A" },
  { name: "brass-600", hex: "#A8884C" },
  { name: "bronze", hex: "#7A6235" },
  { name: "shell", hex: "#F5F2EC" },
  { name: "shell-200", hex: "#EAE6DC" },
  { name: "shell-300", hex: "#DCD6C8" },
  { name: "steel-200", hex: "#D9DDE3" },
  { name: "steel-300", hex: "#B4BCC7" },
  { name: "steel-400", hex: "#7F8A99" },
  { name: "steel-500", hex: "#5F6B7C" },
  { name: "steel-700", hex: "#3D4858" },
  { name: "steel-900", hex: "#131E30" },
  { name: "emergency", hex: "#D4281C" },
  { name: "emergency-dark", hex: "#B42318" },
  { name: "emergency-300", hex: "#FF7A70" },
  { name: "success", hex: "#34C759" },
  { name: "success-ink", hex: "#1A7F37" },
];

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function Ratio({ fg, bg, label }: { fg: string; bg: string; label: string }) {
  const r = contrast(fg, bg);
  return (
    <span className={cn("tabular-nums", r < 4.5 && "line-through decoration-1")} title={`${label}: ${r.toFixed(2)}:1`}>
      {label} {r.toFixed(1)}
    </span>
  );
}

// Real headlines from the site (shortest and longest H1) ---------------------

const SHORTEST_H1 = "Where We Work";
const LONGEST_H1 = "After the Storm: A Plumbing Damage Checklist for Southwest Florida Homeowners";

const SAMPLE_FAQS = [
  {
    question: "Do you work on new construction and on existing homes?",
    answer:
      "Yes. New construction for builders and general contractors, and service, repipes and remodels for homeowners across Southwest Florida.",
  },
  {
    question: "Which areas do you serve?",
    answer: "Lee, Collier and Charlotte counties, from Cape Coral and Fort Myers to Naples and Punta Gorda.",
  },
  {
    question: "Can I book online?",
    answer: "Yes: pick a service and a time on the booking page, or call the office.",
  },
];

const PHASES = [
  { label: "Underground", description: "Drain and supply lines under the slab." },
  { label: "Rough-in", description: "Lines through the walls before drywall." },
  { label: "Top-out", description: "Vents and stub-outs, ready for inspection." },
  { label: "Trim", description: "Fixtures set, tested and handed over." },
];

// Pieces ---------------------------------------------------------------------

function Block({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0 border-t border-rule pt-6", className)}>
      <h3 className="label-tech mb-5 text-muted">{title}</h3>
      {children}
    </div>
  );
}

function ButtonsSpecimen() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button href={BUSINESS.phoneHref} icon={<Phone className="size-5" />}>
          Call {BUSINESS.phone}
        </Button>
        <Button href="/booking" variant="secondary" icon={<Calendar className="size-5" />}>
          Book a Service
        </Button>
        <Button href="/services" variant="ghost">
          All services
        </Button>
        <Button variant="emergency">Emergency</Button>
        <Button variant="brass">Brass</Button>
        <Button variant="inverse">Inverse</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small 44</Button>
        <Button size="md">Medium 48</Button>
        <Button size="lg">Large 56</Button>
        <Button size="sm" variant="secondary">
          Small secondary
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled>Disabled</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button href="/booking" disabled>
          Disabled link
        </Button>
        <Button loading icon={<Send className="size-5" />}>
          Sending
        </Button>
        <Button variant="secondary" loading>
          Loading
        </Button>
        <Button href="https://www.myfloridalicense.com/" target="_blank" variant="ghost" iconRight={<ArrowUpRight className="size-5" />}>
          External link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="gold">Legacy gold</Button>
        <Button variant="outline-light">Legacy outline-light</Button>
        <Button fullWidth variant="secondary" className="sm:w-auto">
          Full width on phones
        </Button>
      </div>
    </div>
  );
}

function ToneBlock({ tone }: { tone: Tone }) {
  return (
    <Section tone={tone} spacing="sm" id={`tone-${tone}`} labelledBy={`tone-${tone}-title`}>
      <Container className="space-y-12">
        <div>
          <Eyebrow>Tone</Eyebrow>
          <h2 id={`tone-${tone}-title`} className="mt-3 text-display-md">
            data-tone=&quot;{tone}&quot;
          </h2>
          <p className="mt-3 max-w-[68ch]">
            Body text sits in <span className="text-fg">text-body</span>; secondary lines in{" "}
            <span className="text-muted">text-muted</span>; labels in <span className="text-accent">text-accent</span>;
            and <a className="text-link underline underline-offset-4" href="#palette">text links</a> in text-link.
          </p>
        </div>

        <Block title="Button: variants, sizes, states">
          <ButtonsSpecimen />
        </Block>

        <div className="grid gap-12 lg:grid-cols-2">
          <Block title="Breadcrumbs">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Repiping" }]} />
          </Block>
          <Block title="Eyebrow">
            <div className="space-y-3">
              <Eyebrow>Precision in every connection.</Eyebrow>
              <Eyebrow joint={false}>Without the joint</Eyebrow>
            </div>
          </Block>
        </div>

        <Block title="SectionHeading: left and centre">
          <SectionHeading
            align="left"
            overline="New construction"
            title="Plumbing for the homes"
            accent="Southwest Florida builds"
            subtitle="A chapter header: eyebrow, display heading, an optional lead of one or two lines."
            className="mb-10"
          />
          <SectionHeading overline="Reviews" title="What homeowners say" subtitle="Centred only for short symmetrical sections." className="mb-0" />
        </Block>

        <div className="grid gap-12 lg:grid-cols-2">
          <Block title="Stepper: horizontal (current = Top-out)">
            <Stepper label={`Construction phases (${tone})`} current={2} items={PHASES.map((p, i) => ({ ...p, href: i < 2 ? `#phase-${i}` : undefined }))} />
          </Block>
          <Block title="WizardProgress">
            <WizardProgress steps={["Service", "Details", "Time", "Review"]} current={1} label={`Booking progress (${tone})`} />
          </Block>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <Block title="Stepper: vertical timeline">
            <Stepper
              orientation="vertical"
              label={`History (${tone})`}
              current={2}
              items={[
                { meta: String(BUSINESS.founded), label: "The family starts the shop", description: "Founded in Lee County." },
                { meta: "2010", label: "New construction grows", description: "Builders across three counties." },
                { meta: "2023", label: "Part of Draft Construction", description: "Same family, same crews." },
                { meta: "Next", label: "The next generation" },
              ]}
            />
          </Block>
          <Block title="FaqAccordion">
            <FaqAccordion faqs={SAMPLE_FAQS} name={`specimen-${tone}`} />
          </Block>
        </div>

        <Block title="LinkGrid">
          <LinkGrid
            links={[
              { href: "/areas/cape-coral", label: "Cape Coral", meta: "Lee County" },
              { href: "/areas/fort-myers", label: "Fort Myers", meta: "Lee County" },
              { href: "/areas/naples", label: "Naples", meta: "Collier County" },
              { href: "/areas/estero", label: "Estero", meta: "Lee County" },
              { href: "/areas/punta-gorda", label: "Punta Gorda", meta: "Charlotte County" },
              { href: "/areas/sanibel", label: "Sanibel" },
            ]}
          />
        </Block>

        <Block title="Dialog: variants (open, then Esc / close / backdrop)">
          <DialogDemo />
        </Block>
      </Container>
    </Section>
  );
}

// Page -------------------------------------------------------------------------

export default async function SpecimenPage({ searchParams }: { searchParams: Promise<{ tone?: string }> }) {
  if (!specimenEnabled()) notFound();
  const { tone: toneParam } = await searchParams;
  const only = TONES.find((t) => t === toneParam);
  const tones = only ? [only] : TONES;

  const gallery = collection("gallery");
  const hero = slot("home.hero");
  const aspects: FrameAspect[] = ["4/5", "3/2", "4/3", "1/1", "16/9", "5/4", "natural"];

  return (
    <>
      {/* The site header is still the old fixed bar: clear it. */}
      <Section tone="ink" spacing="sm" className="pt-[calc(var(--nav-h)+6rem)]">
        <Container>
          <Eyebrow>Development only</Eyebrow>
          <h1 className="mt-4 text-display-lg">Specimen</h1>
          <p className="mt-4 max-w-[56ch] text-lead">Every primitive in every state, on every tone.</p>
          <nav aria-label="Tone" className="mt-8 flex flex-wrap gap-2">
            {[{ href: "/dev/specimen", label: "All tones", active: !only }, ...TONES.map((t) => ({ href: `/dev/specimen?tone=${t}`, label: t, active: only === t }))].map(
              (l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={l.active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-chip border px-4 text-sm font-medium",
                    l.active ? "border-white bg-white text-ink" : "border-rule text-fg hover:border-white",
                  )}
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>
        </Container>
      </Section>

      <Section tone="white" spacing="sm" id="palette" labelledBy="palette-title">
        <Container>
          <SectionHeading align="left" overline="Tokens" title="Palette and contrast" id="palette-title" subtitle="Ratios against white, shell and ink; struck through below 4.5:1 (fine for fills and hairlines, never for text)." />
          <ul className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {PALETTE.map((c) => (
              <li key={c.name}>
                <span className="block h-16 rounded-control border border-rule" style={{ backgroundColor: c.hex }} />
                <span className="mt-2 block text-sm font-semibold text-fg">{c.name}</span>
                <span className="block text-sm text-muted tabular-nums">{c.hex}</span>
                <span className="mt-1 flex flex-wrap gap-x-2 text-xs text-muted">
                  <Ratio fg={c.hex} bg="#FFFFFF" label="W" />
                  <Ratio fg={c.hex} bg="#F5F2EC" label="S" />
                  <Ratio fg={c.hex} bg="#0A1730" label="I" />
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="shell" spacing="sm" labelledBy="type-title">
        <Container>
          <SectionHeading align="left" overline="Tokens" title="Type scale" id="type-title" />
          <dl className="divide-y divide-rule border-y border-rule">
            {[
              { k: "display-xl", el: <p className="font-display text-display-xl font-bold text-fg [font-stretch:108%]">Precision in every connection.</p> },
              { k: "display-lg · wide (shortest H1)", el: <p className="display-wide text-display-lg font-bold text-fg">{SHORTEST_H1}</p> },
              { k: "display-lg · normal (longest H1)", el: <p className="display-normal text-display-lg font-bold text-fg">{LONGEST_H1}</p> },
              { k: "display-lg · tight (longest H1, phones)", el: <p className="display-tight text-display-lg font-bold text-fg">{LONGEST_H1}</p> },
              { k: "display-md (section H2)", el: <p className="font-display text-display-md font-bold text-fg [font-stretch:108%]">What your office will ask about</p> },
              { k: "display-sm", el: <p className="font-display text-display-sm font-bold text-fg [font-stretch:108%]">Three generations of one family</p> },
              { k: "lead", el: <p className="max-w-[56ch] text-lead">{BUSINESS.description}</p> },
              { k: "body 17/18", el: <p className="max-w-[68ch]">{BUSINESS.description} Paragraphs stop at 68 characters so a line is easy to follow back.</p> },
              { k: "sm 15", el: <p className="text-sm text-muted">Secondary UI text, never below 14 px for reading.</p> },
              { k: "label-tech", el: <p className="label-tech text-accent">Phase 03 · Top-out · 26.6° N</p> },
            ].map((row) => (
              <div key={row.k} className="grid gap-3 py-6 lg:grid-cols-[14rem_1fr] lg:gap-8">
                <dt className="label-tech pt-2 text-muted">{row.k}</dt>
                <dd className="min-w-0">{row.el}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {tones.map((t) => (
        <ToneBlock key={t} tone={t} />
      ))}

      <Section tone="white" divider labelledBy="frames-title">
        <Container>
          <SectionHeading align="left" overline="Photography" title="Frame at every aspect" id="frames-title" subtitle="Real photos from the gallery folder; dominant colour underneath; caption below, never on the photo." />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {aspects.map((aspect, i) => (
              <Frame
                key={aspect}
                media={gallery[i]}
                aspect={aspect}
                sizes="(min-width: 1024px) 22vw, 45vw"
                caption={`${aspect}${gallery[i]?.caption ? ` · ${gallery[i]?.caption}` : ""}`}
              />
            ))}
          </div>
          {hero && (
            <div className="mt-16 grid gap-6 lg:grid-cols-12">
              <Frame
                media={hero.desktop}
                aspect="16/9"
                sizes="(min-width: 1024px) 58vw, 100vw"
                caption="Slot home.hero, desktop picture, 16/9"
                className="lg:col-span-7"
              />
              {hero.mobile && (
                <Frame
                  media={hero.mobile}
                  aspect="4/5"
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  caption="Slot home.hero, phone crop, 4/5"
                  className="lg:col-span-4 lg:col-start-9"
                />
              )}
            </div>
          )}
          <h3 className="label-tech mt-16 mb-6 text-muted">FrameLink tiles</h3>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {gallery.slice(7, 11).map((m, i) => (
              <li key={m.path}>
                <FrameLink
                  href="/gallery"
                  media={m}
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  label={`Project 0${i + 1}`}
                  title={m.caption || m.alt}
                  description="One line under the title."
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="shell" labelledBy="reveal-title">
        <Container>
          <SectionHeading align="left" overline="Motion" title="Reveal" id="reveal-title" subtitle="Below the fold: 16 px rise and fade, 450 ms, six items staggered. Visible without JavaScript and with reduced motion." />
          <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {PHASES.concat(PHASES.slice(0, 2)).map((p, i) => (
              <Reveal as="li" key={i} index={i} className="border-t border-rule py-5">
                <span className="label-tech text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-2 block font-semibold text-fg">{p.label}</span>
                <span className="mt-1 block text-sm text-muted">{p.description}</span>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="ink" spacing="sm" labelledBy="logo-ink-title">
        <Container>
          <h2 id="logo-ink-title" className="label-tech mb-8 text-muted">
            LogoLockup on ink
          </h2>
          <div className="flex flex-wrap items-end gap-x-12 gap-y-8">
            <LogoLockup size="sm" />
            <LogoLockup size="md" />
            <LogoLockup size="lg" />
            <LogoLockup size="lg" wordmark={false} href={null} />
          </div>
        </Container>
      </Section>
      <Section tone="white" spacing="sm" labelledBy="logo-white-title">
        <Container>
          <h2 id="logo-white-title" className="label-tech mb-8 text-muted">
            LogoLockup on white
          </h2>
          <div className="flex flex-wrap items-end gap-x-12 gap-y-8">
            <LogoLockup size="sm" />
            <LogoLockup size="md" />
            <LogoLockup size="lg" />
            <LogoLockup size="md" wordmark={false} href={null} />
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Contact"
        title="Ready when you are."
        body="The closing band: eyebrow, heading, one line, Call and a second action, and the hours."
        headingId="cta-title"
      />
    </>
  );
}
