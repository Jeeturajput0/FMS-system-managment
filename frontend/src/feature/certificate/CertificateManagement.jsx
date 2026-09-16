import React, { useEffect, useState } from "react";
import { Award, Eye, Loader2, Printer, RefreshCw, Search, ShieldAlert, X } from "lucide-react";
import { certificateService } from "../../services/certificate.service";
import CertificatePreviewModal from "./CertificatePreviewModal";
import { formatLongDate, isSuperAdmin } from "./certificateTemplates";

/**
 * Super Admin Certificate Management: /admin/certificates
 * List + search + Preview + Print (SUPER_ADMIN only) + Revoke/Restore.
 */
export default function CertificateManagement() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [previewId, setPreviewId] = useState(null);
  const [acting, setActing] = useState("");
  const superAdmin = isSuperAdmin();
  const pageSize = 20;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await certificateService.list({ search, status, page, limit: pageSize });
      setItems(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch (e) {
      setError(e.message || "Unable to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const toggleStatus = async (cert) => {
    const next = cert.status === "REVOKED" ? "ACTIVE" : "REVOKED";
    const ok = window.confirm(
      next === "REVOKED"
        ? `Revoke certificate ${cert.certificateNumber}? It will show REVOKED on verification.`
        : `Restore certificate ${cert.certificateNumber} to ACTIVE?`
    );
    if (!ok) return;
    setActing(cert.certificateNumber);
    try {
      await certificateService.revoke(cert.certificateNumber, next);
      await load();
    } catch (e) {
      setError(e.message || "Unable to update certificate status");
    } finally {
      setActing("");
    }
  };

  const pages = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <div className="space-y-5 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
            <Award className="text-amber-500" /> Certificates
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Issued certificates, verification status and administrative actions.
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
          {error}
          <button onClick={() => setError("")} className="rounded-lg p-1 hover:bg-red-100"><X size={14} /></button>
        </div>
      )}

      <form onSubmit={onSearch} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificate ID, student or course..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="REVOKED">REVOKED</option>
        </select>
        <button type="submit" className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white">
          Search
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Certificate ID</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Course</th>
                <th className="px-5 py-3.5">Completed</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-slate-500">
                    <Loader2 className="mx-auto animate-spin text-blue-600" /> Loading certificates...
                  </td>
                </tr>
              ) : !items.length ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-slate-500">No certificates found.</td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-800">{c.certificateNumber}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {c.studentName}
                      <span className="block font-mono text-[11px] font-medium text-slate-400">
                        {c.studentId?.studentId || ""}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{c.courseTitle}</td>
                    <td className="px-5 py-3.5 text-slate-600">{formatLongDate(c.completionDate)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${c.status === "REVOKED" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {c.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          title="Preview certificate"
                          onClick={() => setPreviewId(c.studentId?._id || c.studentId)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        >
                          <Eye size={15} />
                        </button>
                        {superAdmin && (
                          <button
                            type="button"
                            title={c.status === "REVOKED" ? "Restore certificate" : "Revoke certificate"}
                            disabled={acting === c.certificateNumber}
                            onClick={() => toggleStatus(c)}
                            className={`rounded-lg p-2 ${c.status === "REVOKED" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                          >
                            {acting === c.certificateNumber ? <Loader2 size={15} className="animate-spin" /> : <ShieldAlert size={15} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          <span>Total <b className="text-slate-800">{total}</b></span>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40">Prev</button>
            <span className="font-bold">{page} / {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {!superAdmin && (
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Printer size={13} /> Printing and revoke actions are restricted to Super Admin.
        </p>
      )}

      {previewId && (
        <CertificatePreviewModal studentId={previewId} open onClose={() => { setPreviewId(null); load(); }} />
      )}
    </div>
  );
}
