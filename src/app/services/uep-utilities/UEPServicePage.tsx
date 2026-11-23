import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JobGallery from "@/components/services/JobGallery";
import {
  Chapter,
  HeroActions,
  OfferList,
  PointList,
  PriceLine,
  splitLead,
} from "@/components/services/ServiceLandingTemplate";
import { UepPrivateSide } from "@/components/services/UepSections";
import { picture } from "@/lib/media";
import { SERVICE_PAGE, UEP_PAGE } from "@/content/services";
import type { ServiceLanding } from "@/lib/types";

// ============================================
// UEP PROJECT IMAGES
// Add more images here as they come in. Each one is looked up on the server
// (image() in @/lib/media): a missing or hidden photo simply drops out.
// ============================================
const UEP_IMAGES = [
  {
    src: "/images/services/uep-utilities/photo-1.jpg",
    alt: "Irrigation and water service line trenching along house foundation — purple irrigation pipe and white water line",
  },
  {
    src: "/images/services/uep-utilities/photo-2.jpg",
    alt: "Water meter box and irrigation valve box installed with caution tape — freshly completed UEP hookup",
  },
  {
    src: "/images/services/uep-utilities/IMG_0646.jpeg",
    alt: "C&S Plumbing truck on site with sewer line excavation and pipe staging for UEP connection",
  },
  {
    src: "/images/services/uep-utilities/IMG_0647.jpeg",
    alt: "Sewer line trench with new green sewer pipe and orange locate line for UEP utility hookup",
  },
  {
    src: "/images/services/uep-utilities/IMG_0648.jpeg",
    alt: "Excavation along residential property for sewer line installation — crew member in trench",
  },
  {
    src: "/images/services/uep-utilities/IMG_0652.jpeg",
    alt: "Deep trench excavation with green sewer pipe connection at residential property — mini excavator on site",
  },
  {
    src: "/images/services/uep-utilities/IMG_3A81939715B2-1.jpeg",
    alt: "Septic abandonment trench excavation in front yard with caution tape and safety barriers",
  },
  {
    src: "/images/services/uep-utilities/IMG_79D5F2B66CB3-1.jpeg",
    alt: "Mini excavator removing old septic tank drain field during septic abandonment — exposed leach field pipes",
  },
  {
    src: "/images/services/uep-utilities/IMG_E37F0520EF19-1.jpeg",
    alt: "New sewer line cleanout and connection point installed in excavated trench — green PVC pipe with cleanout cap",
  },
  {
    src: "/images/services/uep-utilities/JPEG image-4165-B510-28-0.jpeg",
    alt: "New green PVC sewer line with fittings and cleanout installed in trench — close-up of pipe connections",
  },
  {
    src: "/images/services/uep-utilities/JPEG image-4E9F-81C1-6A-0.jpeg",
    alt: "Sewer line running through deep trench from house to street — new PVC pipe with fittings ready for backfill",
  },
];

/** The UEP Utilities page: a server component; the photos open in the shared lightbox. */
export default function UEPServicePage({
  landing,
}: {
  landing: ServiceLanding;
}) {
  const frame = picture("service.header.uep-utilities");
  const { lead, rest } = splitLead(landing.description);
  return (
    <>
      {/* Hero */}
      <PageHero
        layout="photo"
        frame={frame}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: landing.title, href: `/services/${landing.slug}` },
        ]}
        overline={landing.title}
        title={landing.heroText}
        description={lead}
        actions={<HeroActions second={{ label: UEP_PAGE.estimateLabel, href: UEP_PAGE.estimateHref }} />}
      >
        {landing.priceRange && <PriceLine label={SERVICE_PAGE.typicalPriceRange} range={landing.priceRange} />}
      </PageHero>

      {/* Features */}
      <Section tone="white" spacing="sm" labelledBy="offer-heading">
        <Container>
          {rest && <p className="mb-10 max-w-[60ch] text-lead text-body sm:mb-12">{rest}</p>}
          <Chapter id="offer-heading" title={SERVICE_PAGE.offer} stacked>
            <OfferList items={landing.features} columns={2} />
          </Chapter>
        </Container>
      </Section>

      {/* The owner's side: scope, permits, restoration; the dates are on the Cape Coral page */}
      <UepPrivateSide tone="shell" />

      {/* Gallery */}
      <JobGallery id="uep-work" photos={UEP_IMAGES} title={UEP_PAGE.galleryTitle} fallback={false} tone="white" />

      {/* Highlights */}
      <Section tone="shell" spacing="sm" labelledBy="why-heading">
        <Container>
          <Chapter id="why-heading" title={`${SERVICE_PAGE.whyBefore}${landing.title}`} stacked>
            <PointList items={landing.highlights} columns={3} />
          </Chapter>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="white" spacing="sm" labelledBy="faq-heading">
        <Container>
          <Chapter id="faq-heading" title={SERVICE_PAGE.faq}>
            <FaqAccordion faqs={landing.faqs} />
          </Chapter>
        </Container>
      </Section>
    </>
  );
}
