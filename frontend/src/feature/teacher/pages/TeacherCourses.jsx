import { useEffect, useMemo, useState } from "react";
import { BookOpen, Eye, Layers3, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../utils/api";
import { Pagination } from "../../../components/Pagination";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 20;

  useEffect(() => {
    apiFetch("/api/portal/courses")
      .then((response) => setCourses(response.data || []))
      .catch((requestError) => setError(requestError.message || "Unable to load assigned courses"))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter((course) => [course.title, course.name, course.category, course.level].some((value) => String(value || "").toLowerCase().includes(query)));
  }, [courses, search]);

  const pageCourses = filteredCourses.slice((page - 1) * pageSize, page * pageSize);

  return <section className="min-h-full space-y-5 bg-slate-50/40 p-1">
    <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Teaching Library</p><h1 className="mt-1 text-2xl font-black text-slate-900">My Courses</h1><p className="mt-1 text-sm text-slate-500">Courses assigned to your teaching account.</p></div><div className="rounded-xl bg-blue-600 p-3 text-white"><BookOpen size={22} /></div></div></header>
    {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"><label className="relative w-full sm:max-w-md"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search assigned courses..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white" /></label><span className="text-xs font-bold text-slate-500">{filteredCourses.length} assigned course{filteredCourses.length === 1 ? "" : "s"}</span></div>
    {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center"><Loader2 className="mx-auto animate-spin text-blue-600" /></div> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Course</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Level</th><th className="px-5 py-4">Modules</th><th className="px-5 py-4">Topics</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{pageCourses.map((course) => <tr key={course._id} className="hover:bg-blue-50/30"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><BookOpen size={16} /></span><div><p className="font-black text-slate-900">{course.title || course.name || "Untitled course"}</p><p className="mt-1 max-w-xs truncate text-xs text-slate-400">{course.shortDescription || course.description || "Assigned teaching course"}</p></div></div></td><td className="px-5 py-4 text-xs font-semibold text-slate-600">{course.category || "General"}</td><td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{course.level || "Beginner"}</span></td><td className="px-5 py-4"><span className="inline-flex items-center gap-1 font-bold text-blue-700"><Layers3 size={14} />{course.modules?.length || 0}</span></td><td className="px-5 py-4 font-bold text-slate-700">{course.modules?.reduce((total, module) => total + (module.topics?.length || 0), 0) || 0}</td><td className="px-5 py-4 text-right"><Link to={`/teacher/courses/${course._id}`} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"><Eye size={14} /> View modules</Link></td></tr>)}{!pageCourses.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">No assigned courses found.</td></tr>}</tbody></table></div><Pagination page={page} pageCount={Math.ceil(filteredCourses.length / pageSize)} onPageChange={setPage} totalItems={filteredCourses.length} pageSize={pageSize} /></div>}
  </section>;
};

export default TeacherCourses;
