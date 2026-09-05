import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const value = (item) => item?.title || item?.name || item || "Not assigned";

export const StudentDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const franchiseView = location.pathname.startsWith("/franchise");
  const backPath = franchiseView ? "/franchise/students" : "/admin/students";
  const editPath = franchiseView ? `/franchise/students/${id}/edit` : "/admin/students";
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/api/students/${id}`)
      .then((response) => setStudent(response.student))
      .catch((requestError) => setError(requestError.message || "Student not found"));
  }, [id]);

  if (error) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  if (!student) return <div className="flex min-h-64 items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

  const fields = [
    ["Email", student.email || "-"], ["Phone", student.mobile], ["Father name", student.fatherName || "-"],
    ["Course", value(student.courseId)], ["Franchise", value(student.coachingId)], ["Status", student.status],
    ["Address", [student.address, student.city, student.state, student.pincode].filter(Boolean).join(", ") || "-"],
    ["Joining date", student.joiningDate ? new Date(student.joiningDate).toLocaleDateString("en-IN") : "-"],
  ];

  return <div className="space-y-6 pb-12"><Link to={backPath} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft size={16} /> Back to students</Link><div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-500">{student.studentId || student._id}</p><h1 className="mt-2 text-3xl font-black text-slate-900">{student.name}</h1><p className="mt-1 text-sm text-slate-500">Complete student profile and enrollment details</p></div><div className="flex items-center gap-3"><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">{student.status}</span><Link to={editPath} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white"><Edit size={15} /> Edit</Link></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{fields.map(([label, fieldValue]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="mt-2 font-semibold text-slate-900">{fieldValue}</p></div>)}</div><div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-bold text-slate-900">Fees and progress</h2><div className="mt-4 grid gap-4 sm:grid-cols-3"><div><p className="text-xs text-slate-500">Course fee</p><p className="font-bold">₹{Number(student.courseFee || 0).toLocaleString("en-IN")}</p></div><div><p className="text-xs text-slate-500">Paid</p><p className="font-bold text-emerald-600">₹{Number(student.totalPaid || 0).toLocaleString("en-IN")}</p></div><div><p className="text-xs text-slate-500">Attendance</p><p className="font-bold">{student.attendancePercentage || 0}%</p></div></div></div></div>;
};
