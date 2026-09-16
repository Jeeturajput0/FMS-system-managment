import React, { useState } from "react";
import { Award } from "lucide-react";
import CertificatePreviewModal from "./CertificatePreviewModal";

/**
 * Reusable "Certificate" action for every student list.
 * Opens the dynamic Certificate Preview (course-based template, QR, print).
 * Existing View/Edit/Delete/Make-ID actions stay untouched.
 */
export default function CertificateButton({
  studentId,
  studentName = "",
  className = "",
  title = "View certificate",
  showLabel = false,
  label = "Certificate",
}) {
  const [open, setOpen] = useState(false);
  const id = typeof studentId === "object" ? studentId?._id || studentId?.id : studentId;
  if (!id) return null;

  return (
    <>
      <button
        type="button"
        title={studentName ? `${title} — ${studentName}` : title}
        aria-label={studentName ? `${title} for ${studentName}` : title}
        onClick={() => setOpen(true)}
        className={
          className ||
          "rounded-lg bg-orange-50 p-2 text-orange-600 transition hover:bg-orange-100"
        }
      >
        <span className="inline-flex items-center gap-1">
          <Award size={15} />
          {showLabel && <span className="hidden text-xs font-bold xl:inline">{label}</span>}
        </span>
      </button>
      {open && (
        <CertificatePreviewModal studentId={id} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
