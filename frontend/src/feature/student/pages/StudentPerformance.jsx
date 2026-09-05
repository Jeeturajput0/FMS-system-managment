import React from "react";

const StudentPerformance = () => (
	<section className="space-y-6"><div><h1 className="text-2xl font-black text-slate-900">Performance</h1><p className="mt-1 text-sm text-slate-500">Review your learning performance and assessment scores.</p></div><div className="grid gap-4 sm:grid-cols-3">{[["Average score", "82%"], ["Assignments", "8/10"], ["Tests passed", "6/7"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-900">{value}</p></div>)}</div></section>
);

export default StudentPerformance;
