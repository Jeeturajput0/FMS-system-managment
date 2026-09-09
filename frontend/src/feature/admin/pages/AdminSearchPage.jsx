import React, { useEffect, useMemo, useState } from "react";
import { Building2, BookOpen, Loader2, Search, Users } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const getId = (item) => item?._id || item?.id || "";

const getList = (response, keys = []) => {
  if (Array.isArray(response)) return response;
  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
  }
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

export default function AdminSearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const [results, setResults] = useState({ students: [], courses: [], franchises: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResults = async () => {
      if (!query) {
        setResults({ students: [], courses: [], franchises: [] });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const [studentResponse, courseResponse, franchiseResponse] = await Promise.all([
          apiFetch(`/api/students?limit=1000&search=${encodeURIComponent(query)}`),
          apiFetch("/api/courses"),
          apiFetch("/api/coaching"),
        ]);
        setResults({
          students: getList(studentResponse, ["students"]),
          courses: getList(courseResponse, ["courses"]),
          franchises: getList(franchiseResponse, ["coachings", "franchises"]),
        });
      } catch (requestError) {
        setError(requestError.message || "Unable to search admin records");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [query]);

  const matchingCourses = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return results.courses.filter((course) =>
      [course.title, course.name, course.category, course.description]
        .some((value) => String(value || "").toLowerCase().includes(normalizedQuery)),
    );
  }, [query, results.courses]);

  const matchingFranchises = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return results.franchises.filter((franchise) =>
      [franchise.name, franchise.ownerName, franchise.code, franchise.email, franchise.city]
        .some((value) => String(value || "").toLowerCase().includes(normalizedQuery)),
    );
  }, [query, results.franchises]);

  const sections = [
    {
      title: "Students",
      icon: Users,
      items: results.students,
      empty: "No students matched this search.",
      render: (student) => ({
        title: student.name,
        detail: `${student.studentId || ""} ${student.email || student.mobile || ""}`,
        to: `/admin/students/${getId(student)}`,
      }),
    },
    {
      title: "Courses",
      icon: BookOpen,
      items: matchingCourses,
      empty: "No courses matched this search.",
      render: (course) => ({
        title: course.title || course.name,
        detail: course.category || "Course catalog",
        to: `/admin/courses/${getId(course)}`,
      }),
    },
    {
      title: "Franchises",
      icon: Building2,
      items: matchingFranchises,
      empty: "No franchises matched this search.",
      render: (franchise) => ({
        title: franchise.name,
        detail: `${franchise.code || ""} ${franchise.city || ""}`,
        to: `/admin/franchises/${getId(franchise)}`,
      }),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">Admin Search</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Search results</h2>
        <p className="mt-1 text-sm text-slate-500">Showing matches for “{query}”.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Searching records...
        </div>
      ) : !query ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          <Search className="mx-auto mb-3 h-8 w-8 text-slate-300" /> Enter a search term above.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {sections.map(({ title, icon: Icon, items, empty, render }) => (
            <section key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Icon className="h-5 w-5 text-orange-500" />
                <h3 className="font-bold text-slate-900">{title}</h3>
                <span className="ml-auto text-xs font-semibold text-slate-400">{items.length}</span>
              </div>
              {items.length === 0 ? (
                <p className="text-sm text-slate-500">{empty}</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => {
                    const result = render(item);
                    return (
                      <Link key={getId(item)} to={result.to} className="block rounded-xl border border-slate-100 p-3 hover:border-orange-200 hover:bg-orange-50">
                        <p className="truncate text-sm font-bold text-slate-800">{result.title}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{result.detail}</p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
