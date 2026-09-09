import { useEffect, useState } from "react";
import { BarChart3, Edit3, Plus, RefreshCw, Trash2 } from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { useData } from "../../../context/DataContext";

const emptyForm = { name: "", type: "PERFORMANCE", coachingId: "", dateFrom: "", dateTo: "" };
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const AdminReportsPage = () => {
  const { franchises } = useData();
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try { setLoading(true); const response = await apiFetch("/api/admin/reports"); setReports(response.data || []); } catch (requestError) { setError(requestError.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true); setError("");
      const response = await apiFetch(editingId ? `/api/admin/reports/${editingId}` : "/api/admin/reports", { method: editingId ? "PUT" : "POST", body: JSON.stringify(form) });
      setReports((current) => editingId ? current.map((item) => item.id === editingId ? response.data : item) : [response.data, ...current]);
      setForm(emptyForm); setEditingId(null);
    } catch (requestError) { setError(requestError.message); } finally { setSaving(false); }
  };
  const edit = (report) => setForm({ name: report.name, type: report.type, coachingId: report.coachingId || "", dateFrom: report.dateFrom ? report.dateFrom.slice(0, 10) : "", dateTo: report.dateTo ? report.dateTo.slice(0, 10) : "" }) || setEditingId(report.id);
  const remove = async (id) => { if (!window.confirm("Delete this report?")) return; await apiFetch(`/api/admin/reports/${id}`, { method: "DELETE" }); setReports((current) => current.filter((item) => item.id !== id)); };
  return <section className="space-y-6 pb-12">
    <div><p className="text-xs font-bold uppercase tracking-widest text-orange-600">Admin analytics</p><h1 className="mt-2 text-3xl font-black text-slate-900">Reports</h1><p className="mt-2 text-sm text-slate-500">Create saved reports from live student, fee, course and franchise data.</p></div>
    <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 lg:grid-cols-6">
      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Report name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm lg:col-span-2" />
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="PERFORMANCE">Performance</option><option value="FINANCE">Finance</option><option value="ENROLLMENT">Enrollment</option></select>
      <select value={form.coachingId} onChange={(e) => setForm({ ...form, coachingId: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="">All franchises</option>{franchises.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <input type="date" value={form.dateFrom} onChange={(e) => setForm({ ...form, dateFrom: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" /><input type="date" value={form.dateTo} onChange={(e) => setForm({ ...form, dateTo: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      <div className="flex gap-2 lg:col-span-6"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} />{editingId ? "Update report" : "Generate report"}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-xl border px-4 text-sm font-bold text-slate-600">Cancel</button>}</div>
    </form>
    {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {loading ? <p className="text-sm text-slate-500">Loading reports...</p> : reports.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No saved reports yet.</div> : <div className="grid gap-5 xl:grid-cols-2">{reports.map((report) => { const totals = report.data?.totals || {}; return <article key={report.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><BarChart3 size={18} className="text-orange-500" /><h2 className="font-black text-slate-900">{report.name}</h2></div><p className="mt-1 text-xs text-slate-500">{report.type} · Updated {new Date(report.updatedAt).toLocaleDateString("en-IN")}</p></div><div className="flex gap-1"><button onClick={() => edit(report)} title="Edit report" className="rounded-lg bg-blue-50 p-2 text-blue-600"><Edit3 size={15} /></button><button onClick={() => remove(report.id)} title="Delete report" className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 size={15} /></button></div></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Students", totals.students], ["Completed", totals.completed], ["Paid", money(totals.totalPaid)], ["Pending", money(totals.totalPending)]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] text-slate-500">{label}</p><p className="mt-1 font-black text-slate-900">{value}</p></div>)}</div><div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>Avg progress: <b className="text-slate-800">{totals.averageProgress || 0}%</b></span><span>Avg attendance: <b className="text-slate-800">{totals.averageAttendance || 0}%</b></span><button onClick={load} title="Refresh report list" className="inline-flex items-center gap-1 font-bold text-orange-600"><RefreshCw size={13} /> Refresh</button></div></article>; })}</div>}
  </section>;
};

export default AdminReportsPage;