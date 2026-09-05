import React from "react";

const StudentAttendance = () => (
	<section className="space-y-6">
		<div><h1 className="text-2xl font-black text-slate-900">Attendance</h1><p className="mt-1 text-sm text-slate-500">Track your attendance across the current course.</p></div>
		<div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-xs font-bold uppercase text-slate-400">Overall attendance</p><p className="mt-2 text-4xl font-black text-slate-900">87%</p><div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[87%] rounded-full bg-emerald-500" /></div></div>
	</section>
);

export default StudentAttendance;
