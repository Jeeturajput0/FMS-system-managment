import React from "react";
import { useStudentData } from "../context/StudentDataContext";

const StudentProfile = () => {
  const { user, dashboard, loading, error } = useStudentData();
  const student = dashboard?.recent?.[0];
  if (loading) return <p className="text-sm text-slate-500">Loading your profile...</p>;
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;
  const value = (field, fallback = "Not provided") => field || fallback;
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "Not provided";
  const course = student?.courseId;
  const batch = student?.batchId;
  const fields = [
    ["Full Name", value(student?.name || user?.name, "Student")],
    ["Email", value(student?.email || user?.email)],
    ["Phone Number", value(student?.mobile || user?.mobile)],
    ["Date of Birth", formatDate(student?.dob)],
    ["Gender", value(student?.gender)],
    ["Course Name", value(course?.title)],
    ["Course Duration", course?.duration?.value ? `${course.duration.value} ${course.duration.unit}` : "Not provided"],
    ["Batch Name", value(batch?.name || batch?.code)],
    ["Enrollment Date", formatDate(student?.enrollmentDate || student?.joiningDate)],
    ["Student ID", value(student?.studentId)],
    ["Qualification", value(student?.qualification)],
    ["Address", value(student?.address)],
    ["City", value(student?.city)],
    ["State", value(student?.state)],
    ["Pincode", value(student?.pincode)],
    ["Guardian Name", value(student?.fatherName)],
    ["Guardian Phone", value(student?.guardianPhone)],
    ["Emergency Contact", value(student?.emergencyContact)],
  ];
  return <section className="mx-auto max-w-5xl space-y-6"><div><h1 className="text-2xl font-black text-slate-900">My Profile</h1><p className="mt-1 text-sm text-slate-500">Details submitted by your franchise.</p></div><div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-3">{fields.map(([label, item]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 wrap-break-word font-bold text-slate-900">{item}</p></div>)}</div></section>;
};

export default StudentProfile;
