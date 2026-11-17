"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  Checkbox,
  Field,
  FileUpload,
  FormattedInput,
  FormStatus,
  Honeypot,
  Select,
  SubmitRow,
  Textarea,
  type FileLike,
} from "@/components/forms";

/** Pretend files: nothing is read from disk and nothing is uploaded. */
const FAKE_FILES: FileLike[] = [
  { name: "kitchen-sink-leak.jpg", size: 1_240_000, type: "image/jpeg" },
  { name: "water-heater-label-closeup-with-a-very-long-file-name.png", size: 812_000, type: "image/png" },
  { name: "inspection-report.pdf", size: 96_000, type: "application/pdf" },
];

const MAX_FILES = 5;

/** File upload with a fake file list. Remove works; adding appends names only. */
export function UploadDemo({ id, withError = false, disabled = false }: { id: string; withError?: boolean; disabled?: boolean }) {
  const [files, setFiles] = useState<FileLike[]>(FAKE_FILES);
  const [error, setError] = useState<string | null>(withError ? "Only JPG, PNG and PDF files can be attached. notes.txt was not added." : null);
  return (
    <FileUpload<FileLike>
      id={id}
      label="Photos of the problem"
      optional
      hint={`Up to ${MAX_FILES} files: JPG, PNG or PDF, 4 MB in total. Specimen only: nothing is uploaded.`}
      files={files}
      disabled={disabled}
      accept=".jpg,.jpeg,.png,.pdf"
      error={error}
      onFilesAdded={(incoming) => {
        if (files.length + incoming.length > MAX_FILES) {
          setError(`You can attach up to ${MAX_FILES} files.`);
          return;
        }
        setError(null);
        setFiles([...files, ...incoming.map(({ name, size, type }) => ({ name, size, type }))]);
      }}
      onFileRemove={(index) => {
        setError(null);
        setFiles(files.filter((_, i) => i !== index));
      }}
    />
  );
}

type Phase = "idle" | "loading" | "success" | "error";

/**
 * A complete homeowner form with real spacing. Not wired to any API: submit
 * shows the loading state, then success (or the error state when "Show the
 * error result" is ticked).
 */
export function SampleForm({ serviceOptions }: { serviceOptions: Array<{ value: string; label: string }> }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phase === "loading") return;
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") ?? "").trim();
    if (!phone) {
      setPhoneError("Enter a phone number so we can call you back.");
      event.currentTarget.querySelector<HTMLInputElement>("#sample-phone")?.focus();
      return;
    }
    setPhoneError(null);
    const fail = data.get("demo-fail") === "on";
    setPhase("loading");
    window.setTimeout(() => {
      setPhase(fail ? "error" : "success");
      requestAnimationFrame(() => statusRef.current?.focus());
    }, 1400);
  };

  if (phase === "success") {
    return (
      <FormStatus
        ref={statusRef}
        tabIndex={-1}
        status="success"
        title="Request received (specimen)"
        actions={
          <button
            type="button"
            onClick={() => setPhase("idle")}
            className="inline-flex min-h-11 items-center text-base font-semibold text-link underline-offset-[0.2em] hover:underline"
          >
            Show the form again
          </button>
        }
      >
        This is what a successful submission looks like. Nothing was sent.
      </FormStatus>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6" aria-describedby="sample-note">
      <p id="sample-note" className="text-sm text-muted">
        Specimen form. Not connected to anything; submitting only shows the states.
      </p>
      {phase === "error" ? (
        <FormStatus ref={statusRef} tabIndex={-1} status="error" title="We could not send that (specimen)">
          This is what a failed submission looks like. On a real page this line offers the phone number.
        </FormStatus>
      ) : null}
      <Honeypot />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="sample-name" label="Your name" required>
          <FormattedInput preset="name" name="name" />
        </Field>
        <Field id="sample-phone" label="Phone" hint="Any format is fine." required error={phoneError}>
          <FormattedInput preset="tel" name="phone" />
        </Field>
        <Field id="sample-email" label="Email" optional>
          <FormattedInput preset="email" name="email" />
        </Field>
        <Field id="sample-zip" label="ZIP code" required>
          <FormattedInput preset="postal-code" name="zip" />
        </Field>
      </div>
      <Field id="sample-address" label="Street address" optional>
        <FormattedInput preset="street-address" name="address" />
      </Field>
      <Field id="sample-service" label="What do you need?" required>
        <Select name="service" placeholder="Choose one">
          {serviceOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field id="sample-message" label="Tell us what is going on" hint="Where it is, when it started, anything you have tried.">
        <Textarea name="message" />
      </Field>
      <FileUpload
        id="sample-photos"
        label="Photos"
        optional
        hint="Up to 5 files: JPG, PNG or PDF. Specimen only: nothing is uploaded."
        accept=".jpg,.jpeg,.png,.pdf"
        files={files}
        onFilesAdded={(incoming) => setFiles([...files, ...incoming].slice(0, 5))}
        onFileRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
      />
      <div className="flex flex-col gap-1">
        <Checkbox id="sample-texts" name="texts" label="Text me updates about this request" />
        <Checkbox
          id="sample-fail"
          name="demo-fail"
          label="Show the error result"
          hint="Specimen control: the next submit ends in the error state."
        />
      </div>
      <SubmitRow
        label="Send request"
        loading={phase === "loading"}
        secondaryHref="#specimen-top"
        secondaryLabel="Back to the top"
      />
    </form>
  );
}
