import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [now] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiFetch("/api/portal/assignments");
        if (!cancelled) setAssignments(response.data || []);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Failed to load assignments");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return assignments;
    return assignments.filter((assignment) => {
      const batchName =
        assignment.batchId?.name || assignment.batchId?.code || "";
      const teacherName = assignment.createdBy?.name || "";
      return `${assignment.title || ""} ${assignment.description || ""} ${batchName} ${teacherName}`
        .toLowerCase()
        .includes(query);
    });
  }, [assignments, search]);

  const getDueLabel = (assignment) => {
    if (!assignment.dueDate) return "No deadline";
    return new Date(assignment.dueDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue = (assignment) => {
    if (!assignment.dueDate) return false;
    return new Date(assignment.dueDate).setHours(23, 59, 59, 999) < now;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold">Assignments</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and submit your assignments.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center">
          <Loader2 size={30} className="mx-auto animate-spin text-blue-600" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold">Assignments</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and submit your assignments.
          </p>
        </div>
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Assignments</h1>
        <p className="mt-1 text-sm text-slate-500">
          View and submit your assignments.
        </p>
      </div>

      {/* Search */}
      {assignments.length > 0 && (
        <div className="relative">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search assignments..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          />
        </div>
      )}

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <ClipboardList size={30} />
          </div>
          <h2 className="mt-5 text-lg font-black text-slate-800">
            {search ? "No matching assignments" : "No assignments yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {search
              ? "Try a different search."
              : "Your teacher has not given any assignment yet. Please check back later."}
          </p>
        </div>
      )}

      {/* List */}
      <div className="grid gap-4">
        {filtered.map((assignment) => {
          const overdue = isOverdue(assignment);
          const batchName =
            assignment.batchId?.name ||
            assignment.batchId?.code ||
            "All batches";
          return (
            <Link
              key={assignment._id}
              to={`/student/assignments/${assignment._id}`}
              className="group flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileText size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-black text-slate-900">
                  {assignment.title}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                  {assignment.description || "No description"} • {batchName}
                  {assignment.createdBy?.name
                    ? ` • by ${assignment.createdBy.name}`
                    : ""}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${
                      overdue
                        ? "bg-red-50 text-red-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <CalendarDays size={11} />
                    {getDueLabel(assignment)}
                    {overdue ? " • Overdue" : ""}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-600">
                    {assignment.maxMarks ?? 0} marks
                  </span>
                </div>
              </div>

              <ChevronRight
                size={20}
                className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAssignments;