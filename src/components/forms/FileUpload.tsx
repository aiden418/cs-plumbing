"use client";

import { useImperativeHandle, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode, type Ref } from "react";
import { FileText, ImageIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";
import { describedBy, fieldIds, formatFileSize } from "./format";
import { hintClass, labelClass, optionalTagClass } from "./styles";

/** A File, or anything shaped like one (the specimen shows a fake list). */
export interface FileLike {
  name: string;
  size: number;
  type?: string;
}

export interface FileUploadProps<F extends FileLike = File> {
  /** The <input type=file> id; label, hint and error are wired to it. */
  id: string;
  label: ReactNode;
  /** Files chosen so far. The caller owns the list and appends it to FormData. */
  files: readonly F[];
  /**
   * Called with what was just picked or dropped (already turned into an array).
   * The caller checks types, sizes and counts and sets `error` when it refuses.
   */
  onFilesAdded: (incoming: File[]) => void;
  /** Called with the index of the file whose Remove button was pressed. */
  onFileRemove: (index: number) => void;
  /** Limits hint slot, e.g. "Up to 5 photos, JPG, PNG or PDF, 4 MB in total". */
  hint?: ReactNode;
  /** Error slot (a refused pick, or the server's attachments message). */
  error?: ReactNode;
  /** `accept` for the picker, e.g. ".jpg,.jpeg,.png,.pdf". */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  optional?: boolean;
  /** Button text. */
  buttonLabel?: string;
  /** Text after the button, shown where dragging is possible. */
  dropLabel?: string;
  /** Remove-button label prefix; the file name follows. */
  removeLabel?: string;
  className?: string;
  /** Reaches the <input type=file>. */
  inputRef?: Ref<HTMLInputElement>;
}

const isImage = (file: FileLike) => (file.type ?? "").startsWith("image/") || /\.(jpe?g|png|heic|webp)$/i.test(file.name);

/**
 * Button + drop zone, then the chosen files with a Remove button each.
 *
 * The <input type="file"> has NO name attribute: the caller keeps `files` and
 * appends them to FormData itself, exactly as the forms do today. The input
 * is visually hidden but focusable; the label drawn as a button opens the
 * picker by click, and Enter/Space on the focused input open it by keyboard.
 */
export function FileUpload<F extends FileLike = File>({
  id,
  label,
  files,
  onFilesAdded,
  onFileRemove,
  hint,
  error,
  accept,
  multiple = true,
  disabled = false,
  optional = false,
  buttonLabel = "Choose files",
  dropLabel = "or drag them here",
  removeLabel = "Remove",
  className,
  inputRef,
}: FileUploadProps<F>) {
  const { hintId, errorId } = fieldIds(id);
  const listId = `${id}-list`;
  const hasHint = hint !== undefined && hint !== null && hint !== false && hint !== "";
  const hasError = error !== undefined && error !== null && error !== false && error !== "";
  const [dragging, setDragging] = useState(false);
  const localInput = useRef<HTMLInputElement | null>(null);
  const removeButtons = useRef<Array<HTMLButtonElement | null>>([]);

  useImperativeHandle(inputRef, () => localInput.current as HTMLInputElement, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.currentTarget.files ?? []);
    // Clear the input so picking the same file again still fires a change.
    event.currentTarget.value = "";
    if (picked.length) onFilesAdded(picked);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    if (!dragging) setDragging(true);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    const dropped = Array.from(event.dataTransfer.files);
    if (dropped.length) onFilesAdded(multiple ? dropped : dropped.slice(0, 1));
  };

  const handleRemove = (index: number) => {
    onFileRemove(index);
    // Keep keyboard focus in the list: the next file's button, else the
    // previous one, else back to the picker.
    requestAnimationFrame(() => {
      const buttons = removeButtons.current.filter((b): b is HTMLButtonElement => b !== null && b.isConnected);
      const target = buttons.length ? buttons[Math.min(index, buttons.length - 1)] : localInput.current;
      target?.focus();
    });
  };

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span id={`${id}-label`} className={labelClass}>
        {label}
        {optional ? <span className={optionalTagClass}>Optional</span> : null}
      </span>
      {hasHint ? (
        <p id={hintId} className={cn(hintClass, "-mt-0.5")}>
          {hint}
        </p>
      ) : null}

      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        data-dragging={dragging || undefined}
        className={cn(
          "flex min-w-0 flex-col items-stretch gap-3 rounded-control border border-dashed border-steel-300 bg-white p-4 sm:flex-row sm:items-center",
          "transition-[border-color,background-color] duration-150 ease-enter",
          "data-dragging:border-solid data-dragging:border-primary data-dragging:bg-[color-mix(in_srgb,var(--color-primary)_5%,white)]",
          hasError && "border-emergency",
          disabled && "bg-steel-50",
        )}
      >
        <input
          ref={localInput}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          aria-labelledby={`${id}-label ${id}-button`}
          aria-describedby={describedBy(hasError && errorId, hasHint && hintId, files.length > 0 && listId)}
          aria-invalid={hasError || undefined}
          className="peer sr-only"
        />
        <label
          id={`${id}-button`}
          htmlFor={id}
          className={cn(
            "inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control border border-steel-300 bg-white px-5 whitespace-nowrap",
            "text-base font-semibold text-ink transition-[border-color,transform] duration-150 ease-enter",
            "hover:border-steel-700 active:scale-[0.98]",
            "peer-focus-visible:border-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
            "peer-disabled:cursor-not-allowed peer-disabled:border-dashed peer-disabled:bg-steel-50 peer-disabled:text-steel-500 peer-disabled:active:scale-100",
          )}
        >
          <Upload aria-hidden="true" strokeWidth={1.75} className="size-5 shrink-0" />
          {buttonLabel}
        </label>
        <span className="hidden min-w-0 text-sm text-steel-500 sm:inline" aria-hidden="true">
          {dropLabel}
        </span>
      </div>

      {files.length > 0 ? (
        <ul id={listId} aria-label="Chosen files" className="mt-1 flex flex-col divide-y divide-steel-200 rounded-control border border-steel-200 bg-white">
          {files.map((file, index) => {
            const Icon = isImage(file) ? ImageIcon : FileText;
            return (
              <li key={`${file.name}-${index}`} className="flex min-w-0 items-center gap-3 py-1 pr-1 pl-4">
                <Icon aria-hidden="true" strokeWidth={1.75} className="size-5 shrink-0 text-steel-500" />
                <span className="min-w-0 flex-1 truncate text-base text-ink" title={file.name}>
                  {file.name}
                </span>
                <span className="shrink-0 text-sm tabular-nums text-steel-500">{formatFileSize(file.size)}</span>
                <button
                  ref={(node) => {
                    removeButtons.current[index] = node;
                  }}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleRemove(index)}
                  aria-label={`${removeLabel} ${file.name}`}
                  className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-control text-steel-700 transition-colors duration-150 hover:bg-steel-100 hover:text-ink disabled:cursor-not-allowed disabled:text-steel-400"
                >
                  <X aria-hidden="true" strokeWidth={1.75} className="size-5" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {files.length === 0 ? "" : files.length === 1 ? "1 file chosen" : `${files.length} files chosen`}
      </p>

      <FieldError id={errorId}>{hasError ? error : null}</FieldError>
    </div>
  );
}

export default FileUpload;
