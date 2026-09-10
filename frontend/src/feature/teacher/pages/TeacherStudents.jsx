
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Eye,
  Loader2,
  Search,
  Users,
  X,
  UserRound,
  BookOpen,
  CalendarCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    apiFetch("/api/portal/students")
      .then((r) => setStudents(r.data || []))
      .catch((e) => setError(e.message || "Failed to load students"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return students;

    return students.filter((s) =>
      `${s.name} ${s.studentId || ""} ${s.courseId?.title || ""} ${
        s.batchId?.name || ""
      }`
        .toLowerCase()
        .includes(search)
    );
  }, [students, query]);

  const getInitials = (name = "") => {
    return (
      name
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("") || "S"
    );
  };

  const getAttendanceClass = (percentage = 0) => {
    if (percentage >= 75) {
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    }

    if (percentage >= 50) {
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    }

    return "bg-red-50 text-red-700 ring-1 ring-red-200";
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50/40">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Users size={14} />
              Learner Directory
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              My Students
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View students enrolled in your assigned courses and batches.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Users size={26} />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Students
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {students.length}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Users size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Showing
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {filtered.length}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Search size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assigned Learners
              </p>
              <p className="mt-2 text-sm font-bold text-slate-700">
                Your courses & batches
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <BookOpen size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by student name, ID, course or batch..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-black text-slate-900">Student List</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filtered.length} student{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80">
              <tr className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Student ID</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Batch</th>
                <th className="px-5 py-4">Attendance</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <Loader2 className="mx-auto animate-spin text-blue-600" size={25} />
                    <p className="mt-3 text-sm font-medium text-slate-500">
                      Loading students...
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const attendance = Number(s.attendancePercentage || 0);

                  return (
                    <tr
                      key={s._id}
                      className="group transition hover:bg-slate-50/70"
                    >
                      {/* Student */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-black text-blue-700">
                            {getInitials(s.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-900">
                              {s.name || "Unnamed Student"}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              Student
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-600">
                          {s.studentId || "-"}
                        </span>
                      </td>

                      {/* Course */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen size={15} className="text-blue-500" />
                          <span className="font-semibold text-slate-700">
                            {s.courseId?.title || "-"}
                          </span>
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-600">
                          {s.batchId?.name || "-"}
                        </span>
                      </td>

                      {/* Attendance */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${getAttendanceClass(
                            attendance
                          )}`}
                        >
                          <CalendarCheck size={13} />
                          {attendance}%
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelected(s)}
                            title="View student"
                            className="inline-flex items-center justify-center rounded-xl bg-blue-50 p-2.5 text-blue-700 transition hover:bg-blue-100"
                          >
                            <Eye size={16} />
                          </button>

                          <Link
                            to={`/teacher/students/${s._id}/certificate`}
                            title="View certificate"
                            className="inline-flex items-center justify-center rounded-xl bg-orange-50 p-2.5 text-orange-700 transition hover:bg-orange-100"
                          >
                            <Award size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {!loading && !filtered.length && (
                <tr>
                  <td colSpan="6" className="p-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Users size={25} />
                    </div>

                    <p className="mt-4 font-bold text-slate-700">
                      No students found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Try searching with a different name, ID, course or batch.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <Loader2
              className="mx-auto animate-spin text-blue-600"
              size={25}
            />
            <p className="mt-3 text-sm text-slate-500">
              Loading students...
            </p>
          </div>
        ) : (
          filtered.map((s) => {
            const attendance = Number(s.attendancePercentage || 0);

            return (
              <div
                key={s._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-black text-blue-700">
                      {getInitials(s.name)}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-black text-slate-900">
                        {s.name || "Unnamed Student"}
                      </h3>

                      <p className="mt-1 font-mono text-xs text-slate-400">
                        ID: {s.studentId || "-"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${getAttendanceClass(
                      attendance
                    )}`}
                  >
                    {attendance}%
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Course
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-slate-700">
                      {s.courseId?.title || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Batch
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-slate-700">
                      {s.batchId?.name || "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(s)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                  >
                    <Eye size={15} />
                    View
                  </button>

                  <Link
                    to={`/teacher/students/${s._id}/certificate`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-50 py-2.5 text-xs font-black text-orange-700 transition hover:bg-orange-100"
                  >
                    <Award size={15} />
                    Certificate
                  </Link>
                </div>
              </div>
            );
          })
        )}

        {!loading && !filtered.length && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Users size={25} />
            </div>

            <p className="mt-4 font-bold text-slate-700">No students found</p>

            <p className="mt-1 text-sm text-slate-400">
              Try a different search.
            </p>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4 pr-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-black ring-1 ring-white/20">
                  {getInitials(selected.name)}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-black">
                    {selected.name || "Unnamed Student"}
                  </h2>

                  {/* Email intentionally NOT shown */}
                  <p className="mt-1 font-mono text-xs text-blue-100">
                    Student ID: {selected.studentId || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
                      <BookOpen size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Course
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {selected.courseId?.title || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-purple-100 p-2.5 text-purple-600">
                      <UserRound size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Batch
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {selected.batchId?.name || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">
                      <CalendarCheck size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Attendance
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-black ${getAttendanceClass(
                          Number(selected.attendancePercentage || 0)
                        )}`}
                      >
                        {selected.attendancePercentage || 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-100 p-2.5 text-orange-600">
                      <Users size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Status
                      </p>
                      <p className="mt-1 font-bold capitalize text-slate-800">
                        {selected.status || "active"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Close
                </button>

                <Link
                  to={`/teacher/students/${selected._id}/certificate`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  <Award size={16} />
                  Certificate
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;
