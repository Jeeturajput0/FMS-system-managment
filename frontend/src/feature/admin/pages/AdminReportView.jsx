import { useEffect, useState } from "react";
import { ArrowLeft, BarChart3, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const AdminReportView = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const response = await apiFetch("/api/admin/reports");
        const match = (response.data || []).find((item) => String(item.id) === String(id) || String(item._id) === String(id));
        if (!match) throw new Error("Report not found");
        setReport(match);
      } catch (requestError) {
        setError(requestError.message || "Unable to load report");
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [id]);

  if (loading) return <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" /> Loading report...</div>;
  if (error) return <section className="space-y-4"><Link to="/admin/reports" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600"><ArrowLeft size={16} /> Back to reports</Link><p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p></section>;

  const totals = report.data?.totals || {};
  const rows = [
    ["Students", totals.students || 0],
    ["Completed", totals.completed || 0],
    ["Total paid", money(totals.totalPaid)],
    ["Total pending", money(totals.totalPending)],
    ["Average progress", `${totals.averageProgress || 0}%`],
    ["Average attendance", `${totals.averageAttendance || 0}%`],
  ];

  return <section className="space-y-6 pb-12">
    <Link to="/admin/reports" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600"><ArrowLeft size={16} /> Back to reports</Link>
    <div className="flex items-start gap-3"><div className="rounded-xl bg-orange-50 p-3 text-orange-600"><BarChart3 size={22} /></div><div><p className="text-xs font-bold uppercase tracking-widest text-orange-600">{report.type}</p><h1 className="mt-1 text-3xl font-black text-slate-900">{report.name}</h1><p className="mt-1 text-sm text-slate-500">Updated {new Date(report.updatedAt).toLocaleDateString("en-IN")}</p></div></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Metric</th><th className="px-5 py-4">Value</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map(([label, value]) => <tr key={label}><td className="px-5 py-4 font-semibold text-slate-600">{label}</td><td className="px-5 py-4 font-black text-slate-900">{value}</td></tr>)}</tbody></table></div></div>
  </section>;
};

export default AdminReportView;
