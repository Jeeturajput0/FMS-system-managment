import React from "react";
import { useStudentData } from "../context/StudentDataContext";

const StudentPendingFees = () => {
  const { fees, loading, error } = useStudentData();
  const pending = (fees || []).reduce((total, fee) => total + Number(fee.totalPending || 0), 0);

  if (loading) return <p className="text-sm text-slate-500">Loading pending fees...</p>;
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;

  return <section className="space-y-6"><h1 className="text-2xl font-black text-slate-900">Pending Fees</h1><div className="rounded-2xl border border-orange-200 bg-orange-50 p-6"><p className="text-xs font-bold uppercase text-orange-700">Outstanding balance</p><p className="mt-2 text-4xl font-black text-slate-900">₹{pending.toLocaleString("en-IN")}</p><p className="mt-3 text-sm text-slate-600">Contact your franchise to arrange payment.</p></div></section>;
};

export default StudentPendingFees;
