import { ArrowLeft, BookOpen, Clock, FileText, Loader2, Plus, Pencil } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";

const ModuleTopics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadModule = async () => {
      try {
        const response = await apiFetch(`/api/modules/${id}`);
        setModule(response.data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [id]);

  if (loading) {
    return <div className="flex min-h-100 items-center justify-center gap-2 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /> Loading topics...</div>;
  }

  if (error || !module) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">{error || "Module not found."}</div>;
  }

  const topics = module.topics || [];

  return (
    <div className="space-y-6 pb-12">
      <button type="button" onClick={() => navigate("/admin/courses/modules")} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600">
        <ArrowLeft className="h-4 w-4" /> Back to Modules
      </button>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><BookOpen className="h-6 w-6" /></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">Module Topics</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{module.title}</h1>
            <p className="mt-1 text-xs text-slate-500">{topics.length} {topics.length === 1 ? "topic" : "topics"} in this module</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/admin/topics/add?moduleId=${id}${module.courseId?._id ? `&courseId=${module.courseId._id}` : ""}`} title="Add topic" aria-label="Add topic" className="inline-flex items-center justify-center rounded-xl bg-emerald-50 p-3 text-emerald-600 hover:bg-emerald-100"><Plus className="h-4 w-4" /></Link>
          <Link to={`/admin/modules/${id}/edit`} title="Edit module" aria-label="Edit module" className="inline-flex items-center justify-center rounded-xl bg-blue-50 p-3 text-blue-600 hover:bg-blue-100"><Pencil className="h-4 w-4" /></Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-4">#</th><th className="px-5 py-4">Topic</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Duration</th><th className="px-5 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topics.map((topic, index) => (
                <tr key={topic._id || index} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono font-bold text-slate-400">{index + 1}</td>
                  <td className="px-5 py-4"><Link to={`/admin/topics/${topic._id}`} className="font-bold text-slate-900 hover:text-orange-600">{topic.title || topic.name || "Untitled topic"}</Link><p className="mt-1 max-w-md truncate text-xs text-slate-500">{topic.description || "No description added"}</p></td>
                  <td className="px-5 py-4"><span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{topic.type || "Lesson"}</span></td>
                  <td className="px-5 py-4 text-slate-600"><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {topic.duration?.value || 0} {topic.duration?.unit || "minutes"}</span></td>
                  <td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><FileText className="h-3.5 w-3.5" /> Available</span></td>
                </tr>
              ))}
              {!topics.length && <tr><td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-500">No topics have been added to this module yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModuleTopics;
