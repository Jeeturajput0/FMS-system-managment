import React from "react";

const StudentModules = () => <section className="space-y-6"><div><h1 className="text-2xl font-black text-slate-900">Course Modules</h1><p className="mt-1 text-sm text-slate-500">Continue learning module by module.</p></div><div className="space-y-3">{["Web Foundations", "React Development", "Backend with Node.js"].map((module, index) => <div key={module} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-sm font-black text-blue-700">{index + 1}</span><div><h2 className="font-bold text-slate-900">{module}</h2><p className="text-xs text-slate-500">{index + 2} topics</p></div></div><span className="text-xs font-bold text-emerald-600">{index === 0 ? "Completed" : "In progress"}</span></div>)}</div></section>;

export default StudentModules;
