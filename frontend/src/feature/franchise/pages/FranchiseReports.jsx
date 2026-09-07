import { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";

const FranchiseReports = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { Promise.all([apiFetch("/api/portal/dashboard"), apiFetch("/api/portal/fees")]).then(([dashboard, fees]) => setReport({ ...dashboard.data, fees: fees.data || [] })).catch((requestError) => setError(requestError.message)); }, []);
  const exportCsv = () => { if (!report) return; const rows = [["Metric", "Value"], ["Students", report.students || 0], ["Teachers", report.teachers || 0], ["Active batches", report.activeBatches || 0], ["Courses", report.courses || 0], ["Pending fees", report.pendingFees || 0]]; const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "franchise-report.csv"; link.click(); URL.revokeObjectURL(url); };
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-black text-slate-900">Reports</h1><p className="mt-2 text-sm text-slate-500">Student, batch, attendance and fee overview.</p></div><button onClick={exportCsv} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">Export CSV</button></div>{error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[["Students", report?.students], ["Teachers", report?.teachers], ["Active batches", report?.activeBatches], ["Pending fees", `₹${Number(report?.pendingFees || 0).toLocaleString("en-IN")}`]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-black">{value ?? "—"}</p></div>)}</div></div>;
};
export default FranchiseReports;
