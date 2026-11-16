"use client";

import { useState } from "react";
import FileUpload from "@/components/builder-portal/FileUpload";
import { BUSINESS } from "@/lib/business";
import { PLAN_SET_MAX_BYTES } from "@/lib/plan-upload";

/** The upload as the booking and portal pages use it: their own text above, no label prop. */
export function UploadAlone() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-body">Photos of the problem (optional, up to 5)</p>
      <FileUpload files={files} onChange={setFiles} maxTotalBytes={PLAN_SET_MAX_BYTES} largePlanSetEmail={BUSINESS.email} />
    </div>
  );
}
