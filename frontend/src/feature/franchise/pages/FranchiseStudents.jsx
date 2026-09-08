import React, { useEffect, useState } from "react";
import { Edit, Eye, Loader2, Plus, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const courseName = (course) => course?.title || course?.name || "Not assigned";

export const FranchiseStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
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

  useEffect(() => {
    loadStudents();
    apiFetch("/api/portal/courses")
      .then((response) => setCourses(response.data || []))
      .catch(() => {});
  }, []);

  const removeStudent = async (student) => {
    if (!window.confirm(`Deactivate ${student.name}?`)) return;
    try {
      await apiFetch(`/api/students/${student._id}`, { method: "DELETE" });
      await loadStudents();
    } catch (requestError) {
      setError(requestError.message || "Unable to deactivate student");
    }
  };

  const filteredStudents = students.filter((student) => {
    const value = search.trim().toLowerCase();
    const courseId = String(student.courseId?._id || student.courseId || "");
    return (
      (!selectedCourses.length || selectedCourses.includes(courseId)) &&
      (!value ||
        [student.name, student.email, student.mobile, student.studentId].some(
          (field) =>
            String(field || "")
              .toLowerCase()
              .includes(value),
        ))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Students</h1>
          <p className="mt-2 text-sm text-slate-500">
            Only students enrolled at your franchise are shown.
          </p>
        </div>
        <Link
          to="/franchise/students/add"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
        >
          <Plus size={17} /> Add Student
        </Link>
      </div>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-[1fr_280px]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, phone, email or student ID"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
        <select
          multiple
          value={selectedCourses}
          onChange={(event) =>
            setSelectedCourses(
              [...event.target.selectedOptions]
                .map((option) => option.value)
                .filter(Boolean),
            )
          }
          className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">All courses</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title || course.name}
            </option>
          ))}
        </select>
      </div>
      {id && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          Viewing student profile:{" "}
          {students.find((student) => student._id === id)?.name || id}
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Course</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center">
                    <Loader2 className="mx-auto animate-spin text-blue-600" />
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">
                        {student.studentId || student._id}
                      </p>
                    </td>
                    <td className="p-4">{student.mobile}</td>
                    <td className="p-4">{student.email || "-"}</td>
                    <td className="p-4">{courseName(student.courseId)}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          title="View"
                          aria-label="View student"
                          to={`/franchise/students/${student._id}`}
                          className="rounded-lg bg-slate-100 p-2 text-slate-600"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          title="Edit"
                          aria-label="Edit student"
                          to={`/franchise/students/${student._id}/edit`}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          title="Deactivate"
                          aria-label="Delete student"
                          onClick={() => removeStudent(student)}
                          className="rounded-lg bg-red-50 p-2 text-red-600"
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
      </div>
    </div>
  );
};
