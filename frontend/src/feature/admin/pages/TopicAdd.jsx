import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  FileText,
  Layers3,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const emptyForm = {
  title: "",
  description: "",
  type: "Lesson",
  durationValue: 0,
  durationUnit: "minutes",
  order: 1,
};

export default function TopicAdd() {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const [searchParams] = useSearchParams();
  const isEditMode = Boolean(topicId);
  const [modules, setModules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [moduleId, setModuleId] = useState(searchParams.get("moduleId") || "");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/modules")
      .then((response) => {
        const availableModules = response.data || [];
        setModules(availableModules);
        const requestedModuleId = searchParams.get("moduleId");
        if (!isEditMode && requestedModuleId && availableModules.some((module) => module._id === requestedModuleId)) {
          setModuleId(requestedModuleId);
        }
      })
      .catch((loadError) => setError(loadError.message));
  }, [isEditMode, searchParams]);

  useEffect(() => {
    if (!topicId) return;
    apiFetch(`/api/topics/${topicId}`)
      .then(({ data }) => {
        setModuleId(data.moduleId?._id || data.moduleId || "");
        setForm({
          title: data.title || "",
          description: data.description || "",
          type: data.type || "Lesson",
          durationValue: data.duration?.value || 0,
          durationUnit: data.duration?.unit || "minutes",
          order: data.order || 1,
        });
      })
      .catch((loadError) => setError(loadError.message));
  }, [topicId]);

  useEffect(() => {
    if (!moduleId) {
      setTopics([]);
      return;
    }
    apiFetch(`/api/topics?moduleId=${moduleId}`)
      .then((response) => setTopics(response.data || []))
      .catch((loadError) => setError(loadError.message));
  }, [moduleId]);

  const updateForm = (event) =>
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!moduleId || !form.title.trim()) {
      setError("Please select a module and enter a topic title.");
      return;
    }
    try {
      setLoading(true);
      const response = await apiFetch(
        isEditMode ? `/api/topics/${topicId}` : "/api/topics",
        {
          method: isEditMode ? "PUT" : "POST",
          body: JSON.stringify({
            moduleId,
            title: form.title,
            description: form.description,
            type: form.type,
            order: Number(form.order),
            duration: {
              value: Number(form.durationValue),
              unit: form.durationUnit,
            },
          }),
        },
      );
      if (isEditMode) {
        navigate(`/admin/topics/${topicId}`);
      } else {
        setTopics((previous) => [...previous, response.data]);
        setForm(emptyForm);
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/admin/courses/modules")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-500"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Modules
        </button>
     
      </div>

      

     
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            {isEditMode ? (
              <Pencil className="h-5 w-5 text-orange-500" />
            ) : (
              <BookOpen className="h-5 w-5 text-orange-500" />
            )}
            <div>
              <h2 className="font-extrabold text-slate-900">
                Topic information
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Give this topic a clear place in the curriculum.
              </p>
            </div>
          </div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
            Module *
            <select
              value={moduleId}
              onChange={(event) => setModuleId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-slate-800 outline-none transition focus:border-orange-500 focus:bg-white"
            >
              <option value="">Select module</option>
              {modules.map((module) => (
                <option key={module._id} value={module._id}>
                  {module.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
            Topic title *
            <input
              required
              name="title"
              value={form.title}
              onChange={updateForm}
              placeholder="e.g. Introduction to semantic HTML"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-orange-500 focus:bg-white"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateForm}
              rows="5"
              placeholder="What will students learn in this topic?"
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal normal-case tracking-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
              Content type
              <select
                name="type"
                value={form.type}
                onChange={updateForm}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-slate-800 outline-none focus:border-orange-500"
              >
                <option>Lesson</option>
                <option>Video</option>
                <option>PDF</option>
                <option>Assignment</option>
                <option>Test</option>
              </select>
            </label>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
              Topic order
              <input
                name="order"
                type="number"
                min="1"
                value={form.order}
                onChange={updateForm}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal outline-none focus:border-orange-500"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
              Duration
              <input
                name="durationValue"
                type="number"
                min="0"
                value={form.durationValue}
                onChange={updateForm}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal outline-none focus:border-orange-500"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
              Unit
              <select
                name="durationUnit"
                value={form.durationUnit}
                onChange={updateForm}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal outline-none focus:border-orange-500"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </label>
          </div>
          <button
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-50"
          >
            {isEditMode ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {loading ? "Saving..." : isEditMode ? "Save Topic" : "Add Topic"}
          </button>
        </form>

      </div>
    </div>
  );
}
