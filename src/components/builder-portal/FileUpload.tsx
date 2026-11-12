"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, FileText, ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes, PLAN_SIZE_MB, PLAN_UPLOAD } from "@/lib/plan-upload";

const ACCEPTED_TYPES: readonly string[] = PLAN_UPLOAD.types;
const ACCEPTED_EXTENSIONS = PLAN_UPLOAD.extensions.join(",");

/** Per-file upload state a parent can show while it sends the files. */
export type FileUploadStatus = { progress?: number; done?: boolean; error?: string };

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  /** Lower cap for the homeowner forms; the builder portal passes PLAN_UPLOAD.maxFiles. */
  maxFiles?: number;
  /** Per-file cap in MB; the builder portal passes its own. */
  maxSizeMb?: number;
  /** Shown in the hint when the whole set is capped as well. */
  maxTotalMb?: number;
  /** Tighter drop zone for use inside a short form. */
  compact?: boolean;
  /** Blocks picking and removing files, e.g. while they upload. */
  disabled?: boolean;
  /** Upload progress or result per file, rendered under the file row. */
  fileStatus?: (file: File) => FileUploadStatus | undefined;
}

export default function FileUpload({
  files,
  onChange,
  maxFiles = PLAN_UPLOAD.maxFiles,
  maxSizeMb = PLAN_SIZE_MB,
  maxTotalMb,
  compact = false,
  disabled = false,
  fileStatus,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      if (disabled) return;
      setError(null);
      const newFiles = Array.from(incoming);

      // Validate type
      const invalid = newFiles.filter((f) => !ACCEPTED_TYPES.includes(f.type));
      if (invalid.length) {
        setError(`Invalid file type: ${invalid.map((f) => f.name).join(", ")}. Only PDF, JPG, and PNG are accepted.`);
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
    [files, onChange, maxFiles, maxSizeMb, disabled]
  );

  const removeFile = (index: number) => {
    if (disabled) return;
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
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        aria-disabled={disabled || undefined}
        className={cn(
          "relative border-2 border-dashed rounded-xl text-center transition-all duration-200",
          compact ? "p-4 sm:p-5" : "p-8 sm:p-12",
          disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-70"
            : dragOver
              ? "border-primary bg-primary/5 scale-[1.01] cursor-pointer"
              : "border-gray-300 hover:border-primary/50 hover:bg-gray-50 cursor-pointer"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          multiple
          disabled={disabled}
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
          PDF, JPG, PNG &middot; Up to {maxFiles} files &middot; {maxSizeMb}MB max each
          {maxTotalMb ? <> &middot; {maxTotalMb}MB total</> : null}
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            {files.length} file{files.length !== 1 ? "s" : ""} selected
          </p>
          {files.map((file, i) => {
            const status = fileStatus?.(file);
            return (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
              >
                {getIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                  {status?.error ? (
                    <p className="mt-1 text-xs text-red-600">{status.error}</p>
                  ) : status?.done ? (
                    <p className="mt-1 flex items-center gap-1 text-xs text-green-700">
                      <Check className="w-3 h-3" aria-hidden="true" /> Uploaded
                    </p>
                  ) : typeof status?.progress === "number" ? (
                    <div
                      className="mt-1.5 h-1 w-full rounded bg-gray-200"
                      role="progressbar"
                      aria-label={`Uploading ${file.name}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(status.progress)}
                    >
                      <div
                        className="h-1 rounded bg-primary transition-[width] duration-200"
                        style={{ width: `${Math.max(2, Math.min(100, status.progress))}%` }}
                      />
                    </div>
                  ) : null}
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    aria-label={`Remove ${file.name}`}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
