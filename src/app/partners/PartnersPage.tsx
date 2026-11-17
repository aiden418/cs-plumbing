import Link from "next/link";
import Button from "@/components/ui/Button";
import { Phone } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { PARTNERS } from "@/lib/constants";
import { image } from "@/lib/media";
import { PARTNERS_PAGE } from "@/content/about";
import PartnerDirectory, { type DirectoryPartner } from "./PartnerDirectory";

const textLink = "text-link underline underline-offset-4 decoration-1 hover:decoration-2";

export default function PartnersPage() {
  const partners: DirectoryPartner[] = PARTNERS.map((partner) => ({
    id: partner.id,
    name: partner.name,
    category: partner.category,
    description: partner.description,
    phone: partner.phone,
    // The partner's own number, never the company line.
    phoneHref: `tel:${partner.phone.replace(/[^0-9]/g, "")}`,
    website: partner.website,
    logo: partner.image ? image(partner.image) : null,
  }));
  const categories = Array.from(new Set(PARTNERS.map((p) => p.category)));

  return (
    <>
      <PageHero
        layout="plain"
        overline={PARTNERS_PAGE.overline}
        title={PARTNERS_PAGE.title}
        accent={PARTNERS_PAGE.accent}
        description={PARTNERS_PAGE.description}
        media={
          <p className="max-w-[60ch] text-body lg:mt-6">
            As a{" "}
            <Link href="/about" className={textLink}>
              family-owned plumbing company
            </Link>{" "}
            serving Cape Coral and Southwest Florida since 1998, we know the value of working with
            contractors who share our commitment to quality and customer service. Whether you need a{" "}
            <Link href="/services/residential" className={textLink}>
              residential plumbing
            </Link>{" "}
            partner, HVAC service, roofing, or concrete work, these are the companies we personally
            recommend to our customers.
          </p>
        }
        actions={
          <Button href={BUSINESS.phoneHref} variant="primary" size="lg" icon={<Phone className="size-5" />}>
            {PARTNERS_PAGE.callLabel} {BUSINESS.phone}
          </Button>
        }
      />

      <Section tone="shell" spacing="sm" labelledBy="partners-list-title">
        <Container>
          {/* The hero <h1> carries this visually; the list still needs a
              section heading so the outline doesn't jump h1 -> h3. */}
          <h2 id="partners-list-title" className="sr-only">
            {PARTNERS_PAGE.listHeading}
          </h2>

          <PartnerDirectory
            partners={partners}
            categories={categories}
            labels={{
              all: PARTNERS_PAGE.allLabel,
              filter: PARTNERS_PAGE.filterLabel,
              website: PARTNERS_PAGE.websiteLabel,
              empty: PARTNERS_PAGE.emptyLabel,
            }}
          />

          <p className="mt-10 max-w-[68ch] text-body">
            Looking for a plumber instead? C&amp;S Plumbing of Lee County offers{" "}
            <Link href="/services" className={textLink}>
              full-service plumbing
            </Link>
            {" "}including{" "}
            <Link href="/services/repiping" className={textLink}>
              repiping
            </Link>
            ,{" "}
            <Link href="/services/water-heaters" className={textLink}>
              water heaters
            </Link>
            ,{" "}
            <Link href="/services/drain-cleaning" className={textLink}>
              drain cleaning
            </Link>
            , and{" "}
            <Link href="/emergency" className={textLink}>
              24/7 emergency service
            </Link>
            {" "}across Cape Coral, Fort Myers, and all of Southwest Florida.
          </p>
        </Container>
      </Section>
    </>
  );
}
