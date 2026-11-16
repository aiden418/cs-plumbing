import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  Checkbox,
  Field,
  FormPanel,
  FormStatus,
  Input,
  OptionCard,
  OptionGroup,
  Select,
  SubmitRow,
  Textarea,
} from "@/components/forms";
import { BUSINESS } from "@/lib/business";
import { from } from "@/lib/pricing";
import { SampleForm, UploadDemo } from "./SpecimenDemos";

/**
 * Forms kit specimen: every component in every state on white and shell, a
 * complete sample form, a wizard step and the file upload. A development and
 * review page only: it 404s in a production build unless the review switch
 * (NEXT_PUBLIC_ANALYTICS=off) is on, and it is never indexed.
 */

const VISIBLE = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ANALYTICS === "off";

export const metadata: Metadata = {
  title: "Forms kit specimen",
  robots: { index: false, follow: false },
};

type Tone = "white" | "shell";

/* Hover and focus cannot be held still on a static page, so the specimen
   applies the same classes the real :hover / :focus rules apply. */
const HOVER = "border-steel-500";
const FOCUS = "border-primary outline-3 outline-offset-0 outline-primary/20";
const CARD_HOVER = "border-steel-500";
const CARD_FOCUS = "outline-2 outline-offset-2 outline-focus";

const SERVICE_OPTIONS = [
  { value: "leak", label: "Leak or burst pipe" },
  { value: "water-heater", label: "Water heater" },
  { value: "drain", label: "Clogged drain" },
  { value: "repipe", label: "Repipe" },
  { value: "other", label: "Something else" },
];

function Cell({ state, children }: { state: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="meta text-accent">{state}</p>
      {children}
    </div>
  );
}

function Row({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 border-t border-rule py-8 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <h3 className="text-lg">{title}</h3>
        {note ? <p className="mt-1 text-sm text-muted">{note}</p> : null}
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">{children}</div>
    </div>
  );
}

function StateMatrix({ tone }: { tone: Tone }) {
  const p = (id: string) => `${tone}-${id}`;
  return (
    <>
      <Row title="Input" note="48 px, 16 px text, 1 px steel-300 border.">
        <Cell state="Default">
          <Field id={p("in-default")} label="Your name" required>
            <Input preset="name" />
          </Field>
        </Cell>
        <Cell state="Hover">
          <Field id={p("in-hover")} label="Your name" required>
            <Input preset="name" className={HOVER} />
          </Field>
        </Cell>
        <Cell state="Focus">
          <Field id={p("in-focus")} label="Your name" required>
            <Input preset="name" className={FOCUS} />
          </Field>
        </Cell>
        <Cell state="Filled">
          <Field id={p("in-filled")} label="Phone" hint="Any format is fine." required>
            <Input preset="tel" defaultValue="(239) 555-0134" />
          </Field>
        </Cell>
        <Cell state="Invalid">
          <Field id={p("in-invalid")} label="Email" error="Enter an email address like name@example.com." optional>
            <Input preset="email" defaultValue="jane@" />
          </Field>
        </Cell>
        <Cell state="Disabled">
          <Field id={p("in-disabled")} label="ZIP code">
            <Input preset="postal-code" defaultValue="33903" disabled />
          </Field>
        </Cell>
      </Row>

      <Row title="Select" note="The native picker with a chevron.">
        <Cell state="Default">
          <Field id={p("se-default")} label="What do you need?" required>
            <Select placeholder="Choose one">
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </Cell>
        <Cell state="Focus">
          <Field id={p("se-focus")} label="What do you need?" required>
            <Select placeholder="Choose one" className={FOCUS}>
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </Cell>
        <Cell state="Filled">
          <Field id={p("se-filled")} label="What do you need?" required>
            <Select defaultValue="water-heater">
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </Cell>
        <Cell state="Invalid">
          <Field id={p("se-invalid")} label="What do you need?" error="Choose a service." required>
            <Select placeholder="Choose one">
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </Cell>
        <Cell state="Disabled">
          <Field id={p("se-disabled")} label="What do you need?">
            <Select defaultValue="drain" disabled>
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </Cell>
      </Row>

      <Row title="Textarea" note="At least 7rem tall; resizes vertically.">
        <Cell state="Default">
          <Field id={p("ta-default")} label="Tell us what is going on" optional>
            <Textarea />
          </Field>
        </Cell>
        <Cell state="Focus">
          <Field id={p("ta-focus")} label="Tell us what is going on" optional>
            <Textarea className={FOCUS} />
          </Field>
        </Cell>
        <Cell state="Invalid">
          <Field id={p("ta-invalid")} label="Tell us what is going on" error="Add a few words about the problem." required>
            <Textarea defaultValue="" />
          </Field>
        </Cell>
      </Row>

      <Row title="Checkbox" note="24 px box in a 44 px row; checked shows a tick.">
        <Cell state="Default">
          <Checkbox id={p("cb-default")} label="Text me updates about this request" />
        </Cell>
        <Cell state="Checked">
          <Checkbox id={p("cb-checked")} label="Text me updates about this request" defaultChecked />
        </Cell>
        <Cell state="Focus">
          <Checkbox id={p("cb-focus")} label="Text me updates" className="border-primary outline-2 outline-offset-2 outline-focus" />
        </Cell>
        <Cell state="Invalid">
          <Checkbox id={p("cb-invalid")} label="I agree to the terms" error="Tick the box to continue." />
        </Cell>
        <Cell state="Disabled">
          <Checkbox id={p("cb-disabled")} label="Text me updates" disabled />
        </Cell>
        <Cell state="Disabled, checked">
          <Checkbox id={p("cb-disabled-on")} label="Text me updates" disabled defaultChecked hint="Hint under a checkbox label." />
        </Cell>
      </Row>

      <Row title="OptionCard" note="A real radio or checkbox drawn as a card. Selected: 2 px border, 5% fill, filled joint.">
        <Cell state="Default">
          <OptionCard id={p("oc-default")} name={p("oc-a")} title="Repair what I have" description="Fix the leak, valve or part that failed." />
        </Cell>
        <Cell state="Hover">
          <OptionCard id={p("oc-hover")} name={p("oc-b")} title="Repair what I have" description="Fix the leak, valve or part that failed." className={CARD_HOVER} />
        </Cell>
        <Cell state="Focus">
          <OptionCard id={p("oc-focus")} name={p("oc-c")} title="Repair what I have" description="Fix the leak, valve or part that failed." className={CARD_FOCUS} />
        </Cell>
        <Cell state="Selected">
          <OptionCard id={p("oc-selected")} name={p("oc-d")} title="Replace it" description="A new tank water heater, installed." price={from("waterHeater.tank40")} defaultChecked />
        </Cell>
        <Cell state="Selected (checkbox)">
          <OptionCard id={p("oc-check")} type="checkbox" name={p("oc-e")} title="Haul away the old one" defaultChecked />
        </Cell>
        <Cell state="Disabled">
          <OptionCard id={p("oc-disabled")} name={p("oc-f")} title="Tankless conversion" description="Not offered for this address." disabled />
        </Cell>
      </Row>

      <Row title="FormStatus" note="Success is role=status, error is role=alert.">
        <Cell state="Success">
          <FormStatus status="success" title="Request received">
            We will call you back shortly. Your confirmation is on its way to your inbox.
          </FormStatus>
        </Cell>
        <Cell state="Error">
          <FormStatus
            status="error"
            title="We could not send that"
            actions={
              <a href={BUSINESS.phoneHref} className="inline-flex min-h-11 items-center text-base font-semibold text-link underline-offset-[0.2em] hover:underline">
                Call {BUSINESS.phone}
              </a>
            }
          >
            Please try again, or call us instead.
          </FormStatus>
        </Cell>
      </Row>

      <Row title="SubmitRow" note="Primary submit and a quiet text link.">
        <Cell state="Default">
          <form action="#" aria-label={`Submit row default (${tone})`}>
            <SubmitRow label="Send request" secondaryHref="#specimen-top" secondaryLabel="Back to the top" />
          </form>
        </Cell>
        <Cell state="Loading">
          <form action="#" aria-label={`Submit row loading (${tone})`}>
            <SubmitRow label="Send request" loading />
          </form>
        </Cell>
        <Cell state="Disabled">
          <form action="#" aria-label={`Submit row disabled (${tone})`}>
            <SubmitRow label="Send request" disabled />
          </form>
        </Cell>
      </Row>

      <Row title="FileUpload" note="Button + drop zone, file list with Remove buttons. The file input has no name.">
        <Cell state="With files">
          <UploadDemo id={p("fu-files")} />
        </Cell>
        <Cell state="Error">
          <UploadDemo id={p("fu-error")} withError />
        </Cell>
        <Cell state="Disabled">
          <UploadDemo id={p("fu-disabled")} disabled />
        </Cell>
      </Row>
    </>
  );
}

function WizardStep() {
  return (
    <form action="#" aria-label="Sample wizard step" className="flex flex-col gap-8">
      <p className="meta text-accent">Step 2 of 4</p>
      <OptionGroup
        id="wizard-urgency"
        legend="How soon do you need us?"
        legendStyle="step"
        hint="Arrow keys move between the choices."
        required
        columns={2}
      >
        <OptionCard id="wz-u-now" name="urgency" value="emergency" title="It is an emergency" description="Water is running or there is no water at all." />
        <OptionCard id="wz-u-soon" name="urgency" value="soon" title="In the next few days" description="It is a problem, but it can wait a little." defaultChecked />
        <OptionCard id="wz-u-flex" name="urgency" value="flexible" title="I am flexible" description="Planning ahead or getting an estimate." />
        <OptionCard id="wz-u-unsure" name="urgency" value="unsure" title="Not sure" />
      </OptionGroup>
      <OptionGroup id="wizard-extras" legend="Anything else on the visit?" optional columns={2}>
        <OptionCard id="wz-x-camera" type="checkbox" name="extras" value="camera" title="Sewer camera inspection" price={from("drain.camera")} />
        <OptionCard id="wz-x-prv" type="checkbox" name="extras" value="prv" title="Pressure regulator check" price={from("leak.prv")} />
      </OptionGroup>
      <OptionGroup id="wizard-invalid" legend="Which water heater do you have?" error="Choose one to continue." required columns={3}>
        <OptionCard id="wz-t-tank" name="heater" value="tank" title="Tank" />
        <OptionCard id="wz-t-tankless" name="heater" value="tankless" title="Tankless" />
        <OptionCard id="wz-t-unsure" name="heater" value="unsure" title="Not sure" />
      </OptionGroup>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="inline-flex min-h-12 items-center justify-center rounded-control border border-steel-300 bg-white px-6 text-base font-semibold text-ink hover:border-steel-700"
        >
          Back
        </button>
        <SubmitRow label="Continue" />
      </div>
    </form>
  );
}

export default function FormsSpecimenPage() {
  if (!VISIBLE) notFound();
  return (
    <>
      <section
        id="specimen-top"
        data-tone="white"
        className="border-b border-rule px-gutter pt-[calc(var(--nav-h)+clamp(2rem,5vw,4.5rem))] pb-section-sm"
      >
        <div className="mx-auto max-w-[80rem]">
          <p className="meta text-accent">Specimen</p>
          <h1 className="mt-3 text-display-lg">Forms kit</h1>
          <p className="mt-4 max-w-[56ch] text-lead">
            Every control in every state, on white and on shell, then a complete form, a wizard step and a form on ink.
            Hover and focus are drawn with the same classes the live states use.
          </p>
        </div>
      </section>

      {(["white", "shell"] as const).map((tone) => (
        <section key={tone} data-tone={tone} aria-labelledby={`states-${tone}`} className="px-gutter py-section-sm">
          <div className="mx-auto max-w-[80rem]">
            <h2 id={`states-${tone}`} className="text-display-md">
              States on {tone}
            </h2>
            <div className="mt-8">
              <StateMatrix tone={tone} />
            </div>
          </div>
        </section>
      ))}

      <section data-tone="white" aria-labelledby="sample-form" className="border-t border-rule px-gutter py-section-sm">
        <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="sample-form" className="text-display-md">
              A complete form
            </h2>
            <p className="mt-4 max-w-[48ch]">
              Real spacing: 24 px between fields, 6 px from label to control. Phone and ZIP tidy themselves when you leave
              the field; nothing is refused while you type.
            </p>
          </div>
          <div className="lg:col-span-8 xl:col-span-7">
            <SampleForm serviceOptions={SERVICE_OPTIONS} />
          </div>
        </div>
      </section>

      <section data-tone="shell" aria-labelledby="wizard-step" className="px-gutter py-section-sm">
        <div className="mx-auto max-w-[48rem]">
          <h2 id="wizard-step" className="mb-8 text-display-md">
            A wizard step
          </h2>
          <WizardStep />
        </div>
      </section>

      <section data-tone="ink" aria-labelledby="on-ink" className="px-gutter py-section-sm">
        <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="on-ink" className="text-display-md">
              On ink, in a white panel
            </h2>
            <p className="mt-4 max-w-[48ch]">Controls never turn dark: a form on ink or navy sits in a FormPanel.</p>
          </div>
          <FormPanel className="lg:col-span-7">
            <form action="#" aria-label="Form on ink" className="flex flex-col gap-6">
              <Field id="ink-name" label="Your name" required>
                <Input preset="name" />
              </Field>
              <Field id="ink-phone" label="Phone" required error="Enter a phone number so we can call you back.">
                <Input preset="tel" />
              </Field>
              <SubmitRow label="Request a call" secondaryHref={BUSINESS.phoneHref} secondaryLabel={`Or call ${BUSINESS.phone}`} />
            </form>
          </FormPanel>
        </div>
      </section>
    </>
  );
}
