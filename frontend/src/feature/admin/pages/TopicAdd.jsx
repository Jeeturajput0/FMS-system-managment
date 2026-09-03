import React, { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const emptyForm = { title: "", description: "", type: "Lesson", durationValue: 0, durationUnit: "minutes", order: 1 };

export default function TopicAdd() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/courses").then((response) => setCourses(response.data || [])).catch((loadError) => setError(loadError.message));
  }, []);

  useEffect(() => {
    setModuleId("");
    setModules([]);
    setTopics([]);
    if (!courseId) return;
    apiFetch(`/api/modules/course/${courseId}`)
      .then((response) => setModules(response.data || []))
      .catch((loadError) => setError(loadError.message));
  }, [courseId]);

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
      setError("Please select a course, module and enter a topic title.");
      return;
    }
    try {
      setLoading(true);
      const response = await apiFetch("/api/topics", {
        method: "POST",
        body: JSON.stringify({
          moduleId,
          title: form.title,
          description: form.description,
          type: form.type,
          order: Number(form.order),
          duration: { value: Number(form.durationValue), unit: form.durationUnit },
        }),
      });
      setTopics((previous) => [...previous, response.data]);
      setForm(emptyForm);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <button onClick={() => navigate("/admin/courses/modules")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-500">
          <ArrowLeft className="h-4 w-4" /> Back to Modules
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">Courses / Modules / Topics</p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Add Topic</h1>
          <p className="mt-1 text-sm text-slate-500">Select a course first, then choose its module.</p>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4"><BookOpen className="h-5 w-5 text-orange-500" /><h2 className="font-bold text-slate-900">Topic Information</h2></div>
            <label className="block text-sm font-bold text-slate-700">Course *<select value={courseId} onChange={(event) => setCourseId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-normal outline-none focus:border-orange-500"><option value="">Select course</option>{courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}</select></label>
            <label className="block text-sm font-bold text-slate-700">Module *<select value={moduleId} onChange={(event) => setModuleId(event.target.value)} disabled={!courseId} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-normal outline-none focus:border-orange-500 disabled:bg-slate-100"><option value="">Select module</option>{modules.map((module) => <option key={module._id} value={module._id}>{module.title}</option>)}</select></label>
            <input name="title" value={form.title} onChange={updateForm} placeholder="Topic title" className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-orange-500" />
            <textarea name="description" value={form.description} onChange={updateForm} rows="4" placeholder="Topic description" className="w-full resize-none rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-orange-500" />
            <div className="grid grid-cols-2 gap-3"><select name="type" value={form.type} onChange={updateForm} className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm"><option>Lesson</option><option>Video</option><option>PDF</option><option>Assignment</option><option>Test</option></select><input name="order" type="number" min="1" value={form.order} onChange={updateForm} className="rounded-xl border border-slate-300 px-3 py-3 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3"><input name="durationValue" type="number" min="0" value={form.durationValue} onChange={updateForm} className="rounded-xl border border-slate-300 px-3 py-3 text-sm" /><select name="durationUnit" value={form.durationUnit} onChange={updateForm} className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm"><option value="minutes">Minutes</option><option value="hours">Hours</option><option value="days">Days</option></select></div>
            <button disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"><Plus className="h-4 w-4" />{loading ? "Saving..." : "Add Topic"}</button>
          </form>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-bold text-slate-900">Topics in Selected Module</h2>{!moduleId ? <p className="mt-4 text-sm text-slate-400">Select a course and module to see topics.</p> : topics.length === 0 ? <p className="mt-4 text-sm text-slate-400">No topics added yet.</p> : <div className="mt-4 space-y-2">{topics.map((topic) => <button key={topic._id} onClick={() => navigate(`/admin/topics/${topic._id}`)} className="block w-full rounded-xl bg-slate-50 p-3 text-left text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600">{topic.order}. {topic.title}</button>)}</div>}</section>
        </div>
      </div>
    </div>
  );
}
