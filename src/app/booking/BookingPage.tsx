"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { CLAIMS } from "@/lib/claims";
import { perYear } from "@/lib/pricing";
import FileUpload from "@/components/builder-portal/FileUpload";
import { PHOTO_UPLOAD, photoTotalError } from "@/lib/photo-upload";
import { compressAll } from "@/lib/compress-image";
import { ChevronLeft, ChevronRight, CircleCheck, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import WizardProgress from "@/components/ui/WizardProgress";
import {
  Field,
  FormStatus,
  FormattedInput,
  Honeypot,
  OptionCard,
  OptionGroup,
  Textarea,
} from "@/components/forms";
import { BUSINESS } from "@/lib/business";
import { cn } from "@/lib/utils";
import { trackEstimateRequest, trackPreferredTimeRequest } from "@/lib/pixel";
import { isTestVisit, newSubmissionKey, type AcceptedLead } from "@/lib/lead";
import { localIsoDate } from "@/lib/local-date";
import useLocationSearch from "@/hooks/useLocationSearch";
import { BOOKING } from "@/content/conversion";

const serviceCategories = [
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
  { id: "emergency", label: "Emergency" },
  { id: "new-construction", label: "New Construction / Remodel" },
  { id: "uep-utilities", label: "UEP Utilities" },
  { id: "coastal-comeback", label: "Coastal Comeback Plan" },
];

const COASTAL_TIER_LABELS: Record<string, string> = {
  comfort: `Coastal Comfort (${perYear("plan.comfort")})`,
  shield: `Coastal Shield (${perYear("plan.shield")})`,
  smart: "Coastal Smart (custom quote)",
  "coastal-comeback": "Coastal Comeback Plan",
};

const budgetRanges = [
  "Under $500", // claim-ok: budget option, not a price
  "$500 – $1,000", // claim-ok: budget option, not a price
  "$1,000 – $5,000", // claim-ok: budget option, not a price
  "$5,000 – $10,000", // claim-ok: budget option, not a price
  "$10,000+", // claim-ok: budget option, not a price
  "Not sure",
];

const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

const URGENCIES = ["normal", "soon", "emergency"];

interface FormData {
  requestType: "booking" | "estimate";
  service: string;
  description: string;
  urgency: string;
  budgetRange: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
}

type ErrorKey = keyof typeof BOOKING.errors;
type Errors = Partial<Record<ErrorKey, string>>;

/** The checks each step makes before moving on (the same rules as before, now explained inline). */
function stepErrors(kind: "service" | "details" | "schedule" | "info", form: FormData): Errors {
  const e: Errors = {};
  if (kind === "service" && form.service === "") e.service = BOOKING.errors.service;
  if (kind === "details" && form.description.length < 5) e.description = BOOKING.errors.description;
  if (kind === "schedule") {
    if (form.date === "") e.date = BOOKING.errors.date;
    if (form.time === "") e.time = BOOKING.errors.time;
  }
  if (kind === "info") {
    if (form.name.length < 2) e.name = BOOKING.errors.name;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = BOOKING.errors.email;
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = BOOKING.errors.phone;
    if (form.address.length < 5) e.address = BOOKING.errors.address;
  }
  return e;
}

/** Where focus goes for each error, in screen order. */
const ERROR_TARGET: Record<ErrorKey, string> = {
  service: "booking-service",
  description: "booking-description",
  date: "booking-date",
  time: "booking-time",
  name: "booking-name",
  email: "booking-email",
  phone: "booking-phone",
  address: "booking-address",
};

function StepHeading({ children, headingRef }: { children: ReactNode; headingRef: React.Ref<HTMLHeadingElement> }) {
  return (
    <h2 ref={headingRef} tabIndex={-1} className="text-display-sm text-fg focus:outline-none">
      {children}
    </h2>
  );
}

export default function BookingPage() {
  const [requestType, setRequestType] = useState<"booking" | "estimate">("booking");
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  // A second tap while the first request is on its way does nothing, and a
  // retry repeats the same key, so the office gets one request and one ID.
  const busy = useRef(false);
  const submissionKey = useRef<string | null>(null);
  const [form, setForm] = useState<FormData>({
    requestType: "booking",
    service: "",
    description: "",
    urgency: "normal",
    budgetRange: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
  });

  // Pre-fill from URL params: ?plan=... (Coastal), ?service=..., ?urgency=...
  // The page is prerendered without its query string, so that arrives right
  // after hydration (see useLocationSearch). It is applied once, the first
  // time it is known, so a later change to the address bar cannot overwrite
  // what the customer has picked since. Adjusted during render rather than
  // in an effect, as Navbar does.
  const search = useLocationSearch();
  const [prefilled, setPrefilled] = useState(false);
  if (search !== null && !prefilled) {
    setPrefilled(true);
    const params = new URLSearchParams(search);
    const plan = params.get("plan");
    const serviceParam = params.get("service");
    const urgencyParam = params.get("urgency");
    const validServices = serviceCategories.map((c) => c.id);
    const validUrgencies = ["normal", "soon", "emergency"];

    setForm((prev) => {
      let next = prev;
      if (plan) {
        const tierLabel = COASTAL_TIER_LABELS[plan] ?? COASTAL_TIER_LABELS["coastal-comeback"];
        next = {
          ...next,
          service: "coastal-comeback",
          description: next.description || `Interested in the ${tierLabel}. Please reach out to enroll me.`,
        };
      }
      if (serviceParam && validServices.includes(serviceParam)) {
        next = { ...next, service: serviceParam };
      }
      if (urgencyParam && validUrgencies.includes(urgencyParam)) {
        next = { ...next, urgency: urgencyParam, requestType: "booking" };
      }
      return next;
    });
    if (urgencyParam === "emergency") setRequestType("booking");
  }

  const isEstimate = requestType === "estimate";
  const steps = isEstimate ? BOOKING.steps.estimate : BOOKING.steps.booking;
  const totalSteps = steps.length;
  const kind = isEstimate ? "estimate" : "booking";

  // Optional photos; kept outside `form` because that object is JSON-serialised.
  const [photos, setPhotos] = useState<File[]>([]);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field in errors) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const focusHeading = () => requestAnimationFrame(() => headingRef.current?.focus());

  const goTo = (target: number) => {
    setErrors({});
    setSubmitError(null);
    setStep(target);
    focusHeading();
  };

  const switchRequestType = (type: "booking" | "estimate") => {
    setRequestType(type);
    setStep(0);
    setErrors({});
    setForm((prev) => ({ ...prev, requestType: type }));
  };

  const handleSubmit = async () => {
    if (busy.current) return;
    const sizeError = photoTotalError(photos);
    if (sizeError) {
      setSubmitError(sizeError);
      return;
    }
    busy.current = true;
    setSubmitting(true);
    try {
      const test = isTestVisit();
      const payload = {
        ...form,
        sourcePath: window.location.pathname,
        submissionKey: (submissionKey.current ??= newSubmissionKey()),
        ...(test ? { test: true } : {}),
      };
      // Photos ride along as multipart; without them the payload stays JSON.
      const res = photos.length > 0
        ? await fetch("/api/booking", {
            method: "POST",
            body: (() => {
              const body = new FormData();
              for (const [key, value] of Object.entries(payload)) body.append(key, String(value ?? ""));
              photos.forEach((file) => body.append(PHOTO_UPLOAD.field, file));
              return body;
            })(),
          })
        : await fetch("/api/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data: Partial<AcceptedLead> & {
        confirmationId?: string;
        error?: string;
        code?: string;
      } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok || !data.success) {
        throw Object.assign(new Error(data.error ?? "Submission failed"), { code: data.code });
      }
      if (data.confirmationId) setConfirmationId(data.confirmationId);
      // Counted only now, with the Lead ID of the request the office received.
      const track = form.requestType === "estimate" ? trackEstimateRequest : trackPreferredTimeRequest;
      void track({ email: form.email, eventId: data.eventId, leadType: data.leadType, test: data.test });
      // Only show the confirmation screen once the server has accepted the request.
      setStep(totalSteps);
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch (err) {
      // Attachment problems are explained by the server in customer-facing words.
      const attachmentIssue = (err as { code?: string }).code === "attachments" && err instanceof Error;
      setSubmitError(attachmentIssue ? err.message : BOOKING.submitError);
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  };

  // Determine which "real" step to render
  // For booking: step 0=service, 1=details, 2=schedule, 3=info, 4=confirm
  // For estimate: step 0=service, 1=details, 2=info, 3=confirm
  const isConfirmStep = step === totalSteps;
  const isInfoStep = step === totalSteps - 1;
  const isScheduleStep = !isEstimate && step === 2;
  const isDetailsStep = step === 1;
  const isServiceStep = step === 0;
  const stepKind = isServiceStep ? "service" : isDetailsStep ? "details" : isScheduleStep ? "schedule" : "info";

  const next = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || isConfirmStep) return;
    const found = stepErrors(stepKind, form);
    const keys = Object.keys(found) as ErrorKey[];
    if (keys.length > 0) {
      setErrors(found);
      const target = document.getElementById(ERROR_TARGET[keys[0]]);
      // A radio group takes focus on its checked or first option.
      const focusable =
        target?.matches("input, textarea, select")
          ? target
          : (target?.querySelector<HTMLElement>("input:checked") ?? target?.querySelector<HTMLElement>("input"));
      focusable?.focus();
      return;
    }
    if (step === totalSteps - 1) {
      setSubmitError(null);
      void handleSubmit();
    } else {
      goTo(Math.min(step + 1, totalSteps));
    }
  };
  const prev = () => goTo(Math.max(step - 1, 0));

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      // Local year, month and day, so the value names the day on the label.
      // The UTC date is already tomorrow from early evening in Florida.
      value: localIsoDate(d),
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    };
  });

  const hero = isEstimate ? BOOKING.hero.estimate : BOOKING.hero.booking;
  const serviceLabel = serviceCategories.find((c) => c.id === form.service)?.label;
  const dateLabel = dates.find((d) => d.value === form.date)?.label;
  type Row = { term: string; value: string };
  const rows: (Row | null)[] = [
    serviceLabel ? { term: steps[0], value: serviceLabel } : null,
    isEstimate
      ? form.budgetRange
        ? { term: BOOKING.budgetLegend, value: form.budgetRange }
        : null
      : { term: BOOKING.urgencyLegend, value: BOOKING.urgencyLabels[form.urgency] ?? form.urgency },
    !isEstimate && (dateLabel || form.time)
      ? { term: steps[2], value: [dateLabel, form.time].filter(Boolean).join(" · ") }
      : null,
  ];
  const summary = rows.filter((row): row is Row => row !== null);

  const compactCard = "p-3 sm:p-3.5";

  return (
    <>
      <PageHero
        layout="plain"
        size="sm"
        overline={hero.overline}
        title={hero.title}
        accent={hero.accent}
        description={hero.description}
      >
        {/* Sticky CTA bar is hidden on /booking, so keep a call path above the fold */}
        <p className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-body">{BOOKING.hero.preferToTalk}</span>
          <Button href={BUSINESS.phoneHref} variant="secondary" icon={<Phone aria-hidden="true" className="size-5" />}>
            Call {BUSINESS.phone}
          </Button>
        </p>
      </PageHero>

      <Section tone="shell" spacing="none" className="py-8 sm:py-12 lg:py-14">
        <Container>
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="min-w-0 lg:col-span-8">
              {/* Request type */}
              <fieldset className="m-0 min-w-0 border-0 p-0" disabled={isConfirmStep}>
                <legend className="sr-only">{BOOKING.requestTypeLegend}</legend>
                <div className="grid grid-cols-2 gap-1 rounded-control border border-rule bg-raised p-1 sm:inline-grid sm:min-w-[26rem]">
                  {(["booking", "estimate"] as const).map((type) => (
                    <label
                      key={type}
                      className={cn(
                        "relative flex min-h-12 cursor-pointer items-center justify-center rounded-[0.5rem] px-3 text-center text-base leading-tight font-semibold text-body",
                        "transition-colors duration-150 ease-enter hover:text-fg",
                        "has-checked:bg-primary has-checked:text-white",
                        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus",
                        "has-disabled:cursor-not-allowed has-disabled:opacity-60"
                      )}
                    >
                      <input
                        type="radio"
                        name="requestType"
                        value={type}
                        checked={requestType === type}
                        onChange={() => switchRequestType(type)}
                        className="sr-only"
                      />
                      {BOOKING.requestTypes[type]}
                    </label>
                  ))}
                </div>
              </fieldset>

              <form
                noValidate
                onSubmit={next}
                data-tone="white"
                className="mt-5 rounded-frame border border-rule bg-white p-5 text-body sm:p-8"
              >
                {!isConfirmStep && (
                  <WizardProgress
                    steps={[...steps]}
                    current={step}
                    label={hero.overline}
                    onStepClick={goTo}
                    className="mb-8 border-b border-rule pb-6"
                  />
                )}

                <div key={`${kind}-${step}`} className="min-h-[14rem]">
                  {/* Step: Select Service */}
                  {isServiceStep && (
                    <OptionGroup
                      id="booking-service"
                      legend={<StepHeading headingRef={headingRef}>{BOOKING.serviceHeading}</StepHeading>}
                      legendClassName="mb-0"
                      error={errors.service}
                      columns={2}
                    >
                      {serviceCategories.map((cat) => (
                        <OptionCard
                          key={cat.id}
                          id={`booking-service-${cat.id}`}
                          name="service"
                          value={cat.id}
                          checked={form.service === cat.id}
                          onChange={() => update("service", cat.id)}
                          aria-invalid={errors.service ? true : undefined}
                          title={cat.label}
                        />
                      ))}
                    </OptionGroup>
                  )}

                  {/* Step: Details */}
                  {isDetailsStep && (
                    <div className="space-y-7">
                      <StepHeading headingRef={headingRef}>
                        {isEstimate ? BOOKING.detailsHeading.estimate : BOOKING.detailsHeading.booking}
                      </StepHeading>
                      <Field id="booking-description" label={BOOKING.descriptionLabel} error={errors.description}>
                        <Textarea
                          name="description"
                          value={form.description}
                          onChange={(e) => update("description", e.target.value)}
                          placeholder={isEstimate ? BOOKING.descriptionPlaceholder.estimate : BOOKING.descriptionPlaceholder.booking}
                          rows={4}
                        />
                      </Field>
                      <FileUpload
                        id="booking-photos"
                        label={`${isEstimate ? BOOKING.photosLabel.estimate : BOOKING.photosLabel.booking} (optional, up to ${PHOTO_UPLOAD.maxFiles})`}
                        files={photos}
                        onChange={(nextFiles) => {
                          // Downscale phone photos as they are picked so the upload stays small.
                          void compressAll(nextFiles).then(setPhotos);
                        }}
                        maxFiles={PHOTO_UPLOAD.maxFiles}
                        maxSizeMb={PHOTO_UPLOAD.maxBytesEach / 1024 / 1024}
                        compact
                      />

                      {isEstimate ? (
                        /* Budget Range for Estimate */
                        <OptionGroup id="booking-budget" legend={BOOKING.budgetLegend} columns={3}>
                          {budgetRanges.map((range, i) => (
                            <OptionCard
                              key={range}
                              id={`booking-budget-${i}`}
                              name="budgetRange"
                              value={range}
                              checked={form.budgetRange === range}
                              onChange={() => update("budgetRange", range)}
                              title={range}
                              className={compactCard}
                            />
                          ))}
                        </OptionGroup>
                      ) : (
                        /* Urgency for Booking */
                        <OptionGroup id="booking-urgency" legend={BOOKING.urgencyLegend} columns={3}>
                          {URGENCIES.map((u) => (
                            <OptionCard
                              key={u}
                              id={`booking-urgency-${u}`}
                              name="urgency"
                              value={u}
                              checked={form.urgency === u}
                              onChange={() => update("urgency", u)}
                              title={<span className="capitalize">{BOOKING.urgencyLabels[u]}</span>}
                              className={cn(compactCard, u === "emergency" && "has-checked:border-emergency has-checked:shadow-[inset_0_0_0_1px_var(--color-emergency)] has-checked:bg-white")}
                            />
                          ))}
                        </OptionGroup>
                      )}
                    </div>
                  )}

                  {/* Step: Schedule (Booking only) */}
                  {isScheduleStep && (
                    <div className="space-y-7">
                      <StepHeading headingRef={headingRef}>{BOOKING.scheduleHeading}</StepHeading>
                      <p className="-mt-3 max-w-[56ch] text-body">{BOOKING.scheduleNote}</p>
                      <OptionGroup id="booking-date" legend={BOOKING.dateLegend} error={errors.date} columns={3}>
                        {dates.map((d) => (
                          <OptionCard
                            key={d.value}
                            id={`booking-date-${d.value}`}
                            name="date"
                            value={d.value}
                            checked={form.date === d.value}
                            onChange={() => update("date", d.value)}
                            aria-invalid={errors.date ? true : undefined}
                            title={d.label}
                            className={compactCard}
                          />
                        ))}
                      </OptionGroup>
                      <OptionGroup id="booking-time" legend={BOOKING.timeLegend} error={errors.time} columns={3}>
                        {timeSlots.map((t) => (
                          <OptionCard
                            key={t}
                            id={`booking-time-${t.replace(/\W/g, "")}`}
                            name="time"
                            value={t}
                            checked={form.time === t}
                            onChange={() => update("time", t)}
                            aria-invalid={errors.time ? true : undefined}
                            title={<span className="tabular-nums">{t}</span>}
                            className={compactCard}
                          />
                        ))}
                      </OptionGroup>
                    </div>
                  )}

                  {/* Step: Contact Info */}
                  {isInfoStep && !isConfirmStep && (
                    <div className="space-y-5">
                      <StepHeading headingRef={headingRef}>{BOOKING.infoHeading}</StepHeading>
                      <p className="text-body">{BOOKING.allRequired}</p>
                      <Field id="booking-name" label={BOOKING.nameLabel} required error={errors.name}>
                        <FormattedInput
                          preset="name"
                          name="name"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                        />
                      </Field>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6">
                        <Field id="booking-email" label={BOOKING.emailLabel} required error={errors.email}>
                          <FormattedInput
                            preset="email"
                            name="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                          />
                        </Field>
                        <Field id="booking-phone" label={BOOKING.phoneLabel} required error={errors.phone}>
                          <FormattedInput
                            preset="tel"
                            name="phone"
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                          />
                        </Field>
                      </div>
                      <Field id="booking-address" label={BOOKING.addressLabel} required error={errors.address}>
                        <FormattedInput
                          preset="street-address"
                          name="address"
                          enterKeyHint="send"
                          value={form.address}
                          onChange={(e) => update("address", e.target.value)}
                        />
                      </Field>
                      {/* Honeypot — hidden from real users */}
                      <Honeypot value={form.website} onChange={(e) => update("website", e.target.value)} />
                    </div>
                  )}

                  {/* Confirmation */}
                  {isConfirmStep && (
                    <div
                      ref={doneRef}
                      tabIndex={-1}
                      role="status"
                      aria-live="polite"
                      className="flex flex-col items-start gap-5 py-4 focus:outline-none"
                    >
                      <CircleCheck aria-hidden="true" strokeWidth={1.5} className="size-12 text-success-ink" />
                      <h2 className="text-display-sm text-fg">
                        {isEstimate ? BOOKING.confirmTitle.estimate : BOOKING.confirmTitle.booking}
                      </h2>
                      {confirmationId && (
                        <p className="rounded-chip border border-rule px-3.5 py-1.5 text-[0.9375rem] font-semibold text-fg tabular-nums">
                          {BOOKING.confirmationPrefix}
                          {confirmationId}
                        </p>
                      )}
                      <p className="max-w-[56ch] text-body">
                        {isEstimate ? BOOKING.confirmBody.estimate : BOOKING.confirmBody.booking}
                        {!isEstimate && <span className="font-semibold text-fg">{form.email}</span>}
                        {!isEstimate && "."}
                      </p>
                      <Button href={BUSINESS.phoneHref} variant="secondary" icon={<Phone className="size-5" />}>
                        Call {BUSINESS.phone}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                {!isConfirmStep && (
                  <>
                    {submitError && (
                      <FormStatus status="error" title={submitError} className="mt-8" />
                    )}
                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <Button
                        variant="secondary"
                        onClick={prev}
                        disabled={step === 0 || submitting}
                        icon={<ChevronLeft aria-hidden="true" className="size-5" />}
                        className="w-full sm:w-auto"
                      >
                        {BOOKING.back}
                      </Button>
                      <Button
                        type="submit"
                        loading={submitting}
                        iconRight={submitting ? undefined : <ChevronRight aria-hidden="true" className="size-5" />}
                        className="w-full sm:w-auto"
                      >
                        {submitting
                          ? BOOKING.submitting
                          : step === totalSteps - 1
                            ? isEstimate ? BOOKING.submit.estimate : BOOKING.submit.booking
                            : BOOKING.continue}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </div>

            {/* Summary */}
            <aside className="hidden lg:col-span-4 lg:block" aria-labelledby="booking-summary">
              <div className="sticky top-[calc(var(--nav-h)+1.5rem)] border-t border-rule pt-6">
                <h2 id="booking-summary" className="text-lg font-semibold text-fg">
                  {BOOKING.summaryHeading}
                </h2>
                {summary.length > 0 ? (
                  <dl className="mt-5 border-b border-rule">
                    {summary.map((row) => (
                      <div key={row.term} className="border-t border-rule py-3.5">
                        <dt className="text-[0.9375rem] text-muted">{row.term}</dt>
                        <dd className="mt-0.5 font-semibold text-fg first-letter:uppercase">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-4 text-body">{BOOKING.summaryEmpty}</p>
                )}
                <p className="mt-8 text-body">{BOOKING.hero.preferToTalk}</p>
                <Button
                  href={BUSINESS.phoneHref}
                  variant="secondary"
                  icon={<Phone aria-hidden="true" className="size-5" />}
                  className="mt-3"
                >
                  Call {BUSINESS.phone}
                </Button>
                <p className="mt-3 text-[0.9375rem] text-body">{CLAIMS.bookingConfirmation}</p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
