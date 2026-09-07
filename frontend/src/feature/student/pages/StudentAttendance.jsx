import React from "react";
import { useStudentData } from "../context/StudentDataContext";

const StudentAttendance = () => {
  const { dashboard, loading, error } = useStudentData();
  const attendance = Number(dashboard?.attendance || dashboard?.recent?.[0]?.attendancePercentage || 0);
  if (loading) return <p className="text-sm text-slate-500">Loading attendance...</p>;
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;
  return <section className="space-y-6">
		<div><h1 className="text-2xl font-black text-slate-900">Attendance</h1><p className="mt-1 text-sm text-slate-500">Track your attendance across the current course.</p></div>
		<div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-xs font-bold uppercase text-slate-400">Overall attendance</p><p className="mt-2 text-4xl font-black text-slate-900">{attendance}%</p><div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${attendance}%` }} /></div></div>
	</section>;
};

export default StudentAttendance;
