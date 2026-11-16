"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, FileText, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
  /** Tighter drop zone for use inside a short form. */
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
}

export default function FileUpload({
  files,
  onChange,
  maxFiles = MAX_FILES,
  maxSizeMb = MAX_SIZE_MB,
  compact = false,
  maxTotalBytes,
  largePlanSetEmail,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<React.ReactNode>(null);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
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
    },
    [files, onChange, maxFiles, maxSizeMb, maxTotalBytes, largePlanSetEmail]
  );

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
    setError(null);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getIcon = (type: string) =>
    type === "application/pdf" ? (
      <FileText className="w-4 h-4 text-red-500" />
    ) : (
      <ImageIcon className="w-4 h-4 text-blue-500" />
    );

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200",
          compact ? "p-4 sm:p-5" : "p-8 sm:p-12",
          dragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Upload className={cn("text-gray-400 mx-auto", compact ? "w-6 h-6 mb-2" : "w-8 h-8 mb-3")} />
        <p className="text-sm sm:text-base font-medium text-gray-700">
          Drag &amp; drop files here, or{" "}
          <span className="text-primary font-semibold">browse</span>
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {maxTotalBytes === undefined ? (
            <>PDF, JPG, PNG &middot; Up to {maxFiles} files &middot; {maxSizeMb}MB max each</>
          ) : (
            <>PDF, JPG, PNG &middot; Up to {maxFiles} files &middot; {formatMb(maxTotalBytes)} MB total</>
          )}
        </p>
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            {files.length} file{files.length !== 1 ? "s" : ""} selected
          </p>
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              {getIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
