import React, { useEffect, useState } from "react";
import {
  Award,
  Download,
  Loader2,
  XCircle,
  CheckCircle2,
  CalendarDays,
  GraduationCap,
  ShieldCheck,
  Clock3,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const StudentCertificate = () => {
  const { id } = useParams();
  const location = useLocation();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
  } = data;

  const courseTitle =
    student?.courseId?.title ||
    certificate?.courseTitle ||
    "Course Certificate";

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
          {/* ================= CERTIFICATE PREVIEW ================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
            <div className="certificate-print relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br from-white via-orange-50/30 to-white p-1.5">
              {/* Inner Border */}
              <div className="relative overflow-hidden rounded-lg border border-orange-300 px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-8">
                {/* Decorative corners */}
                <div className="absolute left-0 top-0 h-16 w-16 rounded-br-full bg-orange-100/70" />
                <div className="absolute bottom-0 right-0 h-20 w-20 rounded-tl-full bg-amber-100/60" />

                {/* ================= TOP ================= */}

                <div className="relative text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-orange-200 bg-white shadow-sm sm:h-14 sm:w-14">
                    <Award className="h-6 w-6 text-orange-500 sm:h-7 sm:w-7" />
                  </div>

                  <p className="mt-2 text-[9px] font-black uppercase tracking-[0.25em] text-orange-600 sm:text-[10px]">
                    AI Scholars Certification
                  </p>

                  <div className="mx-auto mt-2 h-px max-w-[180px] bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                    Certificate
                    <span className="block text-orange-500">
                      of Completion
                    </span>
                  </h2>

                  <p className="mt-2 text-xs text-slate-500">
                    This certificate is proudly presented to
                  </p>

                  {/* Student Name */}
                  <h3 className="mt-1.5 break-words text-2xl font-black text-slate-900 sm:text-3xl">
                    {student?.name || certificate.studentName}
                  </h3>

                  <div className="mx-auto mt-1.5 h-0.5 w-16 rounded-full bg-orange-500" />

                  <p className="mx-auto mt-3 max-w-2xl text-xs leading-5 text-slate-600 sm:text-sm">
                    For successfully completing the{" "}
                    <strong className="font-black text-slate-900">
                      {certificate.courseTitle}
                    </strong>{" "}
                    course and fulfilling the required learning
                    and attendance requirements.
                  </p>
                </div>

                {/* ================= CERTIFICATE INFORMATION ================= */}

                <div className="relative mt-5 grid gap-2 border-t border-orange-100 pt-4 sm:grid-cols-3">
                  <CertificateInfo
                    icon={ShieldCheck}
                    label="Certificate No."
                    value={certificate.certificateNumber}
                  />

                  <CertificateInfo
                    icon={CalendarDays}
                    label="Issue Date"
                    value={
                      certificate.issueDate
                        ? new Date(
                            certificate.issueDate
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"
                    }
                  />

                  <CertificateInfo
                    icon={CheckCircle2}
                    label="Attendance"
                    value={`${certificate.attendance ?? 0}%`}
                  />
                </div>

                {/* ================= FOOTER ================= */}

                <div className="relative mt-5 flex flex-col items-center justify-between gap-3 border-t border-orange-100 pt-4 sm:flex-row">
                  <div className="text-center sm:text-left">
                    <p className="text-[9px] font-bold text-slate-400">
                      CERTIFICATE OF ACHIEVEMENT
                    </p>

                    <p className="mt-0.5 text-[9px] text-slate-500">
                      Issued by AI Scholars
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-1 h-6 w-24 border-b border-slate-400" />

                    <p className="text-[9px] font-bold text-slate-500">
                      Authorized Signature
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= DOWNLOAD ================= */}

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-black text-white shadow-sm shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                <Download size={14} />
                Download Certificate
              </button>
            </div>
          </div>

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

      {/* ================= PRINT CSS ================= */}

      <style>{`
        @media print {
          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          .certificate-print,
          .certificate-print * {
            visibility: visible;
          }

          .certificate-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 15px;
            border: none !important;
            box-shadow: none !important;
          }

          button {
            display: none !important;
          }

          @page {
            size: A4 landscape;
            margin: 8mm;
          }
        }
      `}</style>
    </section>
  );
};

/* =========================================================
   CERTIFICATE INFO
========================================================= */

const CertificateInfo = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-orange-100 bg-white/70 p-2.5 text-center">
      <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50">
        <Icon className="h-3.5 w-3.5 text-orange-500" />
      </div>

      <p className="mt-1 text-[9px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 break-words text-xs font-black text-slate-900">
        {value || "-"}
      </p>
    </div>
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