import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
  CheckCircle2,
  BookOpen,
  Clock3,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const emptyForm = {
  title: "",
  description: "",
  courseId: "",
  batchId: "",
  dueDate: "",
  maxMarks: 10,
  status: "ACTIVE",
  attachments: [],
};

const statusMeta = {
  ACTIVE: { label: "Active", classes: "bg-emerald-50 text-emerald-700" },
  DRAFT: { label: "Draft", classes: "bg-amber-50 text-amber-700" },
  COMPLETED: { label: "Completed", classes: "bg-blue-50 text-blue-700" },
  CANCELLED: { label: "Cancelled", classes: "bg-red-50 text-red-700" },
};

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [modal, setModal] = useState(null); // null | { mode: "create" } | { mode: "edit", assignment }
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [now] = useState(() => Date.now());

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setMessage("");
      const response = await apiFetch("/api/portal/assignments");
      setAssignments(response.data || []);
    } catch (error) {
      setMessage(error.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
    apiFetch("/api/portal/teacher-batches")
      .then((response) => setBatches(response.data || []))
      .catch(() => {});
    apiFetch("/api/portal/courses")
      .then((response) => setCourses(response.data || []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     FILTERING
  ========================================================= */

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assignments.filter((assignment) => {
      if (statusFilter !== "ALL" && assignment.status !== statusFilter) {
        return false;
      }
      if (!query) return true;
      const batchName =
        assignment.batchId?.name ||
        assignment.batchId?.code ||
        assignment.batchName ||
        "";
      return `${assignment.title || ""} ${batchName} ${assignment.description || ""}`
        .toLowerCase()
        .includes(query);
    });
  }, [assignments, search, statusFilter]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getBatchName = (assignment) =>
    assignment.batchId?.name ||
    assignment.batchId?.code ||
    assignment.batchName ||
    "All batches";

  const getCourseName = (assignment) =>
    assignment.courseId?.title ||
    assignment.courseId?.name ||
    assignment.courseName ||
    assignment.batchId?.course?.title ||
    assignment.batchId?.course?.name ||
    "Course";

  const getDueLabel = (assignment) => {
    if (!assignment.dueDate) return "No deadline";
    const date = new Date(assignment.dueDate);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue = (assignment) => {
    if (!assignment.dueDate) return false;
    return (
      new Date(assignment.dueDate).setHours(23, 59, 59, 999) < now &&
      assignment.status === "ACTIVE"
    );
  };

  /* =========================================================
     MODAL OPEN / CLOSE
  ========================================================= */

  const openCreate = () => {
    setForm(emptyForm);
    setFormError("");
    setModal({ mode: "create" });
  };

  const openEdit = (assignment) => {
    setForm({
      title: assignment.title || "",
      description: assignment.description || "",
      courseId: assignment.courseId?._id || assignment.courseId || "",
      batchId: assignment.batchId?._id || assignment.batchId || "",
      dueDate: assignment.dueDate
        ? new Date(assignment.dueDate).toISOString().slice(0, 10)
        : "",
      maxMarks: assignment.maxMarks ?? 10,
      status: assignment.status || "ACTIVE",
      attachments: assignment.attachments || [],
    });
    setFormError("");
    setModal({ mode: "edit", assignment });
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
    setForm(emptyForm);
    setFormError("");
  };

  /* =========================================================
     SAVE (CREATE / EDIT)
  ========================================================= */

  const updateField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      setFormError("Assignment title is required.");
      return;
    }
    setSaving(true);
    setFormError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      courseId: form.courseId || null,
      batchId: form.batchId || null,
      dueDate: form.dueDate || null,
      maxMarks: Number(form.maxMarks) || 0,
      status: form.status,
      attachments: form.attachments,
    };

    try {
      if (modal.mode === "create") {
        await apiFetch("/api/portal/assignments", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Assignment created successfully.");
      } else {
        await apiFetch(`/api/portal/assignments/${modal.assignment._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Assignment updated successfully.");
      }
      closeModal();
      await loadAssignments();
    } catch (error) {
      setFormError(error.message || "Failed to save assignment");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const confirmDelete = (assignment) => setDeleteTarget(assignment);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/portal/assignments/${deleteTarget._id}`, {
        method: "DELETE",
      });
      setMessage("Assignment deleted successfully.");
      setDeleteTarget(null);
      await loadAssignments();
    } catch (error) {
      setMessage(error.message || "Failed to delete assignment");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================================
     INPUT CLASS
  ========================================================= */

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-full space-y-6 bg-slate-50/40">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              <ClipboardList size={14} />
              Assignment Management
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Assignments
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create, edit and manage assignments for your students.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Assignment
          </button>
        </div>
      </div>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${
            message.toLowerCase().includes("success")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Total Assignments
                </p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {assignments.length}
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <ClipboardList size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-emerald-500">
                  Active
                </p>
                <p className="mt-2 text-3xl font-black text-emerald-700">
                  {assignments.filter((a) => a.status === "ACTIVE").length}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-amber-500">
                  Drafts
                </p>
                <p className="mt-2 text-3xl font-black text-amber-700">
                  {assignments.filter((a) => a.status === "DRAFT").length}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <FileText size={21} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
          <Loader2 size={30} className="mx-auto animate-spin text-blue-600" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading assignments...
          </p>
        </div>
      )}

      {/* =====================================================
          LIST
      ===================================================== */}

      {!loading && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* TOOLBAR */}
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Assignment List
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {filteredAssignments.length} of {assignments.length}{" "}
                  assignments shown
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="ALL">All Status</option>
                  {Object.entries(statusMeta).map(([value, meta]) => (
                    <option key={value} value={value}>
                      {meta.label}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search assignments..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* EMPTY STATE */}
          {filteredAssignments.length === 0 && (
            <div className="p-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <ClipboardList size={30} />
              </div>
              <h2 className="mt-5 text-lg font-black text-slate-800">
                {search || statusFilter !== "ALL"
                  ? "No matching assignments"
                  : "No assignments yet"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search || statusFilter !== "ALL"
                  ? "Try adjusting your search or filter."
                  : "Create your first assignment for your students."}
              </p>
            </div>
          )}

          {/* DESKTOP TABLE */}
          {filteredAssignments.length > 0 && (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50/80">
                    <tr className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Assignment</th>
                      <th className="px-6 py-4">Batch</th>
                      <th className="px-6 py-4">Course</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Marks</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredAssignments.map((assignment, index) => {
                      const status = statusMeta[assignment.status] || statusMeta.ACTIVE;
                      const overdue = isOverdue(assignment);

                      return (
                        <tr
                          key={assignment._id}
                          className="transition hover:bg-slate-50/70"
                        >
                          <td className="px-6 py-4 text-xs font-bold text-slate-400">
                            {String(index + 1).padStart(2, "0")}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <FileText size={18} />
                              </div>
                              <div className="min-w-0">
                                <p className="max-w-[240px] truncate font-black text-slate-900">
                                  {assignment.title}
                                </p>
                                <p className="mt-0.5 line-clamp-1 max-w-[240px] text-xs text-slate-400">
                                  {assignment.description || "No description"}
                                </p>
                                {assignment.createdBy?.name && (
                                  <p className="mt-0.5 max-w-[240px] truncate text-[10px] font-bold text-slate-400">
                                    by {assignment.createdBy.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700">
                              <Users size={13} />
                              {getBatchName(assignment)}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="max-w-[160px] truncate inline-block text-xs font-bold text-slate-600">
                              {getCourseName(assignment)}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays
                                size={14}
                                className={
                                  overdue
                                    ? "text-red-500"
                                    : "text-slate-400"
                                }
                              />
                              <span
                                className={`text-xs font-bold ${
                                  overdue ? "text-red-600" : "text-slate-600"
                                }`}
                              >
                                {getDueLabel(assignment)}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-600">
                              {assignment.maxMarks ?? 0}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ${status.classes}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {status.label}
                              {overdue && (
                                <span className="font-bold text-red-600">
                                  • Overdue
                                </span>
                              )}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(assignment)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => confirmDelete(assignment)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-100"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredAssignments.map((assignment, index) => {
                  const status = statusMeta[assignment.status] || statusMeta.ACTIVE;
                  const overdue = isOverdue(assignment);

                  return (
                    <div key={assignment._id} className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FileText size={19} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-slate-900">
                              {assignment.title}
                            </p>
                            <p className="mt-1 font-mono text-[11px] text-slate-400">
                              #{String(index + 1).padStart(2, "0")}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => confirmDelete(assignment)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-xs">
                        <div>
                          <p className="font-bold text-slate-400">Batch</p>
                          <p className="mt-1 font-black text-slate-700">
                            {getBatchName(assignment)}
                          </p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-400">Marks</p>
                          <p className="mt-1 font-black text-slate-700">
                            {assignment.maxMarks ?? 0}
                          </p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-400">Due Date</p>
                          <p
                            className={`mt-1 font-black ${
                              overdue ? "text-red-600" : "text-slate-700"
                            }`}
                          >
                            {getDueLabel(assignment)}
                          </p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-400">Status</p>
                          <span
                            className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ${status.classes}`}
                          >
                            {status.label}
                            {overdue && " • Overdue"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openEdit(assignment)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                      >
                        <Pencil size={14} />
                        Edit Assignment
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {modal.mode === "create"
                    ? "Create Assignment"
                    : "Edit Assignment"}
                </h3>
                <p className="text-xs text-slate-500">
                  {modal.mode === "create"
                    ? "Add a new assignment for your students"
                    : "Update the assignment details"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="space-y-5 p-6">
              {formError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {formError}
                </div>
              )}

              {/* TITLE */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Assignment Title *
                </label>
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="e.g. Chapter 5 Assignment"
                  className={inputClass}
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  rows={4}
                  placeholder="Add instructions or details about this assignment..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* COURSE & BATCH */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                    Course
                  </label>
                  <select
                    value={form.courseId}
                    onChange={(event) =>
                      updateField("courseId", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title || course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                    Batch
                  </label>
                  <select
                    value={form.batchId}
                    onChange={(event) => {
                      const batch = batches.find(
                        (item) =>
                          String(item._id) === String(event.target.value)
                      );
                      updateField("batchId", event.target.value);
                      if (batch?.course?._id && !form.courseId) {
                        updateField("courseId", batch.course._id);
                      }
                    }}
                    className={inputClass}
                  >
                    <option value="">All batches</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                        {batch.code ? ` (${batch.code})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DUE DATE, MARKS, STATUS */}
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
                    <CalendarDays size={13} />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      updateField("dueDate", event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
                    <Clock3 size={13} />
                    Max Marks
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.maxMarks}
                    onChange={(event) =>
                      updateField("maxMarks", event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                    className={inputClass}
                  >
                    {Object.entries(statusMeta).map(([value, meta]) => (
                      <option key={value} value={value}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-xs font-semibold leading-5 text-blue-700">
                <BookOpen size={16} className="mt-0.5 shrink-0" />
                Students in the selected batch will be able to see and submit
                this assignment.
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    {modal.mode === "create"
                      ? "Create Assignment"
                      : "Save Changes"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 size={26} />
            </div>

            <h3 className="mt-5 text-center text-lg font-black text-slate-900">
              Delete Assignment?
            </h3>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <b className="text-slate-700">{deleteTarget.title}</b>? This
              action cannot be undone.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-red-100 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignments;