import React from "react";
import { useStudentData } from "../context/StudentDataContext";

const StudentProfile = () => {
  const { user, loading, error } = useStudentData();
  if (loading) return <p className="text-sm text-slate-500">Loading your profile...</p>;
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;
  return <section className="mx-auto max-w-3xl space-y-6"><div><h1 className="text-2xl font-black text-slate-900">My Profile</h1><p className="mt-1 text-sm text-slate-500">Your student account information.</p></div><div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase text-slate-400">Name</p><p className="mt-2 font-bold text-slate-900">{user.name || "Student"}</p></div><div><p className="text-xs font-bold uppercase text-slate-400">Email</p><p className="mt-2 font-bold text-slate-900">{user.email || "-"}</p></div><div><p className="text-xs font-bold uppercase text-slate-400">Role</p><p className="mt-2 font-bold text-slate-900">{user.role || "STUDENT"}</p></div><div><p className="text-xs font-bold uppercase text-slate-400">Account status</p><p className="mt-2 font-bold text-emerald-600">Active</p></div></div></section>;
};

export default StudentProfile;
