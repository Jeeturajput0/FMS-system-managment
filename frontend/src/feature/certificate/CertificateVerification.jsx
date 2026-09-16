import React, { useEffect, useState } from "react";
import { Award, Loader2, ShieldAlert, ShieldCheck, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { certificateService } from "../../services/certificate.service";
import { formatLongDate } from "./certificateTemplates";
import "./certificate.css";

/**
 * Public verification page: /verify-certificate/:certificateId
 * Shows ONLY verification-safe fields. No auth required.
 */
export default function CertificateVerification() {
  const { certificateId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    certificateService
      .verify(certificateId)
      .then((res) => setData(res.data))
      .catch((e) => setError(e.message || "Certificate Not Found"))
      .finally(() => setLoading(false));
  }, [certificateId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">AI Scholars</p>
          <h1 className="mt-1 flex items-center justify-center gap-2 text-2xl font-black">
            <Award size={24} /> Certificate Verification
          </h1>
        </div>

        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="flex flex-col items-center gap-2 py-8 text-sm font-bold text-slate-500">
              <Loader2 className="animate-spin text-blue-600" /> Verifying certificate...
            </div>
          ) : error || !data ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <XCircle className="mx-auto text-red-500" size={36} />
              <h2 className="mt-2 font-black text-red-900">Certificate Not Found</h2>
              <p className="mt-1 text-xs text-red-700">
                {error || `No certificate exists with ID "${certificateId}".`}
              </p>
              <Link to="/" className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white">
                Go Home
              </Link>
            </div>
          ) : (
            <>
              <div
                className={`flex items-center gap-3 rounded-2xl border p-4 ${
                  data.status === "REVOKED"
                    ? "border-red-200 bg-red-50"
                    : "border-emerald-200 bg-emerald-50"
                }`}
              >
                {data.status === "REVOKED" ? (
                  <ShieldAlert className="shrink-0 text-red-500" size={28} />
                ) : (
                  <ShieldCheck className="shrink-0 text-emerald-600" size={28} />
                )}
                <div>
                  <p className={`font-black ${data.status === "REVOKED" ? "text-red-900" : "text-emerald-900"}`}>
                    {data.status === "REVOKED" ? "Certificate Status: REVOKED" : "Certificate Verified"}
                  </p>
                  <p className="text-xs text-slate-500">This is a genuine AI Scholars certificate.</p>
                </div>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["Certificate ID", data.certificateId],
                  ["Student", data.studentName],
                  ["Course", data.courseName],
                  ["Issue Date", formatLongDate(data.issueDate)],
                  ["Completion Date", formatLongDate(data.completionDate)],
                  ["Status", data.status || "ACTIVE"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-2.5">
                    <dt className="text-xs font-bold uppercase text-slate-400">{label}</dt>
                    <dd className="text-right font-bold text-slate-900">{value || "—"}</dd>
                  </div>
                ))}
              </dl>

              <Link to="/" className="mt-6 block rounded-xl bg-slate-900 py-3 text-center text-sm font-bold text-white">
                Go Home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
