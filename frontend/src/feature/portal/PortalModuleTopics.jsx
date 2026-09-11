import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { apiFetch } from "../../utils/api";

const PortalModuleTopics = () => {
  const { courseId, moduleId } = useParams();
  const location = useLocation();
  const portal = location.pathname.startsWith("/teacher") ? "teacher" : location.pathname.startsWith("/student") ? "student" : "franchise";
  const [topics, setTopics] = useState([]);
  const [module, setModule] = useState(null);
  const [state, setState] = useState({ loading: true, error: "" });

  useEffect(() => {
    Promise.all([
      apiFetch(`/api/topics?moduleId=${moduleId}`),
      apiFetch(`/api/modules/${moduleId}`),
    ])
      .then(([topicsResponse, moduleResponse]) => {
        setTopics(topicsResponse.data || []);
        setModule(moduleResponse.data || null);
        setState({ loading: false, error: "" });
      })
      .catch((error) => setState({ loading: false, error: error.message || "Unable to load topics" }));
  }, [moduleId]);

  if (state.loading) return <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" /> Loading topics...</div>;
  if (state.error) return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.error}</p>;

  return <section className="space-y-6 pb-10">
    <Link to={`/${portal}/courses/${courseId}`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600"><ArrowLeft size={16} /> Back to modules</Link>
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Module topics</p><h1 className="mt-1 text-2xl font-black text-slate-900">{module?.title || "Topics"}</h1><p className="mt-2 text-sm text-slate-500">Open a topic to view its complete content.</p></header>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Order</th><th className="px-5 py-4">Topic</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Duration</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{topics.map((topic, index) => <tr key={topic._id} className="hover:bg-slate-50"><td className="px-5 py-4"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 font-black text-blue-700">{topic.order || index + 1}</span></td><td className="px-5 py-4 font-black text-slate-900">{topic.title}</td><td className="px-5 py-4 text-xs font-semibold text-slate-600">{topic.type || "Lesson"}</td><td className="px-5 py-4 text-xs text-slate-600">{topic.duration?.value || 0} {topic.duration?.unit || "minutes"}</td><td className="px-5 py-4 text-right"><Link to={`/${portal}/courses/${courseId}/modules/${moduleId}/topics/${topic._id}`} className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">View topic <ChevronRight size={14} /></Link></td></tr>)}{!topics.length && <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">No topics found.</td></tr>}</tbody></table></div>
  </section>;
};

export default PortalModuleTopics;
