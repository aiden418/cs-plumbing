"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, FileText, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];
const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";
const MAX_FILES = 10;
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export default function FileUpload({ files, onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Validate size
      const tooLarge = newFiles.filter((f) => f.size > MAX_SIZE_BYTES);
      if (tooLarge.length) {
        setError(`File too large: ${tooLarge.map((f) => f.name).join(", ")}. Max ${MAX_SIZE_MB}MB per file.`);
        return;
      }

      // Validate count
      const combined = [...files, ...newFiles];
      if (combined.length > MAX_FILES) {
        setError(`You can upload a maximum of ${MAX_FILES} files.`);
        return;
      }

      onChange(combined);
    },
    [files, onChange]
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
          "relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200",
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
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-sm sm:text-base font-medium text-gray-700">
          Drag &amp; drop files here, or{" "}
          <span className="text-primary font-semibold">browse</span>
        </p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          PDF, JPG, PNG &middot; Up to {MAX_FILES} files &middot; {MAX_SIZE_MB}MB max each
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
                <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
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
