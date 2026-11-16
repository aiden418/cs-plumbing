import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import {
  Chapter,
  HeroActions,
  OfferList,
  PointList,
  type Crumb,
} from "@/components/services/ServiceLandingTemplate";
import { SERVICE_PAGE as COPY } from "@/content/services";
import type { MediaRef } from "@/lib/media-types";
import type { Service } from "@/lib/types";

interface ServiceDetailProps {
  title: string;
  description: string;
  services: Service[];
  highlights?: string[];
  heroText: string;
  /** The header photograph, resolved by the server page (picture("service.header.<slug>")). */
  frame: MediaRef | null;
  /** The visible trail (the JSON-LD stays in the page). */
  breadcrumb: Crumb[];
}

/**
 * The hand-written service pages (residential, commercial): hero, the
 * services as numbered rows with their feature lists, and "why choose" as
 * short joint-led lines.
 */
export default function ServiceDetail({
  title,
  description,
  services,
  highlights,
  heroText,
  frame,
  breadcrumb,
}: ServiceDetailProps) {
  return (
    <>
      <PageHero
        layout={frame ? "split" : "type-led"}
        frame={frame}
        breadcrumb={breadcrumb}
        overline={title}
        title={heroText}
        description={description}
        actions={<HeroActions second={{ label: COPY.book, href: "/booking" }} />}
      />

      <Section tone="white" labelledBy="offer-heading">
        <Container>
          <Chapter id="offer-heading" title={COPY.offer} stacked>
            <OfferList items={services} columns={2} />
          </Chapter>
        </Container>
      </Section>

      {highlights && (
        <Section tone="shell" labelledBy="why-heading">
          <Container>
            <Chapter id="why-heading" title={`${COPY.whyBefore}${title}`} stacked>
              <PointList items={highlights} columns={3} />
            </Chapter>
          </Container>
        </Section>
      )}
    </>
  );
}
