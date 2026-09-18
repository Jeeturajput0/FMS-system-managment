import React, { useEffect, useState } from "react";
import { Award, Loader2, Printer, ShieldAlert, X } from "lucide-react";
import { certificateService } from "../../services/certificate.service";
import CertificateView from "./CertificateView";
import PrintPortal from "../../print/PrintPortal";
import { SingleCertPrintPage } from "../../print/CertPrintPages";
import { usePrint } from "../../print/printUtils";
import {
  certificateTemplateName,
  formatLongDate,
  isSuperAdmin,
} from "./certificateTemplates";

const dateInputValue = (v) => {
  if (!v) return "";
  try {
    return new Date(v).toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

/**
 * Certificate Preview Modal — Student List -> Certificate button flow.
 * - Fetches student + course-based template + certificate (existing or auto-created).
 * - Super Admin can set completion date / force-issue.
 * - ONLY Super Admin sees the Print button (backend also enforces).
 */
export default function CertificatePreviewModal({ studentId, open, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completion, setCompletion] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const superAdmin = isSuperAdmin();
  // Certificate hamesha A4 landscape me print hoga.
  const { printing, handlePrint } = usePrint("landscape");

  const handleCertificatePrint = async () => {
    const ok = await handlePrint();
    if (ok) {
      setNotice("Success! Certificate print ke liye bhej diya gaya (landscape).");
      setError("");
    } else {
      setError("Print start nahi ho paya — dobara try karein.");
    }
  };

  const load = async () => {
    if (!studentId) return;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const res = await certificateService.getByStudent(studentId);
      setData(res.data);
      setCompletion(dateInputValue(res.data?.certificate?.completionDate || res.data?.dates?.completionDate));
    } catch (e) {
      setError(e.message || "Unable to load certificate");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, studentId]);

  if (!open) return null;

  const { student, eligibility = {}, certificate, template, description, dates, verifyPath, canPrint } = data || {};
  const courseTitle = certificate?.courseTitle || student?.courseId?.title || "—";
  const verifyUrl = certificate && verifyPath ? `${window.location.origin}${verifyPath}` : "";
  const allowPrint = superAdmin && canPrint && certificate;
  const revoked = certificate?.status === "REVOKED";

  const saveCompletion = async (forceIssue = false) => {
    if (!completion) {
      setError("Please choose a completion date first.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await certificateService.setCompletion(studentId, {
        completionDate: completion,
        forceIssue,
      });
      setData(res.data);
      setCompletion(dateInputValue(res.data?.certificate?.completionDate));
      setNotice("Completion date saved.");
    } catch (e) {
      setError(e.message || "Unable to save completion date");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Certificate preview"
    >
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* header */}
        <div className=" flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div>
            <h2 className="flex items-center gap-2 font-black text-slate-900">
              <Award size={20} className="text-amber-500" /> Certificate Preview
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {student?.name ? `${student.name} · ${courseTitle}` : "Loading student details..."}
              {certificate ? ` · ID ${certificate.certificateNumber}` : ""}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close preview">
            <X />
          </button>
        </div>

        {loading ? (
          <div className="flex h-80 items-center justify-center gap-2 text-sm font-bold text-slate-500">
            <Loader2 className="animate-spin" /> Loading certificate...
          </div>
        ) : error && !data ? (
          <div className="p-8 text-center text-sm font-semibold text-red-600">{error}</div>
        ) : (
          <>
            {error && <p className=" px-5 pt-4 text-center text-xs font-bold text-red-600 sm:px-7">{error}</p>}
            {notice && <p className=" px-5 pt-4 text-center text-xs font-bold text-emerald-600 sm:px-7">{notice}</p>}

            {/* meta strip */}
            {data && (
              <div className=" flex flex-wrap gap-2 px-5 pt-4 text-[11px] font-bold sm:px-7">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  Template: {certificateTemplateName(template?.id)}
                </span>
                {certificate && (
                  <span className={`rounded-full px-3 py-1 ${revoked ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {revoked ? "REVOKED" : certificate.status || "ACTIVE"}
                  </span>
                )}
                {dates?.completionDate ? (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                    Completed {formatLongDate(dates.completionDate)}
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Completion date not set</span>
                )}
              </div>
            )}

            {/* certificate (screen preview: full 297/210, scaled, scrolls on small screens) */}
            <div className="overflow-x-auto bg-[#eef2f6] p-5 sm:p-8">
              {certificate ? (
                <div className="mx-auto aspect-[297/210] w-full max-w-[900px] min-w-[560px] [&_.certificate-template]:h-full [&_.certificate-template]:w-full">
                  <CertificateView
                    certificateNumber={certificate.certificateNumber}
                    studentName={certificate.studentName || student?.name}
                    courseName={certificate.courseTitle || courseTitle}
                    startDate={dates?.startDate}
                    completionDate={dates?.completionDate}
                    issueDate={certificate.issueDate}
                    description={description}
                    verifyUrl={verifyUrl}
                  />
                </div>
              ) : (
                <div className=" mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                  <ShieldAlert className="mx-auto text-amber-500" size={28} />
                  <h3 className="mt-2 font-black text-slate-900">Certificate not issued yet</h3>
                  <ul className="mt-3 space-y-1 text-xs font-semibold text-slate-600">
                    {(eligibility.reasons || []).map((r) => (
                      <li key={r}>• {r}</li>
                    ))}
                    {!eligibility.reasons?.length && <li>• Student is not eligible yet.</li>}
                  </ul>
                  {superAdmin && (
                    <p className="mt-3 text-[11px] text-slate-500">
                      Set a completion date below — you can force-issue the certificate as Super Admin.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* super-admin completion editor */}
            {superAdmin && data && (!certificate || !certificate.completionDate) && (
              <div className=" mx-5 mb-2 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:mx-7 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-700">Completion date</label>
                  <input
                    type="date"
                    value={completion}
                    onChange={(e) => setCompletion(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveCompletion(false)}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save date"}
                  </button>
                  {!certificate && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        if (window.confirm("Issue this certificate even though the student is not eligible?")) saveCompletion(true);
                      }}
                      className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60"
                    >
                      Issue anyway
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* footer */}
            <div className=" flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p className="text-[11px] font-semibold text-slate-400">
                {allowPrint
                  ? "Only the certificate will be printed (landscape)."
                  : "Only Super Admin can print certificates."}
                {verifyUrl && <span className="ml-1">QR opens {verifyPath}.</span>}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600"
                >
                  Close
                </button>
                {allowPrint && (
                  <button
                    type="button"
                    onClick={handleCertificatePrint}
                    disabled={printing}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {printing ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                    {printing ? "Preparing print..." : "Print Certificate"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dedicated print tree (A4 landscape) — mounted before print, hidden on screen */}
      {certificate && (
        <PrintPortal>
          <SingleCertPrintPage
            item={{
              certificateNumber: certificate.certificateNumber,
              studentName: certificate.studentName || student?.name,
              courseName: certificate.courseTitle || courseTitle,
              startDate: dates?.startDate,
              completionDate: dates?.completionDate,
              issueDate: certificate.issueDate,
              description,
              verifyUrl,
            }}
          />
        </PrintPortal>
      )}
    </div>
  );
}
