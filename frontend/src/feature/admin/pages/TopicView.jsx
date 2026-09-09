import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Layers3,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const formatDuration = (duration) =>
  duration && typeof duration === "object"
    ? `${duration.value || 0} ${duration.unit || "minutes"}`
    : duration || "0 minutes";

export default function TopicView() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/api/topics/${topicId}`)
      .then((response) => setTopic(response.data))
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, [topicId]);

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error || "Topic not found"}
      </div>
    );
  }

  const modulePath = topic.moduleId?.courseId?._id
    ? `/admin/courses/${topic.moduleId.courseId._id}/modules`
    : "/admin/courses/modules";
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    try {
      await apiFetch(`/api/topics/${topicId}`, { method: "DELETE" });
      navigate(modulePath);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={modulePath}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Modules
        </Link>
        <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">
          Topic workspace
        </span>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-950 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/20">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300">
                  {topic.moduleId?.courseId?.title || "Course"}
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  {topic.title}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                  <Layers3 className="h-4 w-4 text-orange-300" />{" "}
                  {topic.moduleId?.title || "Module"}
                </p>
              </div>
            </div>
            <div className="flex gap-2 lg:self-start">
              <button
                type="button"
                onClick={() => navigate(`/admin/topics/${topicId}/edit`)}
                title="Edit topic"
                aria-label="Edit topic"
                className="inline-flex items-center rounded-xl bg-blue-50 p-3 text-blue-600 hover:bg-blue-100"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                title="Delete topic"
                aria-label="Delete topic"
                className="inline-flex items-center rounded-xl bg-red-50 p-3 text-red-500 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-b border-slate-100 p-6 sm:grid-cols-3 sm:p-8">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <BookOpen className="h-5 w-5 text-orange-500" />
            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Content type
            </p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">
              {topic.type}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <Clock className="h-5 w-5 text-orange-500" />
            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Estimated duration
            </p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">
              {formatDuration(topic.duration)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Syllabus position
            </p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">
              Topic {topic.order}
            </p>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_280px]">
          <article>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-500">
              Learning content
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-slate-900">
              About this topic
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {topic.description || "No description added yet."}
            </p>
          </article>
          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-bold text-slate-900">Topic details</p>
            <dl className="mt-4 space-y-4 text-xs">
              <div>
                {/* <dt className="text-slate-400">Topic ID</dt> */}
                
              </div>
              <div>
                <dt className="text-slate-400">Created</dt>
                <dd className="mt-1 font-semibold text-slate-700">
                  {topic.createdAt
                    ? new Date(topic.createdAt).toLocaleDateString("en-IN")
                    : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Last updated</dt>
                <dd className="mt-1 font-semibold text-slate-700">
                  {topic.updatedAt
                    ? new Date(topic.updatedAt).toLocaleDateString("en-IN")
                    : "-"}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </div>
  );
}
