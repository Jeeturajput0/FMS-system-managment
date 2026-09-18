import React, { useEffect, useState } from "react";
import {
  Award,
  Printer,
  Loader2,
  XCircle,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Clock3,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";
import CertificateView from "../../certificate/CertificateView";
import { isSuperAdmin } from "../../certificate/certificateTemplates";
import PrintPortal from "../../../print/PrintPortal";
import { SingleCertPrintPage } from "../../../print/CertPrintPages";
import { usePrint } from "../../../print/printUtils";

const StudentCertificate = () => {
  const { id } = useParams();
  const location = useLocation();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Certificate hamesha LANDSCAPE (A4 297x210mm) me dikhega aur print hoga.
  const superAdmin = isSuperAdmin();
  const { printing, handlePrint } = usePrint("landscape", "certificate");

  const isStudent = location.pathname.startsWith("/student/");

  useEffect(() => {
    setLoading(true);
    setError("");

    apiFetch(
      isStudent
        ? "/api/certificates/me"
        : `/api/certificates/student/${id}`
    )
      .then((response) => {
        setData(response?.data);
      })
      .catch((requestError) => {
        setError(
          requestError?.message || "Unable to load certificate"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, isStudent]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          </div>

          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">
              Loading Certificate
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Please wait a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-5">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>

            <div>
              <h2 className="text-sm font-black text-red-900">
                Unable to Load Certificate
              </h2>

              <p className="mt-0.5 text-xs text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const {
    eligibility = {},
    certificate,
    student,
    description = "",
    dates = {},
    verifyPath = "",
  } = data;

  const courseTitle =
    student?.courseId?.title ||
    certificate?.courseTitle ||
    "Course Certificate";

  // QR / verification link — scan karne par public verification page khulta hai.
  const verifyUrl = certificate
    ? `${window.location.origin}${verifyPath || `/verify-certificate/${certificate.certificateNumber}`}`
    : "";

  const printItem = certificate
    ? {
        certificateNumber: certificate.certificateNumber,
        studentName: certificate.studentName || student?.name,
        courseName: certificate.courseTitle || courseTitle,
        startDate: dates?.startDate,
        completionDate: dates?.completionDate,
        issueDate: certificate.issueDate,
        description,
        verifyUrl,
      }
    : null;

  const handleCertificatePrint = async () => {
    const ok = await handlePrint();
    if (!ok) {
      setError("Print start nahi ho paya — dobara try karein.");
    }
  };

  /* ================= CERTIFICATE AVAILABLE ================= */

  return (
    <section className="mx-auto w-full max-w-6xl space-y-3">
      {/* ================= PAGE HEADER ================= */}

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 px-4 py-3 text-white shadow-md sm:px-5 sm:py-4">
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-20 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Award className="h-6 w-6 text-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-black sm:text-2xl">
                  {certificate
                    ? "Certificate Ready"
                    : "Certificate"}
                </h1>

                {certificate && (
                  <span className="hidden rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm sm:inline-flex">
                    Verified
                  </span>
                )}
              </div>

              <p className="truncate text-xs font-medium text-orange-50">
                {courseTitle}
              </p>
            </div>
          </div>

          {/* Right */}
          {certificate && (
            <div className="hidden shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold backdrop-blur-sm sm:flex">
              <ShieldCheck size={14} />
              Official Certificate
            </div>
          )}
        </div>
      </div>

      {/* ================= CERTIFICATE ================= */}

      {certificate ? (
        <>
          {/* ================= CERTIFICATE PREVIEW (LANDSCAPE A4) ================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2 pt-1">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-blue-700">
                Landscape · A4 297×210mm
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-400">
                ID: {certificate.certificateNumber}
              </span>
            </div>

            {/* Landscape certificate — screen par poora dikhega, print par full A4 page */}
            <div className="overflow-x-auto rounded-xl bg-[#eef2f6] p-3 sm:p-5">
              <div className="mx-auto aspect-[297/210] w-full max-w-[1000px] min-w-[560px] [&_.certificate-template]:h-full [&_.certificate-template]:w-full">
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
            </div>

            {/* ================= PRINT ================= */}

            <div className="no-print flex flex-col items-center justify-between gap-2 px-1 py-2 sm:flex-row">
              <p className="text-[11px] font-semibold text-slate-400">
                {superAdmin
                  ? "Print par sirf certificate A4 landscape me print hoga."
                  : "Certificate print sirf Super Admin kar sakta hai."}
                {verifyUrl && (
                  <a
                    href={verifyPath || `/verify-certificate/${certificate.certificateNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-1 font-bold text-blue-600 hover:underline"
                  >
                    Verify certificate
                  </a>
                )}
              </p>
              {superAdmin && (
                <button
                  type="button"
                  onClick={handleCertificatePrint}
                  disabled={printing}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {printing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Printer size={14} />
                  )}
                  {printing ? "Preparing print..." : "Print Certificate (A4 Landscape)"}
                </button>
              )}
            </div>
          </div>

          {/* Dedicated print tree (A4 landscape full page) — screen par hidden */}
          {printItem && (
            <PrintPortal>
              <SingleCertPrintPage item={printItem} />
            </PrintPortal>
          )}

          {/* ================= CERTIFICATE STATS ================= */}

          <div className="grid gap-2 sm:grid-cols-3">
            <StatCard
              icon={Award}
              label="Certificate Status"
              value="Completed"
              description="Successfully certified"
            />

            <StatCard
              icon={CheckCircle2}
              label="Attendance"
              value={`${certificate.attendance ?? 0}%`}
              description="Course attendance"
            />

            <StatCard
              icon={GraduationCap}
              label="Course"
              value={courseTitle}
              description="Completed course"
            />
          </div>
        </>
      ) : (
        /* ================= NOT ELIGIBLE ================= */

        <div className="space-y-3">
          {/* ================= MAIN STATUS CARD ================= */}

          <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Clock3 className="h-6 w-6 text-amber-500" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h2 className="text-base font-black text-slate-900 sm:text-lg">
                      Certificate Not Available Yet
                    </h2>

                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">
                      In Progress
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs leading-5 text-slate-600">
                    Complete all course requirements to become
                    eligible for your certificate.
                  </p>
                </div>
              </div>
            </div>

            {/* ================= ELIGIBILITY METRICS ================= */}

            <div className="grid gap-2 p-3 sm:grid-cols-3">
              <EligibilityCard
                icon={GraduationCap}
                label="Course Progress"
                value={`${eligibility.progress ?? 0}%`}
                progress={eligibility.progress ?? 0}
              />

              <EligibilityCard
                icon={CheckCircle2}
                label="Attendance"
                value={`${eligibility.attendance ?? 0}%`}
                progress={eligibility.attendance ?? 0}
              />

              <Metric
                icon={CreditCard}
                label="Pending Fees"
                value={`₹${Number(
                  eligibility.pendingFees || 0
                ).toLocaleString("en-IN")}`}
              />
            </div>
          </div>

          {/* ================= REQUIREMENTS ================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                <Sparkles className="h-4 w-4 text-orange-500" />
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Requirements to Complete
                </h3>

                <p className="text-[10px] text-slate-500">
                  Complete the following items to unlock your
                  certificate.
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              {Array.isArray(eligibility.reasons) &&
              eligibility.reasons.length > 0 ? (
                eligibility.reasons.map((reason, index) => (
                  <div
                    key={`${reason}-${index}`}
                    className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50/60 p-2.5"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                      <XCircle
                        size={14}
                        className="text-amber-500"
                      />
                    </div>

                    <p className="text-xs font-semibold text-slate-700">
                      {reason}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                  No pending requirements found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 line-clamp-1 text-sm font-black text-slate-900">
            {value}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
          <Icon className="h-4 w-4 text-orange-500" />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   ELIGIBILITY CARD
========================================================= */

const EligibilityCard = ({
  icon: Icon,
  label,
  value,
  progress,
}) => {
  const safeProgress = Math.min(
    100,
    Math.max(0, Number(progress) || 0)
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
          <Icon className="h-4 w-4 text-orange-500" />
        </div>

        <span className="text-lg font-black text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-2 text-xs font-bold text-slate-700">
        {label}
      </p>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};

/* =========================================================
   METRIC
========================================================= */

const Metric = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
          <Icon className="h-4 w-4 text-orange-500" />
        </div>

        <p className="text-right text-base font-black text-slate-900">
          {value}
        </p>
      </div>

      <p className="mt-2 text-xs font-bold text-slate-700">
        {label}
      </p>
    </div>
  );
};
export default StudentCertificate;