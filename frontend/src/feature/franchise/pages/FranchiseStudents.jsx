import React, { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Eye,
  Loader2,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  X,
  Phone,
  Mail,
  BookOpen,
  Award,
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";
import { Pagination } from "../../../components/Pagination";

const courseName = (course) =>
  course?.title || course?.name || "Not assigned";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "ST";

const getStatusStyle = (status) => {
  const value = String(status || "").toUpperCase();

  if (["ACTIVE", "ENROLLED", "APPROVED"].includes(value)) {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  if (["INACTIVE", "DEACTIVATED", "DISABLED"].includes(value)) {
    return "bg-red-50 text-red-700 border-red-100";
  }

  if (["PENDING", "PENDING_APPROVAL"].includes(value)) {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }

  return "bg-slate-50 text-slate-600 border-slate-200";
};

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
];

const getAvatarColor = (index) =>
  avatarColors[index % avatarColors.length];

export const FranchiseStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { id } = useParams();

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/api/students?limit=1000");
      setStudents(response.data || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load students");
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await apiFetch("/api/portal/courses");
      setCourses(response.data || []);
    } catch {
      // Courses are optional for the page.
    }
  };

  useEffect(() => {
    loadStudents();
    loadCourses();
  }, []);

  const removeStudent = async (student) => {
    if (!window.confirm(`Delete ${student.name}?`)) return;

    try {
      setError("");

      await apiFetch(`/api/students/${student._id}`, {
        method: "DELETE",
      });

      await loadStudents();
    } catch (requestError) {
      setError(
        requestError.message || "Unable to delete student",
      );
    }
  };

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();

    return students.filter((student) => {
      const courseId = String(
        student.courseId?._id || student.courseId || "",
      );

      const matchesCourse =
        !selectedCourse || courseId === selectedCourse;

      const matchesSearch =
        !value ||
        [
          student.name,
          student.email,
          student.mobile,
          student.studentId,
          student.courseId?.title,
          student.courseId?.name,
          student.batchId?.name,
          student.batchId?.code,
          student.status,
        ].some((field) =>
          String(field || "")
            .toLowerCase()
            .includes(value),
        );

      return matchesCourse && matchesSearch;
    });
  }, [students, search, selectedCourse]);
  const pageStudents = useMemo(() => filteredStudents.slice((page - 1) * pageSize, page * pageSize), [filteredStudents, page]);

  const stats = useMemo(() => {
    const active = students.filter((student) =>
      ["ACTIVE", "ENROLLED", "APPROVED"].includes(
        String(student.status || "").toUpperCase(),
      ),
    ).length;

    const inactive = students.filter((student) =>
      ["INACTIVE", "DEACTIVATED", "DISABLED"].includes(
        String(student.status || "").toUpperCase(),
      ),
    ).length;

    const assigned = students.filter(
      (student) => student.courseId,
    ).length;

    return {
      total: students.length,
      active,
      inactive,
      assigned,
    };
  }, [students]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCourse("");
  };

  const hasFilters = search || selectedCourse;

  return (
    <div className="min-h-full space-y-5 bg-slate-50/50 p-1">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-5 text-white shadow-lg shadow-blue-100 sm:p-6">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-100">
              <Users size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Student Management
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Students
            </h1>

            <p className="mt-1 max-w-xl text-sm text-blue-100">
              Manage students enrolled at your franchise and keep
              their academic information organized.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadStudents}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              to="/franchise/students/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              <Plus size={17} />
              Add Student
            </Link>
          </div>
        </div>
      </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Total Students
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {stats.total}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Active
                </p>
                <p className="mt-1 text-2xl font-black text-emerald-600">
                  {stats.active}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <UserCheck size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Inactive
                </p>
                <p className="mt-1 text-2xl font-black text-red-600">
                  {stats.inactive}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
                <UserX size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Course Assigned
                </p>
                <p className="mt-1 text-2xl font-black text-violet-600">
                  {stats.assigned}
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                <GraduationCap size={20} />
              </div>
            </div>
          </div>
        </div>

      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="rounded-lg p-1 hover:bg-red-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}
              placeholder="Search name, phone, email or student ID..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="relative lg:w-64">
            <BookOpen
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={selectedCourse}
              onChange={(event) => { setSelectedCourse(event.target.value); setPage(1); }}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-8 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option value="">All courses</option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title || course.name}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <X size={15} />
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <p className="text-xs font-semibold text-slate-500">
            Showing{" "}
            <span className="font-black text-slate-800">
              {filteredStudents.length}
            </span>{" "}
            of{" "}
            <span className="font-black text-slate-800">
              {students.length}
            </span>{" "}
            students
          </p>

          {hasFilters && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600">
              Filters applied
            </span>
          )}
        </div>
      </div>

      {/* Student Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/80">
              <tr>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Student
                </th>

                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Contact
                </th>

                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Course
                </th>

                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3.5 text-right text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-14 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 rounded-2xl bg-blue-50 p-4">
                        <Loader2
                          size={25}
                          className="animate-spin text-blue-600"
                        />
                      </div>

                      <p className="text-sm font-bold text-slate-700">
                        Loading students...
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Please wait a moment
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-14 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400">
                        <Users size={28} />
                      </div>

                      <h3 className="font-black text-slate-800">
                        No students found
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your search or course filter.
                      </p>

                      {hasFilters && (
                        <button
                          onClick={clearFilters}
                          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                pageStudents.map((student, index) => (
                  <tr
                    key={student._id}
                    className="border-b border-slate-100 last:border-0 transition hover:bg-blue-50/30"
                  >
                    {/* Student */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black ${getAvatarColor(
                            index,
                          )}`}
                        >
                          {getInitials(student.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900">
                            {student.name || "Unnamed Student"}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
                            ID: {student.studentId || student._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                          <Phone size={12} className="text-slate-400" />
                          {student.mobile || "-"}
                        </div>

                        <div className="flex max-w-[220px] items-center gap-1.5 truncate text-xs text-slate-400">
                          <Mail size={12} className="shrink-0" />
                          <span className="truncate">
                            {student.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="px-5 py-4">
                      <div className="inline-flex max-w-[190px] items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700">
                        <BookOpen size={13} />

                        <span className="truncate">
                          {courseName(student.courseId)}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black ${getStatusStyle(
                          student.status,
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {student.status || "Unknown"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          title="View student"
                          aria-label="View student"
                          to={`/franchise/students/${student._id}`}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                        >
                          <Eye size={15} />
                        </Link>

                        <Link
                          title="Edit student"
                          aria-label="Edit student"
                          to={`/franchise/students/${student._id}/edit`}
                          className="rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                        >
                          <Edit size={15} />
                        </Link>
                       <Link
                          title="View certificate"
                          aria-label="View certificate"
                          to={`/franchise/students/${student._id}/certificate`}
                          className="rounded-lg bg-orange-50 p-2 text-orange-600"
                        >
                          <Award size={15} />
                        </Link>

                        <button
                          title="Deactivate student"
                          aria-label="Deactivate student"
                          onClick={() => removeStudent(student)}
                          className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filteredStudents.length > 0 && (
          <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3 sm:flex-row sm:items-center">
            <p className="text-xs font-medium text-slate-500">
              {filteredStudents.length} student
              {filteredStudents.length !== 1 ? "s" : ""} displayed
            </p>

            <Link
              to="/franchise/students/add"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <Plus size={14} />
              Add another student
            </Link>
          </div>
        )}
        <Pagination page={page} pageCount={Math.ceil(filteredStudents.length / pageSize)} onPageChange={setPage} totalItems={filteredStudents.length} pageSize={pageSize} />
      </div>

      {/* Profile reference */}
      {id && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Viewing student profile:{" "}
          <span className="font-bold">
            {students.find((student) => student._id === id)?.name || id}
          </span>
        </div>
      )}
    </div>
  );
};

export default FranchiseStudents;
