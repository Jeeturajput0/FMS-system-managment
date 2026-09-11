import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Clock3, FileText, Layers3, Loader2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { apiFetch } from "../../utils/api";

const PortalTopicDetail = () => {
  const { courseId, moduleId, topicId } = useParams();
  const location = useLocation();
  const portal = location.pathname.startsWith("/teacher") ? "teacher" : location.pathname.startsWith("/student") ? "student" : "franchise";
  const [topic, setTopic] = useState(null);
  const [state, setState] = useState({ loading: true, error: "" });

  useEffect(() => {
    apiFetch(`/api/topics/${topicId}`)
      .then((response) => { setTopic(response.data); setState({ loading: false, error: "" }); })
      .catch((error) => setState({ loading: false, error: error.message || "Unable to load topic" }));
  }, [topicId]);

  if (state.loading) return <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" /> Loading topic...</div>;
  if (state.error || !topic) return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.error || "Topic not found"}</p>;

  return <section className="space-y-6 pb-10"><Link to={`/${portal}/courses/${courseId}/modules/${moduleId}/topics`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600"><ArrowLeft size={16} /> Back to topics</Link><header className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-blue-300">{topic.moduleId?.courseId?.title || "Course"}</p><h1 className="mt-2 text-3xl font-black">{topic.title}</h1><p className="mt-2 flex items-center gap-2 text-sm text-slate-300"><Layers3 size={15} /> {topic.moduleId?.title || "Module"}</p></header><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-slate-200 bg-white p-4"><BookOpen className="text-blue-600" size={19} /><p className="mt-3 text-[10px] font-bold uppercase text-slate-400">Type</p><p className="mt-1 font-black text-slate-900">{topic.type || "Lesson"}</p></div><div className="rounded-xl border border-slate-200 bg-white p-4"><Clock3 className="text-blue-600" size={19} /><p className="mt-3 text-[10px] font-bold uppercase text-slate-400">Duration</p><p className="mt-1 font-black text-slate-900">{topic.duration?.value || 0} {topic.duration?.unit || "minutes"}</p></div><div className="rounded-xl border border-slate-200 bg-white p-4"><FileText className="text-blue-600" size={19} /><p className="mt-3 text-[10px] font-bold uppercase text-slate-400">Order</p><p className="mt-1 font-black text-slate-900">Topic {topic.order || "-"}</p></div></div><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black text-slate-900">Topic content</h2><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{topic.description || "No description has been added for this topic yet."}</p></article></section>;
};

export default PortalTopicDetail;
