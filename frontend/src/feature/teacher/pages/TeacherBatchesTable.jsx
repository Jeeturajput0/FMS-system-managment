import { useEffect, useMemo, useState } from "react";
import { CalendarDays, GraduationCap, Loader2, Users } from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { Pagination } from "../../../components/Pagination";

const TeacherBatchesTable = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    apiFetch("/api/portal/teacher-batches")
      .then((response) => setBatches(response?.data || []))
      .catch((requestError) => setError(requestError.message || "Failed to load batches"))
      .finally(() => setLoading(false));
  }, []);

  const pageBatches = useMemo(() => batches.slice((page - 1) * pageSize, page * pageSize), [batches, page]);
  const totalStudents = batches.reduce((total, batch) => total + (batch.students?.length || 0), 0);

  return <section className="space-y-6 pb-10">
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><GraduationCap size={22} /></div><div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Teaching Dashboard</p><h1 className="mt-1 text-2xl font-black text-slate-900">My Batches</h1><p className="mt-1 text-sm text-slate-500">Batches assigned to you.</p></div></div></div>
    {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
    {!loading && !error && <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase text-slate-400">Assigned batches</p><p className="mt-2 text-3xl font-black text-slate-900">{batches.length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase text-slate-400">Total students</p><p className="mt-2 text-3xl font-black text-slate-900">{totalStudents}</p></div></div>}
    {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center"><Loader2 className="mx-auto animate-spin text-blue-600" /></div> : batches.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center text-sm text-slate-500">No batches assigned yet.</div> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Batch</th><th className="px-5 py-4">Code</th><th className="px-5 py-4">Course</th><th className="px-5 py-4">Schedule</th><th className="px-5 py-4">Students</th><th className="px-5 py-4">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{pageBatches.map((batch) => <tr key={batch._id} className="hover:bg-slate-50"><td className="px-5 py-4 font-black text-slate-900">{batch.name || "Unnamed batch"}</td><td className="px-5 py-4 font-mono text-xs text-slate-500">{batch.code || "-"}</td><td className="px-5 py-4 font-semibold text-slate-700">{batch.course?.title || batch.course?.name || "Not assigned"}</td><td className="px-5 py-4 text-xs text-slate-600"><span className="inline-flex items-center gap-1"><CalendarDays size={13} />{batch.days?.length ? batch.days.join(", ") : "Not set"}</span></td><td className="px-5 py-4"><span className="inline-flex items-center gap-1 font-bold text-slate-700"><Users size={14} />{batch.students?.length || 0}</span></td><td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{batch.status || "ACTIVE"}</span></td></tr>)}</tbody></table></div><Pagination page={page} pageCount={Math.ceil(batches.length / pageSize)} onPageChange={setPage} totalItems={batches.length} pageSize={pageSize} /></div>}
  </section>;
};

export default TeacherBatchesTable;
