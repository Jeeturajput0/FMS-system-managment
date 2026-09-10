import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckSquare,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const FranchiseBatchStudents = () => {
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get("batchId");
  const [batch, setBatch] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [assignedSearch, setAssignedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [showAddStudents, setShowAddStudents] = useState(false);

  const loadBatch = async () => {
    if (!batchId) {
      setError("No batch was selected.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await apiFetch(`/api/batches/${batchId}`);
      const selectedBatch = response.batch;
      setBatch(selectedBatch);

      // Load the franchise students, then show only this batch's course below.
      const studentsResponse = await apiFetch("/api/students?limit=1000");
      setAvailableStudents(studentsResponse.data || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load batch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatch();
  }, [batchId]);

  const assignedStudents = useMemo(() => {
    const query = assignedSearch.trim().toLowerCase();
    const students = batch?.students || [];

    if (!query) return students;

    return students.filter((student) =>
      [student.name, student.studentId, student.email, student.mobile].some(
        (value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
      ),
    );
  }, [batch, assignedSearch]);

  const unassignedStudents = useMemo(() => {
    const assignedIds = new Set(
      (batch?.students || []).map((student) => String(student._id || student)),
    );
    const batchCourseId = String(batch?.course?._id || batch?.course || "");
    return availableStudents
      .filter((student) => !assignedIds.has(String(student._id)))
      .filter(
        (student) =>
          String(student.courseId?._id || student.courseId || "") ===
          batchCourseId,
      );
  }, [availableStudents, batch]);

  const visibleStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return unassignedStudents;
    return unassignedStudents.filter((student) =>
      [student.name, student.studentId, student.email, student.mobile].some(
        (value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
      ),
    );
  }, [unassignedStudents, search]);

  const toggleStudent = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = visibleStudents.map((student) => String(student._id));
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) =>
      allSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])],
    );
  };

  const addStudents = async (event) => {
    event.preventDefault();
    if (!selectedIds.length || !batchId) return;

    try {
      setAdding(true);
      setError("");
      await apiFetch(`/api/batches/${batchId}/students`, {
        method: "POST",
        body: JSON.stringify({ studentIds: selectedIds }),
      });
      setSelectedIds([]);
      await loadBatch();
    } catch (requestError) {
      setError(requestError.message || "Unable to add student");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading batch students...
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="space-y-4">
        <Link
          to="/franchise/batches"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600"
        >
          <ArrowLeft size={16} /> Back to batches
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error || "Batch not found"}
        </div>
      </div>
    );
  }

  const courseName =
    batch.course?.title || batch.course?.name || "Course not assigned";
  const teacherName = batch.teacher?.name || "Teacher not assigned";
  const schedule =
    [batch.startTime, batch.endTime].filter(Boolean).join(" - ") ||
    "Time not set";
  const days = batch.days?.length ? batch.days.join(", ") : "Days not set";

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Link
        to="/franchise/batches"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft size={16} /> Back to batches
      </Link>

      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
          Batch students
        </p>
        <h1 className="mt-2 text-2xl font-black">{batch.name}</h1>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-blue-100">
          <span>Code: {batch.code || "-"}</span>
          <span>Course: {courseName}</span>
          <span>{batch.students?.length || 0} students</span>
        </div>
        <div className="mt-5 grid gap-2 text-xs text-blue-50 sm:grid-cols-2 lg:grid-cols-4">
          <span className="rounded-lg bg-white/10 px-3 py-2">
            Teacher: {teacherName}
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-2">
            Schedule: {schedule}
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-2">Days: {days}</span>
          <span className="rounded-lg bg-white/10 px-3 py-2">
            Capacity: {batch.students?.length || 0}/{batch.maxStudents || 0}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header / Accordion Button */}
        <button
          type="button"
          onClick={() => setShowAddStudents((prev) => !prev)}
          className="flex w-full items-center justify-between gap-4 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50"
        >
          <div className="min-w-0">
            <h2 className="font-black text-slate-900">
              Add students from {courseName}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Students already assigned to this batch are hidden. Select
              multiple students at once.
            </p>
          </div>

          {/* Arrow */}
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-transform duration-300 ${
              showAddStudents ? "rotate-180" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>

        {/* Expandable Content */}
        {showAddStudents && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Search */}
            <div className="border-b border-slate-100 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Select Students</h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Select one or multiple students to add to this batch.
                  </p>
                </div>

                <div className="relative sm:w-72">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search course students..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Select All */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
              <button
                type="button"
                onClick={toggleAllVisible}
                disabled={!visibleStudents.length}
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 transition hover:text-blue-700 disabled:text-slate-400"
              >
                <CheckSquare size={16} />
                Select all visible
              </button>

              <span className="text-xs font-semibold text-slate-500">
                {selectedIds.length} selected · {unassignedStudents.length}{" "}
                available
              </span>
            </div>

            {/* Students List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {visibleStudents.length ? (
                visibleStudents.map((student) => {
                  const id = String(student._id);
                  const selected = selectedIds.includes(id);

                  return (
                    <label
                      key={id}
                      className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-blue-50/50 ${
                        selected ? "bg-blue-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleStudent(id)}
                        className="sr-only"
                      />

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          selected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {selected && <Check size={14} />}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-slate-800">
                          {student.name || "Unnamed student"}
                        </span>

                        <span className="block truncate text-xs text-slate-500">
                          {student.studentId || "No ID"} ·{" "}
                          {student.mobile || "No mobile"}
                        </span>
                      </span>
                    </label>
                  );
                })
              ) : (
                <div className="px-4 py-10 text-center text-sm text-slate-500">
                  {unassignedStudents.length
                    ? "No students match your search."
                    : `No unassigned ${courseName} students available.`}
                </div>
              )}
            </div>

            {/* Add Button */}
            <form
              onSubmit={addStudents}
              className="flex justify-end border-t border-slate-100 p-4"
            >
              <button
                type="submit"
                disabled={!selectedIds.length || adding}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {adding ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                Add {selectedIds.length || ""} student
                {selectedIds.length === 1 ? "" : "s"}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-black text-slate-900">
            {batch.name} — Student List
          </h2>
          <div className="relative sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={assignedSearch}
              onChange={(event) => setAssignedSearch(event.target.value)}
              placeholder="Search students..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">S.No.</th>
                <th className="px-5 py-3">Student name</th>
                <th className="px-5 py-3">Student ID</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Mobile</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignedStudents.length ? (
                assignedStudents.map((student, index) => (
                  <tr
                    key={student._id || student.studentId}
                    className="hover:bg-blue-50/30"
                  >
                    <td className="px-5 py-4 font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {student.name || "-"}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-600">
                      {student.studentId || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {student.courseId?.title ||
                        student.courseId?.name ||
                        courseName}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {student.mobile || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        {student.status || "registered"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No students are assigned to this batch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FranchiseBatchStudents;
