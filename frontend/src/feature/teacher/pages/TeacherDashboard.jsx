
import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers3,
  Loader2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const TeacherDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [courseContent, setCourseContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("ai_scholars_user") || "{}"
  );

  useEffect(() => {
    apiFetch("/api/portal/dashboard")
      .then((response) => setDashboard(response.data || {}))
      .catch((requestError) =>
        setError(
          requestError.message || "Unable to load dashboard"
        )
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/portal/courses")
      .then(async (response) => {
        const courses = response.data || [];
        const content = await Promise.all(courses.map(async (course) => {
          const moduleResponse = await apiFetch(`/api/modules/course/${course._id}`);
          const modules = moduleResponse.data || [];
          return { ...course, modules, topicCount: modules.reduce((total, module) => total + (module.topics?.length || 0), 0) };
        }));
        if (!cancelled) setCourseContent(content);
      })
      .catch(() => {
        if (!cancelled) setCourseContent([]);
      });
    return () => { cancelled = true; };
  }, []);

  const stats = [
    {
      label: "My students",
      value: dashboard?.students ?? 0,
      icon: Users,
      tone: "blue",
      to: "/teacher/students",
    },
    {
      label: "Assigned courses",
      value: dashboard?.courses ?? 0,
      icon: BookOpen,
      tone: "violet",
      to: "/teacher/courses",
    },
    {
      label: "Active batches",
      value: dashboard?.batches ?? 0,
      icon: Layers3,
      tone: "amber",
      to: "/teacher/batches",
    },
    {
      label: "Attendance",
      value: `${dashboard?.attendance ?? 0}%`,
      icon: CheckCircle2,
      tone: "emerald",
      to: "/teacher/attendance",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <section className="overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              Faculty workspace
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Welcome, {user.name || "Teacher"}.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Keep your classes, students and assessment work moving from
              one focused workspace.
            </p>
          </div>

          <Link
            to="/teacher/attendance"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-bold text-white hover:bg-blue-400"
          >
            Mark attendance
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          ({ label, value, icon: Icon, tone, to }) => (
            <Link
              key={label}
              to={to}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {value}
                  </p>
                </div>

                <span
                  className={`rounded-xl p-3 ${
                    tone === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : tone === "violet"
                      ? "bg-violet-50 text-violet-600"
                      : tone === "amber"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  <Icon size={21} />
                </span>
              </div>

              <span className="mt-5 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-blue-600">
                Open section
                <ArrowRight size={13} />
              </span>
            </Link>
          )
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4"><div><h2 className="font-black text-slate-900">Assigned Courses</h2><p className="mt-1 text-xs text-slate-500">Courses, modules and topics available to you.</p></div><Link to="/teacher/courses" className="text-xs font-bold text-blue-600">View all</Link></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-white text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Course</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Modules</th><th className="px-5 py-4">Topics</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{courseContent.map((course) => <tr key={course._id} className="hover:bg-slate-50"><td className="px-5 py-4 font-black text-slate-900">{course.title || course.name}</td><td className="px-5 py-4 text-slate-600">{course.category || "General"}</td><td className="px-5 py-4 font-bold text-blue-700">{course.modules.length}</td><td className="px-5 py-4 font-bold text-emerald-700">{course.topicCount}</td><td className="px-5 py-4 text-right"><Link to={`/teacher/courses/${course._id}`} className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">View modules</Link></td></tr>)}{!courseContent.length && <tr><td colSpan={5} className="px-5 py-8 text-center text-xs text-slate-500">No assigned courses found.</td></tr>}</tbody></table></div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Recent students
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest learners connected to your workspace.
              </p>
            </div>

            <Link
              to="/teacher/students"
              className="text-xs font-bold text-blue-600"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {dashboard?.recent?.length ? (
              dashboard.recent
                .slice(0, 5)
                .map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
                        {student.name
                          ?.slice(0, 1)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {student.name}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {student.courseId?.title ||
                            "Course not assigned"}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-xs font-bold capitalize text-emerald-600">
                      {student.status || "active"}
                    </span>
                  </div>
                ))
            ) : (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Users className="mx-auto text-slate-300" />

                <p className="mt-2 text-sm text-slate-500">
                  No students available yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-black text-slate-900">My assigned batches</h2>
              <p className="mt-1 text-xs text-slate-500">Only batches assigned to you.</p>
            </div>
            <Link to="/teacher/batches" className="text-xs font-bold text-blue-600">View all</Link>
          </div>

          <div className="mt-5 space-y-3">
            {dashboard?.recentBatches?.length ? dashboard.recentBatches.slice(0, 4).map((batch) => (
              <Link key={batch._id} to="/teacher/batches" className="block rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-800">{batch.name}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{batch.course?.title || batch.course?.name || "Course not assigned"}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">{batch.students?.length || 0} students</span>
                </div>
              </Link>
            )) : (
              <div className="rounded-xl bg-slate-50 p-6 text-center">
                <Layers3 className="mx-auto text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No batches assigned yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const QuickAction = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
  >
    <span className="flex items-center gap-3">
      <Icon size={17} />
      {label}
    </span>

    <ArrowRight size={15} />
  </Link>
);

export default TeacherDashboard;

