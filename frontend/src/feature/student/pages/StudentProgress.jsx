import React from "react";
import {
  TrendingUp,
  CheckCircle2,
  CalendarCheck,
  BarChart3,
  Target,
  Award,
} from "lucide-react";
import { useStudentData } from "../context/StudentDataContext";

const StudentProgress = () => {
  const { dashboard, loading, error } = useStudentData();

  const student = dashboard?.recent?.[0];

  const courseProgress = Number(student?.courseProgress || 0);

  const attendance = Number(
    student?.attendancePercentage ||
      dashboard?.attendance ||
      0
  );

  const safeCourseProgress = Math.min(
    100,
    Math.max(0, courseProgress)
  );

  const safeAttendance = Math.min(
    100,
    Math.max(0, attendance)
  );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="space-y-3">
        <div>
          <div className="h-7 w-40 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-1 h-3 w-60 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </section>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <section className="space-y-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            My Progress
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track your learning progress and performance.
          </p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-3">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 px-5 py-4 text-white shadow-md shadow-orange-100">

        <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-white/10" />

        <div className="absolute -bottom-16 right-20 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-black sm:text-2xl">
              My Progress
            </h1>

            <p className="text-xs font-medium text-orange-50 sm:text-sm">
              Track your learning progress and performance.
            </p>
          </div>

        </div>
      </div>

      {/* =====================================================
          COMPACT SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

        {/* Course Progress */}
        <ProgressCard
          title="Course Progress"
          value={`${courseProgress}%`}
          progress={safeCourseProgress}
          icon={Target}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          progressText="Course completion"
        />

        {/* Attendance */}
        <ProgressCard
          title="Attendance"
          value={`${attendance}%`}
          progress={safeAttendance}
          icon={CalendarCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          progressText="Class attendance"
        />

        {/* Average Score */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50">
              <BarChart3 className="h-4.5 w-4.5 text-purple-600" />
            </div>

            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase text-slate-500">
              Score
            </span>

          </div>

          <p className="mt-3 text-[11px] font-black uppercase tracking-wide text-slate-400">
            Average Score
          </p>

          <p className="mt-0.5 text-2xl font-black text-slate-900">
            —
          </p>

          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            Performance score
          </p>

        </div>

      </div>

      {/* =====================================================
          OVERVIEW
      ===================================================== */}

      <div className="grid gap-3 lg:grid-cols-3">

        {/* Learning Journey */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Performance Overview
              </p>

              <h2 className="mt-0.5 text-lg font-black text-slate-900">
                Learning Journey
              </h2>

              <p className="text-xs text-slate-500">
                Your current learning performance.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
              <Award className="h-4 w-4 text-orange-500" />
            </div>

          </div>

          {/* Course Progress */}
          <ProgressRow
            icon={Target}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            label="Course Completion"
            value={courseProgress}
            gradient="from-blue-500 to-cyan-400"
          />

          {/* Attendance */}
          <ProgressRow
            icon={CalendarCheck}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            label="Attendance"
            value={attendance}
            gradient="from-emerald-500 to-teal-400"
          />

        </div>

        {/* Goal Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
              <Award className="h-4 w-4 text-orange-500" />
            </div>

            <span className="text-[10px] font-bold uppercase text-slate-400">
              Goal
            </span>

          </div>

          <h2 className="mt-3 text-lg font-black text-slate-900">
            Keep Going!
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Complete your course and maintain good attendance to
            achieve your learning goals.
          </p>

          <div className="mt-3 rounded-xl bg-orange-50 px-3 py-2.5">

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={14}
                className="text-orange-500"
              />

              <span className="text-[10px] font-bold text-orange-700">
                Current Progress
              </span>
            </div>

            <p className="mt-0.5 text-xl font-black text-orange-600">
              {courseProgress}%
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

/* =========================================================
   COMPACT PROGRESS CARD
========================================================= */

const ProgressCard = ({
  title,
  value,
  progress,
  icon: Icon,
  iconBg,
  iconColor,
  progressText,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
        </div>

        <span className="text-lg font-black text-slate-900">
          {value}
        </span>

      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
          {title}
        </p>

        <p className="text-[10px] font-semibold text-slate-400">
          {progressText}
        </p>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

    </div>
  );
};

/* =========================================================
   PROGRESS ROW
========================================================= */

const ProgressRow = ({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  gradient,
}) => {
  const safeValue = Math.min(
    100,
    Math.max(0, Number(value) || 0)
  );

  return (
    <div className="mt-4">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconBg}`}
          >
            <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
          </div>

          <span className="text-xs font-bold text-slate-700">
            {label}
          </span>

        </div>

        <span className="text-xs font-black text-slate-900">
          {safeValue}%
        </span>

      </div>

      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>

    </div>
  );
};

export default StudentProgress;