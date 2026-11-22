import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import {
  Chapter,
  HeroActions,
  OfferList,
  PointList,
  RequestPanel,
  splitLead,
  toneSequence,
  type Crumb,
} from "@/components/services/ServiceLandingTemplate";
import { SERVICE_PAGE as COPY } from "@/content/services";
import type { MediaRef } from "@/lib/media-types";
import type { Service } from "@/lib/types";

/**
 * A page that leads with repairs (residential): the hero's blue button is the
 * request, the call sits beside it, and the first section lists the common
 * jobs next to the same request form the water heater and repiping pages use.
 */
export interface RepairRequest {
  /** The hero button and the form's heading. */
  label: string;
  /** The form's preselected "Service needed" option (SERVICE_REQUEST_OPTIONS). */
  service: string;
  listTitle: string;
  listDescription?: string;
  jobs: readonly { title: string; description: string }[];
}

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
  /** Repairs first: see RepairRequest. Left out, the call leads and booking follows. */
  request?: RepairRequest;
}

/**
 * The hand-written service pages (residential, commercial): the photo hero,
 * the services as plain rows (two columns from md) with their feature lists,
 * and "why choose" as short checked lines.
 */
export default function ServiceDetail({
  title,
  description,
  services,
  highlights,
  heroText,
  frame,
  breadcrumb,
  request,
}: ServiceDetailProps) {
  const { lead, rest } = splitLead(description);
  // White and shell alternate down the page, whether or not the repairs section opens it.
  const [offerTone, whyTone] = toneSequence(["auto", "auto"], request ? "white" : "shell");
  const restOfLead = rest && <p className="mb-10 max-w-[60ch] text-lead text-body sm:mb-12">{rest}</p>;
  return (
    <>
      <PageHero
        layout="photo"
        frame={frame}
        breadcrumb={breadcrumb}
        overline={title}
        title={heroText}
        description={lead}
        actions={
          request ? (
            <HeroActions lead="second" second={{ label: request.label, href: "#request-service" }} />
          ) : (
            <HeroActions second={{ label: COPY.book, href: "/booking" }} />
          )
        }
      />

      {request && (
        <Section tone="white" spacing="sm" labelledBy="repairs-heading">
          <Container>
            {restOfLead}
            {/* The jobs first on phones, the form right under them; side by side from lg. */}
            <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
              <div className="min-w-0 lg:col-span-7 lg:row-start-1 xl:col-span-8 xl:pr-6">
                <Chapter id="repairs-heading" title={request.listTitle} description={request.listDescription} wide={false}>
                  <OfferList items={[...request.jobs]} />
                </Chapter>
              </div>
              <RequestPanel
                title={request.label}
                intro={COPY.requestForm.intro}
                service={request.service}
                className="lg:col-span-5 lg:col-start-8 lg:row-start-1 xl:col-span-4 xl:col-start-9"
              />
            </div>
          </Container>
        </Section>
      )}

      <Section tone={offerTone.tone} spacing="sm" labelledBy="offer-heading">
        <Container>
          {!request && restOfLead}
          <Chapter id="offer-heading" title={COPY.offer} stacked>
            <OfferList items={services} columns={2} />
          </Chapter>
        </Container>
      </Section>

      {highlights && (
        <Section tone={whyTone.tone} spacing="sm" labelledBy="why-heading">
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
