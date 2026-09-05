import React from "react";

const StudentCertificateEligibility = () => <section className="space-y-6"><h1 className="text-2xl font-black text-slate-900">Certificate Eligibility</h1><div className="grid gap-4 sm:grid-cols-2">{[["Course progress", "68%", "75% required"], ["Attendance", "87%", "75% required"], ["Assignments", "8/10", "8 required"]].map(([label, value, note]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>)}</div></section>;

export default StudentCertificateEligibility;
