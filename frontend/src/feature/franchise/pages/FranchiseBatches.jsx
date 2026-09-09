import { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  Users,
  BookOpen,
  UserRound,
  CalendarDays,
  X,
  Search,
  Loader2,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { Link } from "react-router-dom";

export const FranchiseBatches = () => {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [addingStudent, setAddingStudent] = useState(false);

  // =====================================================
  // FETCH BATCHES
  // =====================================================

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch(
        "/api/batches/franchise/batches?limit=1000"
      );

      setBatches(data?.batches || []);
    } catch (err) {
      console.error("Error fetching batches:", err);

      setError(
        err?.message || "Unable to load batches"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      const response = await apiFetch(
        "/api/students?limit=100"
      );

      setStudents(response?.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchBatches();
    fetchStudents();
  }, []);

  // =====================================================
  // ADD STUDENT TO BATCH
  // =====================================================

  const addStudent = async (event) => {
    event.preventDefault();

    if (!selectedBatch || !studentId) {
      return;
    }

    try {
      setAddingStudent(true);
      setError("");

      await apiFetch(
        `/api/batches/${selectedBatch._id}/students`,
        {
          method: "POST",
          body: JSON.stringify({
            studentId,
          }),
        }
      );

      setSelectedBatch(null);
      setStudentId("");

      await fetchBatches();
    } catch (err) {
      console.error("Error adding student:", err);

      setError(
        err?.message || "Unable to add student"
      );
    } finally {
      setAddingStudent(false);
    }
  };

  // =====================================================
  // DELETE BATCH
  // =====================================================

  const removeBatch = async (batch) => {
    const batchName =
      batch?.name ||
      batch?.batchName ||
      "this batch";

    const confirmed = window.confirm(
      `Delete ${batchName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await apiFetch(
        `/api/batches/${batch._id}`,
        {
          method: "DELETE",
        }
      );

      await fetchBatches();
    } catch (err) {
      console.error("Error deleting batch:", err);

      setError(
        err?.message || "Unable to delete batch"
      );
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredBatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return batches;
    }

    return batches.filter((batch) => {
      const values = [
        batch?.name,
        batch?.batchName,
        batch?.code,

        batch?.course?.name,
        batch?.course?.title,
        batch?.courseName,

        batch?.teacher?.name,
        batch?.teacherName,

        batch?.status,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [batches, search]);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return {
          badge:
            "border-emerald-100 bg-emerald-50 text-emerald-700",
          dot: "bg-emerald-500",
        };

      case "COMPLETED":
        return {
          badge:
            "border-blue-100 bg-blue-50 text-blue-700",
          dot: "bg-blue-500",
        };

      case "CANCELLED":
        return {
          badge:
            "border-red-100 bg-red-50 text-red-700",
          dot: "bg-red-500",
        };

      case "INACTIVE":
        return {
          badge:
            "border-amber-100 bg-amber-50 text-amber-700",
          dot: "bg-amber-500",
        };

      default:
        return {
          badge:
            "border-slate-200 bg-slate-50 text-slate-600",
          dot: "bg-slate-400",
        };
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalStudents = batches.reduce(
    (total, batch) =>
      total +
      (batch?.studentCount ??
        batch?.students?.length ??
        0),
    0
  );

  const activeBatches = batches.filter(
    (batch) => batch?.status === "ACTIVE"
  ).length;

  const completedBatches = batches.filter(
    (batch) => batch?.status === "COMPLETED"
  ).length;

  return (
    <div className="min-h-full space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-100">
            <Users size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Batches
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage batches, teachers and students
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Refresh */}
          <button
            type="button"
            onClick={fetchBatches}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

          {/* Create Batch */}
          <Link
            to="/franchise/batches/add"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus size={17} />

            Create Batch
          </Link>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError("")}
            className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-100"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      {!loading && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Total Batches
                </p>

                <p className="mt-1 text-2xl font-black text-slate-900">
                  {batches.length}
                </p>
              </div>

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen size={19} />
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Active
                </p>

                <p className="mt-1 text-2xl font-black text-emerald-600">
                  {activeBatches}
                </p>
              </div>

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50">
                <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
              </div>
            </div>
          </div>

          {/* Students */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Students
                </p>

                <p className="mt-1 text-2xl font-black text-indigo-600">
                  {totalStudents}
                </p>
              </div>

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Users size={19} />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Completed
                </p>

                <p className="mt-1 text-2xl font-black text-blue-600">
                  {completedBatches}
                </p>
              </div>

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarDays size={19} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          SEARCH
      ================================================= */}

      {!loading && batches.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search batch, course or teacher..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {filteredBatches.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800">
              {batches.length}
            </span>{" "}
            batches
          </p>
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading batches...
          </p>
        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        batches.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <BookOpen size={28} />
            </div>

            <h2 className="mt-5 text-lg font-black text-slate-800">
              No batches found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              There are no batches available for this
              franchise. Create your first batch to get
              started.
            </p>

            <Link
              to="/franchise/batches/add"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Create Batch
            </Link>
          </div>
        )}

      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        !error &&
        filteredBatches.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                {/* TABLE HEADER */}
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3.5 font-bold">
                      Batch
                    </th>

                    <th className="px-5 py-3.5 font-bold">
                      Course
                    </th>

                    <th className="px-5 py-3.5 font-bold">
                      Teacher
                    </th>

                    <th className="px-5 py-3.5 font-bold">
                      Students
                    </th>

                    <th className="px-5 py-3.5 font-bold">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-right font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody className="divide-y divide-slate-100">
                  {filteredBatches.map((batch) => {
                    const batchName =
                      batch?.name ||
                      batch?.batchName ||
                      "Unnamed Batch";

                    const courseName =
                      batch?.course?.name ||
                      batch?.course?.title ||
                      batch?.courseName ||
                      "Not assigned";

                    const teacherName =
                      batch?.teacher?.name ||
                      batch?.teacherName ||
                      "Not assigned";

                    const studentCount =
                      batch?.studentCount ??
                      batch?.students?.length ??
                      0;

                    const status =
                      batch?.status || "ACTIVE";

                    const statusStyle =
                      getStatusStyle(status);

                    return (
                      <tr
                        key={
                          batch?._id ||
                          batch?.id
                        }
                        className="group transition duration-200 hover:bg-blue-50/30"
                      >
                        {/* =====================
                            BATCH
                        ===================== */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white shadow-sm">
                              {batchName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate font-bold text-slate-900">
                                {batchName}
                              </p>

                              {batch?.code && (
                                <span className="mt-1 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                  {batch.code}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* =====================
                            COURSE
                        ===================== */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple-50 text-purple-600">
                              <BookOpen size={15} />
                            </div>

                            <span className="max-w-[160px] truncate font-semibold text-slate-700">
                              {courseName}
                            </span>
                          </div>
                        </td>

                        {/* =====================
                            TEACHER
                        ===================== */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-600">
                              <UserRound size={15} />
                            </div>

                            <span className="max-w-[140px] truncate font-medium text-slate-700">
                              {teacherName}
                            </span>
                          </div>
                        </td>

                        {/* =====================
                            STUDENTS
                        ===================== */}
                        <td className="px-5 py-4">
                          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5">
                            <Users
                              size={14}
                              className="text-slate-400"
                            />

                            <span className="font-bold text-slate-700">
                              {studentCount}
                            </span>

                            <span className="text-xs text-slate-400">
                              students
                            </span>
                          </div>
                        </td>

                        {/* =====================
                            STATUS
                        ===================== */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${statusStyle.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                            />

                            {status}
                          </span>
                        </td>

                        {/* =====================
                            ACTIONS
                        ===================== */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View */}
                            <Link
                              to={`/franchise/batches/${batch._id}`}
                              title="View Batch"
                              className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-blue-100 hover:text-blue-600"
                            >
                              <Eye size={15} />
                            </Link>

                            {/* Edit */}
                            <Link
                              to={`/franchise/batches/${batch._id}/edit`}
                              title="Edit Batch"
                              className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                            >
                              <Edit size={15} />
                            </Link>

                            {/* Add Student */}
                            <Link
                              to={`/franchise/batches/students?batchId=${batch._id}`}
                              title="Add Student"
                              className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100"
                            >
                              <Plus size={15} />
                            </Link>

                            {/* Delete */}
                            <button
                              type="button"
                              title="Delete Batch"
                              onClick={() =>
                                removeBatch(batch)
                              }
                              className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* =================================================
          SEARCH EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        batches.length > 0 &&
        filteredBatches.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
              <Search
                size={24}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 font-bold text-slate-800">
              No batches found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try searching with a different batch,
              course or teacher name.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
            >
              Clear Search
            </button>
          </div>
        )}

      {/* =================================================
          ADD STUDENT MODAL
      ================================================= */}

      {selectedBatch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedBatch(null);
              setStudentId("");
            }
          }}
        >
          <form
            onSubmit={addStudent}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Add Student
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-900">
                  {selectedBatch?.name ||
                    selectedBatch?.batchName}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedBatch(null);
                  setStudentId("");
                }}
                className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Select Student
                </label>

                <select
                  required
                  value={studentId}
                  onChange={(event) =>
                    setStudentId(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">
                    Select a student
                  </option>

                  {students
                    .filter(
                      (student) =>
                        !selectedBatch?.students?.some(
                          (assigned) =>
                            String(
                              assigned?._id ||
                                assigned
                            ) ===
                            String(
                              student._id
                            )
                        )
                    )
                    .map((student) => (
                      <option
                        key={student._id}
                        value={student._id}
                      >
                        {student.name} (
                        {student.studentId ||
                          student.email ||
                          "No ID"}
                        )
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={addingStudent}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addingStudent ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={17} />

                    Add Student
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
