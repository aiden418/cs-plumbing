import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { ABOUT_TRAINING } from "@/content/about";

/** Training the next generation: a short reading chapter. */
export default function TrainingTrade() {
  return (
    <Section tone="white" spacing="sm" labelledBy="about-training-title">
      <Container>
        <Reveal className="grid grid-cols-1 gap-y-5 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-4">{ABOUT_TRAINING.overline}</Eyebrow>
            <h2 id="about-training-title" className="text-display-sm text-fg">
              {ABOUT_TRAINING.title}
            </h2>
          </div>
          <p className="max-w-[60ch] text-lead text-body lg:col-span-7 lg:col-start-6 lg:pt-9">{ABOUT_TRAINING.body}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
