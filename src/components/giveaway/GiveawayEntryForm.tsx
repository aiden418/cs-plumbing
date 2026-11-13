"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { BUSINESS } from "@/lib/constants";
import { GIVEAWAY, giveawayEntrySchema, heaterYearOptions } from "@/lib/giveaway";
import { trackGiveawayEntry } from "@/lib/pixel";
import FileUpload from "@/components/builder-portal/FileUpload";
import { PHOTO_UPLOAD, photoTotalError } from "@/lib/photo-upload";
import { compressAll } from "@/lib/compress-image";

const YEARS = heaterYearOptions();

export default function GiveawayEntryForm() {
  const id = useId();
  const busy = useRef(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [closed, setClosed] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const inputClass =
    "mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-base sm:text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const labelClass = "block text-sm font-medium text-gray-700";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const parsed = giveawayEntrySchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    if (photos.length === 0) {
      setError("Please add a photo of your water heater.");
      return;
    }
    const sizeError = photoTotalError(photos);
    if (sizeError) {
      setError(sizeError);
      return;
    }
    busy.current = true;
    setSending(true);
    setError("");
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
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-6 sm:p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900">You&apos;re entered!</h3>
        <p className="mt-2 text-sm text-gray-600">
          We emailed you a receipt. The winner is drawn on or about {GIVEAWAY.drawOn} and contacted by phone and
          email.
        </p>
        <p className="mt-3 text-sm text-gray-600">
          Water heater acting up before then? Call{" "}
          <a className="font-semibold text-primary underline" href={`tel:${BUSINESS.phoneRaw}`}>
            {BUSINESS.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate={false}
      className="rounded-2xl border border-gray-200 bg-[#F5F5F7] p-5 sm:p-8 space-y-4"
      aria-label="Water heater giveaway entry"
    >
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Enter the giveaway</h2>
        <p className="mt-1 text-xs text-gray-500">Takes about a minute. All fields are required.</p>
      </div>
      <fieldset disabled={sending || closed} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className={labelClass} htmlFor={`${id}-first`}>First name</label>
          <input id={`${id}-first`} name="firstName" autoComplete="given-name" required maxLength={60} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${id}-last`}>Last name</label>
          <input id={`${id}-last`} name="lastName" autoComplete="family-name" required maxLength={60} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${id}-phone`}>Phone number</label>
          <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required minLength={10} maxLength={30} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={200} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor={`${id}-address`}>Home address (where the water heater is)</label>
          <input id={`${id}-address`} name="address" autoComplete="street-address" required minLength={5} maxLength={200} placeholder="Street address" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${id}-city`}>City</label>
          <input id={`${id}-city`} name="city" autoComplete="address-level2" required minLength={2} maxLength={80} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${id}-zip`}>ZIP code</label>
          <input id={`${id}-zip`} name="zip" inputMode="numeric" autoComplete="postal-code" required pattern="[0-9]{5}" maxLength={5} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor={`${id}-year`}>Year your water heater was made</label>
          <select id={`${id}-year`} name="heaterYear" defaultValue="" required className={inputClass}>
            <option value="" disabled>Select a year</option>
            {YEARS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            It&apos;s on the label on the side of the tank, shown as a manufacture date or in the first digits of the
            serial number.
          </p>
        </div>
        <div className="sm:col-span-2">
          <span className={labelClass}>
            Photo of your water heater (up to {GIVEAWAY.maxPhotos})
          </span>
          <p className="mt-1 text-xs text-gray-500">
            One of the whole heater, and one of the label if you can get it.
          </p>
          <div className="mt-2">
            <FileUpload
              files={photos}
              onChange={(next) => {
                // Downscale phone photos as they are picked so the upload stays small.
                setError("");
                void compressAll(next).then(setPhotos);
              }}
              maxFiles={GIVEAWAY.maxPhotos}
              maxSizeMb={PHOTO_UPLOAD.maxBytesEach / 1024 / 1024}
              compact
            />
          </div>
        </div>
        <label className="sm:col-span-2 flex items-start gap-3 text-sm text-gray-700">
          <input type="checkbox" name="agree" required className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 accent-[#0077CC]" />
          <span>
            I&apos;m 18 or older, I own this home, and I agree to the{" "}
            <a className="font-medium text-primary underline" href="#rules">official rules</a>.
          </span>
        </label>
        <label className="sm:col-span-2 flex items-start gap-3 text-sm text-gray-700">
          <input type="checkbox" name="contactOk" className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 accent-[#0077CC]" />
          <span>
            Optional: C&amp;S Plumbing may call, text or email me about replacing my water heater. Not required to
            enter or win.
          </span>
        </label>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={sending || closed}
        className="w-full rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {sending ? "Sending…" : "Enter to Win"}
      </button>
      <p className="text-xs text-gray-500">
        No purchase necessary. Ends {GIVEAWAY.endsLabel}.{" "}
        <Link className="underline" href="/privacy-policy">Privacy policy</Link>
      </p>
    </form>
  );
}
