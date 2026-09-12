import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  Loader2,
  UserRound,
  Users,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const StudentAssignmentDetail = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiFetch("/api/portal/assignments");
        if (cancelled) return;
        const found = (response.data || []).find(
          (item) => String(item._id) === String(id),
        );
        if (!found) {
          setError("This assignment is not available for you.");
        } else {
          setAssignment(found);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Failed to load assignment");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const getDueLabel = (value) => {
    if (!value) return "No deadline";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">
          Assignment Details
        </h1>
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center">
          <Loader2 size={30} className="mx-auto animate-spin text-blue-600" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading assignment...
          </p>
        </div>
      </section>
    );
  }

  if (error || !assignment) {
    return (
      <section className="space-y-6">
        <Link
          to="/student/assignments"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to assignments
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <ClipboardList size={30} />
          </div>
          <p className="mt-5 text-sm font-bold text-slate-600">
            {error || "Assignment not found."}
          </p>
        </div>
      </section>
    );
  }

  const teacherName = assignment.createdBy?.name || "Your teacher";
  const batchName =
    assignment.batchId?.name || assignment.batchId?.code || "All batches";
  const courseName =
    assignment.courseId?.title || assignment.courseId?.name || "";

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/student/assignments"
        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft size={16} />
        Back to assignments
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FileText size={26} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
                {assignment.title}
              </h1>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                Given by {teacherName}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8 sm:pt-6">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <CalendarDays size={18} className="shrink-0 text-blue-500" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Due Date
              </p>
              <p className="mt-0.5 text-sm font-black text-slate-800">
                {getDueLabel(assignment.dueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <Award size={18} className="shrink-0 text-amber-500" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Total Marks
              </p>
              <p className="mt-0.5 text-sm font-black text-slate-800">
                {assignment.maxMarks ?? 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <Users size={18} className="shrink-0 text-indigo-500" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Batch
              </p>
              <p className="mt-0.5 text-sm font-black text-slate-800">
                {batchName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <BookOpen size={18} className="shrink-0 text-emerald-500" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Course
              </p>
              <p className="mt-0.5 text-sm font-black text-slate-800">
                {courseName || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 p-6 sm:p-8 sm:pt-6">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            Instructions
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {assignment.description || "No instructions provided."}
          </p>

          {submitMessage && (
            <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              {submitMessage}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setSubmitMessage(
                "Online submission is coming soon. Please submit this assignment to your teacher in class.",
              )
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
          >
            <UserRound size={17} />
            Submit Assignment
          </button>
        </div>
      </div>
    </section>
  );
};

export default StudentAssignmentDetail;