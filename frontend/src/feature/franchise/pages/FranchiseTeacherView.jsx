import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "-");

const FranchiseTeacherView = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/api/portal/teachers/${id}`)
      .then((response) => setTeacher(response.data))
      .catch((requestError) => setError(requestError.message || "Unable to load teacher profile"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex min-h-[400px] items-center justify-center gap-2 text-sm text-slate-500"><Loader2 size={20} className="animate-spin text-blue-600" /> Loading teacher profile...</div>;

  if (!teacher) return <div className="space-y-4"><Link to="/franchise/teachers" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600"><ArrowLeft size={16} /> Back to teachers</Link><div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">{error || "Teacher not found"}</div></div>;

  const batches = teacher.batches || [];
  const courses = teacher.assignedCourses || [];

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/franchise/teachers" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"><ArrowLeft size={16} /> Back to teachers</Link>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-lg">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl border-2 border-white/30 bg-white/20 text-4xl font-black">{teacher.name?.charAt(0)?.toUpperCase() || "T"}</div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">Teacher profile</p>
            <h1 className="mt-1 truncate text-3xl font-black">{teacher.name}</h1>
            <p className="mt-1 text-sm text-blue-100">{teacher.email || "No email"}</p>
            <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${teacher.isActive ? "bg-emerald-400/20 text-emerald-100" : "bg-white/15 text-blue-100"}`}>{teacher.isActive ? "Active teacher" : "Inactive teacher"}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[[Phone, "Mobile", teacher.mobile || "Not provided"], [BookOpen, "Assigned courses", courses.length], [CalendarDays, "Joined", formatDate(teacher.joiningDate || teacher.createdAt)], [Users, "Batch students", teacher.totalStudents || 0]].map(([Icon, label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Icon size={18} className="text-blue-600" /><p className="mt-3 text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 truncate text-sm font-black text-slate-900">{value}</p></div>)}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">Contact & professional details</h2>
          <div className="mt-4 space-y-4">
            {[[Mail, "Email", teacher.email], [Phone, "Mobile", teacher.mobile], [MapPin, "Franchise", teacher.coachingId?.name], [CalendarDays, "Profile created", formatDate(teacher.createdAt)]].map(([Icon, label, value]) => <div key={label} className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><Icon size={16} /></div><div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="text-sm font-semibold text-slate-700">{value || "-"}</p></div></div>)}
            <div className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
              {[["Qualification", teacher.qualification], ["Specialization", teacher.specialization], ["Experience", teacher.experience], ["Emergency contact", teacher.emergencyContact], ["Address", teacher.address]].map(([label, value]) => <div key={label} className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-700">{value || "-"}</p></div>)}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">Assigned courses</h2>
          <div className="mt-4 flex flex-wrap gap-2">{courses.length ? courses.map((course) => <span key={course._id} className="inline-flex items-center gap-2 rounded-xl bg-purple-50 px-3 py-2 text-xs font-bold text-purple-700"><BookOpen size={14} /> {course.title || course.name}</span>) : <p className="text-sm text-slate-500">No courses assigned.</p>}</div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-black text-slate-900">Teaching batches</h2><p className="mt-1 text-xs text-slate-500">Batches currently assigned to this teacher.</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{batches.length} batches</span></div>
        {batches.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">{batches.map((batch) => <Link key={batch._id} to={`/franchise/batches/${batch._id}`} className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40"><div className="flex items-start justify-between gap-2"><div><p className="font-black text-slate-900">{batch.name}</p><p className="mt-1 text-xs text-slate-500">{batch.course?.title || batch.course?.name || "Course not assigned"}</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{batch.status || "ACTIVE"}</span></div><div className="mt-3 flex gap-4 text-xs font-semibold text-slate-500"><span><Users size={13} className="mr-1 inline" />{batch.students?.length || 0} students</span><span>{batch.days?.join(", ") || "Days not set"}</span></div></Link>)}</div> : <p className="mt-4 rounded-xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">No batches assigned to this teacher.</p>}
      </section>
    </div>
  );
};

export default FranchiseTeacherView;
