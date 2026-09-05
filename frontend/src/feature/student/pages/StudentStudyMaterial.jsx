import React from "react";

const StudentStudyMaterial = () => <section className="space-y-6"><div><h1 className="text-2xl font-black text-slate-900">Study Material</h1><p className="mt-1 text-sm text-slate-500">Access videos, PDFs and other learning resources.</p></div><div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">{["React course notes.pdf", "API development video", "JavaScript practice guide"].map((material) => <div key={material} className="flex items-center justify-between p-5"><span className="font-bold text-slate-800">{material}</span><button className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600">Open</button></div>)}</div></section>;

export default StudentStudyMaterial;
