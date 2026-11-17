"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { BUSINESS } from "@/lib/business";
import { GIVEAWAY, giveawayEntrySchema, heaterYearOptions } from "@/lib/giveaway";
import { trackGiveawayEntry } from "@/lib/pixel";
import FileUpload from "@/components/builder-portal/FileUpload";
import { Checkbox, Field, FormattedInput, FormPanel, FormStatus, Select, SubmitRow } from "@/components/forms";
import { PHOTO_UPLOAD, photoTotalError } from "@/lib/photo-upload";
import { compressAll } from "@/lib/compress-image";

const YEARS = heaterYearOptions();
const linkClass = "font-semibold text-link underline underline-offset-[0.2em]";

type Errors = Partial<Record<string, string>>;

/** First problem per field: the shared schema's message, else the browser's own. */
function fieldErrors(form: HTMLFormElement, schemaIssues: { path: PropertyKey[]; message: string }[]): Errors {
  const errors: Errors = {};
  for (const issue of schemaIssues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  for (const element of Array.from(form.elements)) {
    const el = element as HTMLInputElement;
    if (!el.name || !el.willValidate || el.validity.valid || errors[el.name]) continue;
    errors[el.name] = el.validationMessage;
  }
  return errors;
}

/**
 * Entry form of the water heater giveaway. Always multipart: a photo of the
 * current heater is part of the entry. Fields, limits and messages come from
 * src/lib/giveaway.ts, which /api/giveaway checks again on the server.
 */
export default function GiveawayEntryForm() {
  const id = useId();
  const busy = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [closed, setClosed] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [photoError, setPhotoError] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [forSomeoneElse, setForSomeoneElse] = useState(false);

  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus());

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const parsed = giveawayEntrySchema.safeParse(Object.fromEntries(new FormData(form)));
    const found = fieldErrors(form, parsed.success ? [] : parsed.error.issues);
    if (!parsed.success || Object.keys(found).length > 0) {
      setErrors(found);
      setError(parsed.success ? Object.values(found)[0] ?? "" : parsed.error.issues[0].message);
      const first = Array.from(form.elements).find(
        (el) => (el as HTMLInputElement).name && found[(el as HTMLInputElement).name],
      ) as HTMLElement | undefined;
      first?.focus();
      return;
    }
    const photoProblem =
      photos.length === 0 ? "Please add a photo of the water heater." : photoTotalError(photos);
    if (photoProblem) {
      setErrors({});
      setPhotoError(photoProblem);
      setError(photoProblem);
      return;
    }
    busy.current = true;
    setSending(true);
    setError("");
    setErrors({});
    setPhotoError("");
    try {
      const body = new FormData();
      for (const [key, value] of Object.entries(parsed.data)) {
        if (value !== undefined && value !== null) body.append(key, String(value));
      }
      photos.forEach((file) => body.append(PHOTO_UPLOAD.field, file));
      const response = await fetch("/api/giveaway", { method: "POST", body });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw Object.assign(new Error(result.error ?? "Submission failed"), { code: result.code });
      }
      setSent(true);
      focusStatus();
      trackGiveawayEntry({ eventId: result.eventId });
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "closed") setClosed(true);
      // Photo and closing-date problems are explained by the server in customer-facing words.
      setError(
        (code === "attachments" || code === "closed") && err instanceof Error
          ? err.message
          : `Your entry could not be sent. Please try again or call ${BUSINESS.phone}.`,
      );
      focusStatus();
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  /** Editing a field clears its message; the rest stay until the next submit. */
  function clearFieldError(event: React.FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name;
    if (!name || !errors[name]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  if (sent) {
    return (
      <FormStatus ref={statusRef} tabIndex={-1} status="success" data-tone="white" title="You're entered!">
        <p>
          We emailed you a receipt. We verify the oldest water heaters in person and announce the winner on or about{" "}
          {GIVEAWAY.announceOn}. {GIVEAWAY.scamWarning}
        </p>
        <p className="mt-3">
          Water heater acting up before then? Call{" "}
          <a className={linkClass} href={BUSINESS.phoneHref}>
            {BUSINESS.phone}
          </a>
          .
        </p>
      </FormStatus>
    );
  }

  const fid = (name: string) => `${id}-${name}`;

  return (
    <FormPanel className="border border-steel-200">
      <form
        onSubmit={submit}
        onChange={clearFieldError}
        noValidate
        className="space-y-6"
        aria-label="Water heater giveaway entry"
      >
        <div>
          <h2 className="text-display-sm text-fg">Enter a water heater</h2>
          <p className="mt-1 text-sm text-muted">
            Yours, or one you know of. Takes about a minute.
          </p>
        </div>
        <fieldset disabled={sending || closed} className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6">
          <Field id={fid("firstName")} label="Your first name" required error={errors.firstName}>
            <FormattedInput name="firstName" preset="name" autoComplete="given-name" maxLength={60} />
          </Field>
          <Field id={fid("lastName")} label="Your last name" required error={errors.lastName}>
            <FormattedInput name="lastName" preset="name" autoComplete="family-name" maxLength={60} />
          </Field>
          <Field id={fid("phone")} label="Phone number" required error={errors.phone}>
            <FormattedInput name="phone" preset="tel" minLength={10} maxLength={30} />
          </Field>
          <Field id={fid("email")} label="Email" required error={errors.email}>
            <FormattedInput name="email" preset="email" maxLength={200} />
          </Field>
          <Field
            id={fid("address")}
            label="Address of the home"
            hint="Where the water heater is."
            required
            error={errors.address}
            className="sm:col-span-2"
          >
            <FormattedInput name="address" preset="street-address" minLength={5} maxLength={200} />
          </Field>
          <Field id={fid("city")} label="City" required error={errors.city}>
            <Select name="city" defaultValue="" autoComplete="address-level2">
              <option value="" disabled>
                Select a city
              </option>
              {GIVEAWAY.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          </Field>
          <Field id={fid("zip")} label="ZIP code" required error={errors.zip}>
            <FormattedInput name="zip" preset="postal-code" pattern="[0-9]{5}" maxLength={5} />
          </Field>
          <Field
            id={fid("heaterYear")}
            label="Year the water heater was made"
            hint="On the label on the side of the tank: a manufacture date, or the first digits of the serial number."
            required
            error={errors.heaterYear}
            className="sm:col-span-2"
          >
            <Select name="heaterYear" defaultValue="">
              <option value="" disabled>
                Select a year
              </option>
              {YEARS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="min-w-0 sm:col-span-2">
            <FileUpload
              id={fid("photos")}
              label={`Photo of the water heater (1 to ${GIVEAWAY.maxPhotos}: the whole heater, plus the label that shows its date)`}
              files={photos}
              onChange={(next) => {
                setPhotoError("");
                setError("");
                // Downscale phone photos as they are picked so the upload stays small.
                void compressAll(next).then(setPhotos);
              }}
              maxFiles={GIVEAWAY.maxPhotos}
              maxSizeMb={PHOTO_UPLOAD.maxBytesEach / 1024 / 1024}
              error={photoError || undefined}
              compact
            />
          </div>
          <Checkbox
            id={fid("forSomeoneElse")}
            name="forSomeoneElse"
            checked={forSomeoneElse}
            onChange={(event) => setForSomeoneElse(event.target.checked)}
            wrapperClassName="sm:col-span-2"
            label="This is someone else's water heater."
            hint="A relative, friend or neighbor. The new water heater goes to them."
          />
          {forSomeoneElse ? (
            <Field
              id={fid("ownerName")}
              label="Homeowner's name"
              hint="We'll reach them through you first."
              required
              error={errors.ownerName}
              className="sm:col-span-2"
            >
              <FormattedInput name="ownerName" preset="name" autoComplete="off" minLength={2} maxLength={120} />
            </Field>
          ) : null}
          <Checkbox
            id={fid("agree")}
            name="agree"
            required
            error={errors.agree}
            wrapperClassName="sm:col-span-2"
            label={
              <>
                I&apos;m 18 or older, I own this home or have the owner&apos;s OK to enter it, and I agree to the{" "}
                <a className={linkClass} href="#rules">
                  official rules
                </a>
                .
              </>
            }
          />
          <Checkbox
            id={fid("contactOk")}
            name="contactOk"
            wrapperClassName="sm:col-span-2"
            label="It's OK to call or text me about replacing a water heater."
            hint="Optional. Not required to enter or win."
          />
          {/* Same honeypot markup as ServiceRequestForm. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />
        </fieldset>
        {error ? <FormStatus ref={statusRef} tabIndex={-1} status="error" data-tone="white" title={error} /> : null}
        <SubmitRow label="Submit entry" loading={sending} disabled={closed} className="w-full sm:w-auto" />
        <p className="text-sm text-muted">
          No purchase necessary. Ends {GIVEAWAY.endsLabel}. {GIVEAWAY.consent}{" "}
          <Link className="text-link underline underline-offset-[0.2em]" href="/privacy-policy">
            Privacy policy
          </Link>
        </p>
      </form>
    </FormPanel>
  );
}
