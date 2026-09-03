import React, { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Clock, FileText, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const formatDuration = (duration) =>
  duration && typeof duration === "object"
    ? `${duration.value || 0} ${duration.unit || "minutes"}`
    : duration || "0 minutes";

export default function TopicView() {
  const { topicId } = useParams();
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
    return <div className="flex min-h-100 items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;
  }

  if (error || !topic) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error || "Topic not found"}</div>;
  }

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      <Link to="/admin/courses/modules" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600">
        <ArrowLeft className="h-4 w-4" /> Back to Modules
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">Topic View</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{topic.title}</h1>
            <p className="mt-2 text-xs text-slate-500">{topic.moduleId?.courseId?.title || "Course"} / {topic.moduleId?.title || "Module"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><BookOpen className="mb-1 h-4 w-4 text-orange-500" />Type: <b>{topic.type}</b></div>
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><Clock className="mb-1 h-4 w-4 text-orange-500" />Duration: <b>{formatDuration(topic.duration)}</b></div>
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">Order: <b>{topic.order}</b></div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <h2 className="text-sm font-bold text-slate-900">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{topic.description || "No description added yet."}</p>
        </div>
      </div>
    </div>
  );
}