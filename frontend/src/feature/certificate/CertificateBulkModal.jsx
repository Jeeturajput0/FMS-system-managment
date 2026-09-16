import React, { useEffect, useState } from "react";
import { Award, Loader2, Printer, X } from "lucide-react";
import { certificateService } from "../../services/certificate.service";
import { isSuperAdmin } from "./certificateTemplates";
import PrintPortal from "../../print/PrintPortal";
import { CertPrintPages } from "../../print/CertPrintPages";
import { usePrint } from "../../print/printUtils";
import "./certificate.css";

/**
 * Bulk certificate print — one A4 landscape page per certificate.
 * Students without an issued certificate are listed and skipped.
 * Print is SUPER_ADMIN only (backend enforces too).
 */
export default function CertificateBulkModal({ studentIds = [], open, onClose }) {
  const [items, setItems] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const superAdmin = isSuperAdmin();
  const { printing, handlePrint } = usePrint("landscape");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      setItems([]);
      setSkipped([]);
      const done = [];
      const missed = [];
      for (const id of studentIds) {
        try {
          const res = await certificateService.getByStudent(id);
          const { student, certificate, description, dates } = res.data || {};
          if (certificate) {
            const courseTitle = certificate.courseTitle || student?.courseId?.title || "";
            done.push({
              certificateNumber: certificate.certificateNumber,
              studentName: certificate.studentName || student?.name,
              courseName: courseTitle,
              startDate: dates?.startDate,
              completionDate: dates?.completionDate,
              issueDate: certificate.issueDate,
              description,
              verifyUrl: `${window.location.origin}/verify-certificate/${certificate.certificateNumber}`,
            });
          } else {
            missed.push(student?.name || id);
          }
        } catch {
          missed.push(id);
        }
        if (cancelled) return;
      }
      if (!cancelled) {
        setItems(done);
        setSkipped(missed);
        if (!done.length) setError("No issued certificates found for the selected students.");
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;
  const allowPrint = superAdmin && items.length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Bulk certificate print"
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div>
            <h2 className="flex items-center gap-2 font-black text-slate-900">
              <Award size={20} className="text-amber-500" />
              Print Certificates — {studentIds.length} selected
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Each certificate prints on its own A4 landscape page.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X />
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center gap-2 text-sm font-bold text-slate-500">
            <Loader2 className="animate-spin" /> Loading certificates...
          </div>
        ) : (
          <div className="space-y-3 p-5 sm:p-7">
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-600">{error}</p>}
            {items.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                {items.map((c) => (
                  <div key={c.certificateNumber} className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-0">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">{c.studentName}</p>
                      <p className="font-mono text-[11px] text-slate-400">{c.certificateNumber} · {c.courseName}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">READY</span>
                  </div>
                ))}
              </div>
            )}
            {skipped.length > 0 && (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">
                Skipped ({skipped.length}): no issued certificate yet — {skipped.slice(0, 5).join(", ")}
                {skipped.length > 5 ? ` +${skipped.length - 5} more` : ""}.
              </p>
            )}
            {!superAdmin && (
              <p className="text-center text-xs font-semibold text-slate-400">Only Super Admin can print certificates.</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 sm:px-7">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">
            Close
          </button>
          {allowPrint && (
            <button
              type="button"
              onClick={handlePrint}
              disabled={printing || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {printing ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
              {printing ? "Preparing print..." : `Print ${items.length} Certificate${items.length !== 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      </div>

      {/* Dedicated print tree (A4 landscape, one cert per page) */}
      {items.length > 0 && (
        <PrintPortal>
          <CertPrintPages items={items} />
        </PrintPortal>
      )}
    </div>
  );
}
