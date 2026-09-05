import React from "react";

const StudentTopics = () => <section className="space-y-6"><div><h1 className="text-2xl font-black text-slate-900">Topics</h1><p className="mt-1 text-sm text-slate-500">Explore the topics in your assigned course.</p></div><div className="grid gap-3 sm:grid-cols-2">{["HTML and CSS", "JavaScript Essentials", "React Components", "REST APIs"].map((topic) => <div key={topic} className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-900">{topic}</h2><p className="mt-2 text-xs text-slate-500">Lesson · 45 minutes</p></div>)}</div></section>;

export default StudentTopics;
