import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Clock3, ChevronRight, Layers3, Loader2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { apiFetch } from "../../utils/api";

const PortalCourseDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const portal = location.pathname.startsWith("/teacher") ? "teacher" : location.pathname.startsWith("/student") ? "student" : "franchise";
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });

  useEffect(() => {
    Promise.all([apiFetch("/api/portal/courses"), apiFetch(`/api/modules/course/${id}`)])
      .then(([courseResponse, moduleResponse]) => {
        setCourse((courseResponse.data || []).find((item) => String(item._id) === String(id)) || null);
        setModules(moduleResponse.data || []);
        setState({ loading: false, error: "" });
      })
      .catch((error) => setState({ loading: false, error: error.message || "Unable to load course content" }));
  }, [id]);

  if (state.loading) return <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" /> Loading course content...</div>;
  if (state.error) return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.error}</p>;

  return <section className="space-y-6 pb-10">
    <Link to={`/${portal}/courses`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600"><ArrowLeft size={16} /> Back to courses</Link>
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start gap-3"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><BookOpen size={22} /></div><div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">{portal === "teacher" ? "Teaching course" : portal === "student" ? "Assigned course" : "Franchise course"}</p><h1 className="mt-1 text-2xl font-black text-slate-900">{course?.title || "Course content"}</h1><p className="mt-2 text-sm text-slate-500">{course?.description || "Modules and topics assigned to this course."}</p></div></div></header>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 bg-slate-50 px-5 py-4"><h2 className="font-black text-slate-900">Course Modules</h2><p className="mt-1 text-xs text-slate-500">Click a module to view its topics.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-white text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Order</th><th className="px-5 py-4">Module</th><th className="px-5 py-4">Description</th><th className="px-5 py-4">Topics</th><th className="px-5 py-4">Duration</th></tr></thead><tbody className="divide-y divide-slate-100">{modules.map((module, index) => <tr key={module._id} className="align-top hover:bg-slate-50"><td className="px-5 py-4"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 font-black text-blue-700">{module.order || index + 1}</span></td><td className="px-5 py-4"><Link to={`/${portal}/courses/${id}/modules/${module._id}/topics`} className="inline-flex items-center gap-1 font-black text-blue-700 hover:text-blue-900">{module.title}<ChevronRight size={14} /></Link><p className="mt-1 text-xs text-slate-500">{module.isPublished === false ? "Draft" : "Published"}</p></td><td className="max-w-xs px-5 py-4 text-xs leading-5 text-slate-600">{module.description || "No description"}</td><td className="px-5 py-4"><span className="font-bold text-slate-700">{module.topics?.length || 0} topics</span></td><td className="px-5 py-4 text-xs text-slate-600"><span className="inline-flex items-center gap-1"><Clock3 size={13} />{module.duration?.value || 0} {module.duration?.unit || "hours"}</span></td></tr>)}{!modules.length && <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500"><Layers3 className="mx-auto mb-2 text-slate-300" />No modules have been assigned yet.</td></tr>}</tbody></table></div></div>
  </section>;
};

export default PortalCourseDetail;
