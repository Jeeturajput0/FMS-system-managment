
import React, { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  Layers3,
  Loader2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const TeacherDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
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
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
              <Activity size={20} />
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                Teaching rhythm
              </h2>

              <p className="text-xs text-slate-500">
                Your next useful actions.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <QuickAction
              to="/teacher/assignments"
              icon={ClipboardList}
              label="Review assignments"
            />

            <QuickAction
              to="/teacher/exams"
              icon={FileText}
              label="Manage exams"
            />

            <QuickAction
              to="/teacher/attendance"
              icon={Clock3}
              label="Update attendance"
            />
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

