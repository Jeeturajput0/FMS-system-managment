import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const endpointFor = (type) => ({ students: "/api/portal/students", courses: "/api/portal/courses", fees: "/api/portal/fees" })[type];

export const PortalSectionPage = ({ title, description, type, actionLabel, actionPath }) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch(endpointFor(type));
        setRows(response.data || []);
      } catch (requestError) {
        setError(requestError.message || "Unable to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type]);

  return <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">Workspace data</p><h1 className="mt-2 text-3xl font-black text-slate-900">{title}</h1><p className="mt-2 text-sm text-slate-500">{description}</p></div>{actionLabel && <button onClick={() => actionPath && navigate(actionPath)} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">{actionLabel}</button>}</div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">{error}</div>}
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><p className="text-sm font-bold text-slate-800">{rows.length} records</p><span className="text-xs text-slate-400">Live backend data</span></div>{loading ? <div className="p-8 text-sm text-slate-400">Loading...</div> : rows.length === 0 ? <div className="p-8 text-center text-sm text-slate-400">No records found for this account.</div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400"><tr>{(type === "students" ? ["Name", "Email", "Course", "Status"] : type === "courses" ? ["Course", "Level", "Duration", "Fee"] : ["Student", "Course", "Total", "Pending"]).map((heading) => <th key={heading} className="px-5 py-3 font-bold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row._id} className="hover:bg-slate-50">{type === "students" && <><td className="px-5 py-4 font-bold text-slate-800">{row.name}</td><td className="px-5 py-4 text-slate-500">{row.email || row.mobile}</td><td className="px-5 py-4 text-slate-500">{row.courseId?.title || "Not assigned"}</td><td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{row.status}</span></td></>}{type === "courses" && <><td className="px-5 py-4 font-bold text-slate-800">{row.title}</td><td className="px-5 py-4 text-slate-500">{row.level}</td><td className="px-5 py-4 text-slate-500">{row.duration?.value} {row.duration?.unit}</td><td className="px-5 py-4 font-bold text-slate-700">₹{Number(row.courseFee || 0).toLocaleString("en-IN")}</td></>}{type === "fees" && <><td className="px-5 py-4 font-bold text-slate-800">{row.studentId?.name || "Student"}</td><td className="px-5 py-4 text-slate-500">{row.courseId?.title || "Course"}</td><td className="px-5 py-4 text-slate-700">₹{Number(row.totalAmount || 0).toLocaleString("en-IN")}</td><td className="px-5 py-4 font-bold text-orange-600">₹{Number(row.totalPending || 0).toLocaleString("en-IN")}</td></>}</tr>)}</tbody></table></div>}</section>
  </div>;
};
