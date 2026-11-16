"use client";

import { useId, useState, type ReactNode } from "react";
import { FileUpload as KitFileUpload } from "@/components/forms/FileUpload";
import { PHOTO_UPLOAD } from "@/lib/photo-upload";
import { planSetTooLarge } from "@/lib/plan-upload";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];
const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";
const MAX_FILES = 10;
// Production refuses request bodies over about 4.5 MB before our code runs
// (see src/lib/photo-upload.ts), so no default here may promise more than that.
const MAX_SIZE_MB = PHOTO_UPLOAD.maxBytesEach / 1024 / 1024;

/** Whole megabytes, or one decimal, rounded down so a hint never overstates a cap. */
const formatMb = (bytes: number) => String(Math.floor((bytes / 1024 / 1024) * 10) / 10);

/**
 * What a builder reads when the files chosen would pass the combined cap: the
 * cap itself and, when an office address is given, email as the way to send a
 * full plan set.
 */
export function PlanSetTooLarge({ maxBytes, email }: { maxBytes: number; email?: string }) {
  return (
    <>
      That would put this upload over its {formatMb(maxBytes)} MB total limit. Choose fewer or
      smaller files
      {email ? (
        <>
          , or email large plan sets to{" "}
          <a href={`mailto:${email}`} className="font-semibold underline">
            {email}
          </a>{" "}
          and submit this request without them.
        </>
      ) : (
        "."
      )}
    </>
  );
}

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  /** Lower cap for the homeowner forms; the builder forms keep the default. */
  maxFiles?: number;
  /** Per-file cap in MB. */
  maxSizeMb?: number;
  /** Kept for the callers that pass it; the kit's control is one size. */
  compact?: boolean;
  /**
   * Cap on the combined size of the selection, in bytes. The builder forms set
   * it: plan files go up exactly as picked (a plan PDF cannot be downscaled the
   * way a phone photo is), so the whole selection has to fit in one request.
   * With a cap set, the hint states it and a selection that would pass it is
   * refused as soon as it is chosen, before anything is sent.
   */
  maxTotalBytes?: number;
  /** Office address offered, as a mailto link, for plan sets over maxTotalBytes. */
  largePlanSetEmail?: string;
  /** The file input's id (label, hint and error are wired to it). Generated when absent. */
  id?: string;
  /**
   * The visible label above the control. Callers that print their own label
   * above the component leave it out; the control is then named for screen
   * readers only.
   */
  label?: ReactNode;
  /** A message from the form (e.g. the selection is too large to send), shown when the control has none of its own. */
  error?: ReactNode;
}

/**
 * The plan and photo picker of the builder forms and the homeowner forms,
 * drawn with the forms kit's FileUpload. Same props and checks as before:
 * wrong type, combined size (builder forms, with the email offer), size per
 * file and count are refused when chosen, in that order. The file input has
 * no name: the caller keeps `files` and appends them to FormData itself.
 */
export default function FileUpload({
  files,
  onChange,
  maxFiles = MAX_FILES,
  maxSizeMb = MAX_SIZE_MB,
  maxTotalBytes,
  largePlanSetEmail,
  id,
  label,
  error: formError,
}: FileUploadProps) {
  const autoId = useId();
  const inputId = id ?? `file-upload${autoId.replace(/:/g, "")}`;
  const [error, setError] = useState<ReactNode>(null);

  const addFiles = (incoming: File[]) => {
    setError(null);
    const newFiles = Array.from(incoming);

    // Validate type
    const invalid = newFiles.filter((f) => !ACCEPTED_TYPES.includes(f.type));
    if (invalid.length) {
      setError(`Invalid file type: ${invalid.map((f) => f.name).join(", ")}. Only PDF, JPG, and PNG are accepted.`);
      return;
    }

    // Validate combined size (builder forms). Checked before the per-file
    // cap so one oversized plan set gets the email offer, not a bare limit.
    if (maxTotalBytes !== undefined && planSetTooLarge([...files, ...newFiles], maxTotalBytes)) {
      setError(<PlanSetTooLarge maxBytes={maxTotalBytes} email={largePlanSetEmail} />);
      return;
    }

    // Validate size
    const tooLarge = newFiles.filter((f) => f.size > maxSizeMb * 1024 * 1024);
    if (tooLarge.length) {
      setError(`File too large: ${tooLarge.map((f) => f.name).join(", ")}. Max ${maxSizeMb}MB per file.`);
      return;
    }

    // Validate count
    const combined = [...files, ...newFiles];
    if (combined.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} files.`);
      return;
    }

    onChange(combined);
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
    setError(null);
  };

  // One text run, so the limits read the same in the HTML as on screen.
  const hint =
    maxTotalBytes === undefined
      ? `PDF, JPG, PNG · Up to ${maxFiles} files · ${maxSizeMb}MB max each`
      : `PDF, JPG, PNG · Up to ${maxFiles} files · ${formatMb(maxTotalBytes)} MB total`;

  const shown = error ?? formError;

  return (
    <KitFileUpload
      id={inputId}
      label={label ?? <span className="sr-only">Files</span>}
      className={label ? undefined : "-mt-1.5"}
      files={files}
      onFilesAdded={addFiles}
      onFileRemove={removeFile}
      hint={hint}
      // role="alert": a refused pick is announced the moment it happens.
      error={shown ? <span role="alert">{shown}</span> : null}
      accept={ACCEPTED_EXTENSIONS}
      multiple
    />
  );
}
