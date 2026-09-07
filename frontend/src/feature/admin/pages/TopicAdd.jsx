import React, { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Clock3, FileText, Layers3, Loader2, Pencil, Plus, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const emptyForm = { title: "", description: "", type: "Lesson", durationValue: 0, durationUnit: "minutes", order: 1 };

export default function TopicAdd() {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const isEditMode = Boolean(topicId);
  const [modules, setModules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [moduleId, setModuleId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/modules").then((response) => setModules(response.data || [])).catch((loadError) => setError(loadError.message));
  }, []);

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

  const updateForm = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!moduleId || !form.title.trim()) {
      setError("Please select a module and enter a topic title.");
      return;
    }
    try {
      setLoading(true);
      const response = await apiFetch(isEditMode ? `/api/topics/${topicId}` : "/api/topics", {
        method: isEditMode ? "PUT" : "POST",
        body: JSON.stringify({
          moduleId,
          title: form.title,
          description: form.description,
          type: form.type,
          order: Number(form.order),
          duration: { value: Number(form.durationValue), unit: form.durationUnit },
        }),
      });
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
        <button onClick={() => navigate("/admin/courses/modules")} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-500">
          <ArrowLeft className="h-4 w-4" /> Back to Modules
        </button>
        <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">Curriculum builder</span>
      </div>

      <div className="rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300">Courses / Modules / Topics</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{isEditMode ? "Edit Topic" : "Add a new topic"}</h1><p className="mt-2 max-w-xl text-sm text-slate-300">{isEditMode ? "Update the lesson content, format and position in your syllabus." : "Create a focused learning item and place it inside the right module."}</p></div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300"><Sparkles className="h-4 w-4 text-orange-300" /> Build clear learning paths</div>
        </div>
      </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">{isEditMode ? <Pencil className="h-5 w-5 text-orange-500" /> : <BookOpen className="h-5 w-5 text-orange-500" />}<div><h2 className="font-extrabold text-slate-900">Topic information</h2><p className="mt-1 text-xs text-slate-500">Give this topic a clear place in the curriculum.</p></div></div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Module *<select value={moduleId} onChange={(event) => setModuleId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-slate-800 outline-none transition focus:border-orange-500 focus:bg-white"><option value="">Select module</option>{modules.map((module) => <option key={module._id} value={module._id}>{module.title}</option>)}</select></label>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Topic title *<input required name="title" value={form.title} onChange={updateForm} placeholder="e.g. Introduction to semantic HTML" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-orange-500 focus:bg-white" /></label>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Description<textarea name="description" value={form.description} onChange={updateForm} rows="5" placeholder="What will students learn in this topic?" className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal normal-case tracking-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white" /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Content type<select name="type" value={form.type} onChange={updateForm} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-slate-800 outline-none focus:border-orange-500"><option>Lesson</option><option>Video</option><option>PDF</option><option>Assignment</option><option>Test</option></select></label><label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Topic order<input name="order" type="number" min="1" value={form.order} onChange={updateForm} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal outline-none focus:border-orange-500" /></label></div>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Duration<input name="durationValue" type="number" min="0" value={form.durationValue} onChange={updateForm} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal outline-none focus:border-orange-500" /></label><label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Unit<select name="durationUnit" value={form.durationUnit} onChange={updateForm} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal outline-none focus:border-orange-500"><option value="minutes">Minutes</option><option value="hours">Hours</option><option value="days">Days</option></select></label></div>
            <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-50">{isEditMode ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{loading ? "Saving..." : isEditMode ? "Save Topic" : "Add Topic"}</button>
          </form>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-500">Current syllabus</p><h2 className="mt-2 text-xl font-extrabold text-slate-900">Topics in this module</h2></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500"><Layers3 className="h-5 w-5" /></div></div>{!moduleId ? <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center"><BookOpen className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-600">Select a module to see its topics.</p><p className="mt-1 text-xs text-slate-400">Your new topic will be added to this list.</p></div> : topics.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center"><FileText className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-600">No topics yet</p><p className="mt-1 text-xs text-slate-400">Create the first learning item for this module.</p></div> : <div className="mt-6 space-y-3">{topics.map((topic) => <button key={topic._id} onClick={() => navigate(`/admin/topics/${topic._id}`)} className="group flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-extrabold text-orange-600 shadow-sm">{topic.order}</span><span className="min-w-0 flex-1"><b className="block truncate text-sm text-slate-800 group-hover:text-orange-700">{topic.title}</b><small className="mt-1 flex items-center gap-1 text-xs text-slate-400"><Clock3 className="h-3 w-3" /> {topic.duration?.value || 0} {topic.duration?.unit || "minutes"} <span className="mx-1">·</span> {topic.type}</small></span><ArrowLeft className="h-4 w-4 rotate-180 text-slate-300 transition group-hover:text-orange-500" /></button>)}</div>}</section>
        </div>
      </div>
  );
}
