import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Edit,
  Loader2,
  UserRound,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "Not set";

const FranchiseBatchView = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiFetch(`/api/batches/${id}`)
      .then((response) => {
        if (active) setBatch(response.batch);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load batch");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center gap-2 text-sm text-slate-500">
        <Loader2 size={20} className="animate-spin text-blue-600" /> Loading batch...
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="space-y-4">
        <Link to="/franchise/batches" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">
          <ArrowLeft size={16} /> Back to batches
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
          {error || "Batch not found"}
        </div>
      </div>
    );
  }

  const courseName = batch.course?.title || batch.course?.name || "Course not assigned";
  const students = batch.students || [];
  const schedule = [batch.startTime, batch.endTime].filter(Boolean).join(" - ") || "Time not set";

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/franchise/batches" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600">
          <ArrowLeft size={16} /> Back to batches
        </Link>
        <div className="flex gap-2">
          <Link to={`/franchise/batches/${batch._id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:border-blue-200 hover:text-blue-600">
            <Edit size={16} /> Edit batch
          </Link>
          <Link to={`/franchise/batches/students?batchId=${batch._id}`} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700">
            <Users size={16} /> Manage students
          </Link>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">Batch details</p>
            <h1 className="mt-2 text-3xl font-black">{batch.name}</h1>
            <p className="mt-2 text-sm text-blue-100">{batch.description || "No batch description"}</p>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black uppercase">{batch.status || "ACTIVE"}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [BookOpen, "Course", courseName],
          [UserRound, "Teacher", batch.teacher?.name || "Not assigned"],
          [CalendarDays, "Schedule", schedule],
          [Users, "Students", `${students.length} / ${batch.maxStudents || 0}`],
        ].map(([Icon, label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Icon size={18} className="text-blue-600" />
            <p className="mt-3 text-xs font-semibold text-slate-500">{label}</p>
            <p className="mt-1 truncate text-sm font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900">Student list</h2>
            <p className="mt-1 text-xs text-slate-500">{batch.days?.join(", ") || "Days not set"} · {formatDate(batch.startDate)} to {formatDate(batch.endDate)}</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{students.length} students</span>
        </div>
        {students.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Student ID</th><th className="px-4 py-3">Mobile</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-blue-50/30">
                    <td className="px-4 py-3 font-bold text-slate-900">{student.name || "-"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{student.studentId || "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{student.mobile || "-"}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{student.status || "registered"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="rounded-xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">No students assigned to this batch.</p>}
      </div>
    </div>
  );
};

export default FranchiseBatchView;
