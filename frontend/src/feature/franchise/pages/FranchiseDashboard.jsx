import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  IndianRupee,
  UserCheck,
  ArrowUpRight,
  Plus,
  ClipboardCheck,
  Layers3,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const cards = [
  {
    key: "students",
    label: "Total Students",
    path: "/franchise/students",
    icon: Users,
    color: "blue",
    description: "Registered students",
  },
  {
    key: "teachers",
    label: "Total Teachers",
    path: "/franchise/teachers",
    icon: GraduationCap,
    color: "purple",
    description: "Faculty members",
  },
  {
    key: "activeBatches",
    label: "Active Batches",
    path: "/franchise/batches",
    icon: Layers3,
    color: "emerald",
    description: "Running batches",
  },
  {
    key: "courses",
    label: "Total Courses",
    path: "/franchise/courses",
    icon: BookOpen,
    color: "orange",
    description: "Available courses",
  },
  {
    key: "attendanceToday",
    label: "Today's Attendance",
    path: "/franchise/attendance",
    icon: CalendarDays,
    color: "cyan",
    description: "Today's records",
  },
  {
    key: "pendingFees",
    label: "Pending Fees",
    path: "/franchise/fees",
    icon: IndianRupee,
    color: "rose",
    description: "Fees to collect",
  },
];

const colorStyles = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    hover: "hover:border-blue-200",
    value: "text-blue-600",
    gradient: "from-blue-500 to-indigo-600",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600",
    hover: "hover:border-purple-200",
    value: "text-purple-600",
    gradient: "from-purple-500 to-pink-600",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    hover: "hover:border-emerald-200",
    value: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600",
    hover: "hover:border-orange-200",
    value: "text-orange-600",
    gradient: "from-orange-500 to-red-500",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600",
    hover: "hover:border-cyan-200",
    value: "text-cyan-600",
    gradient: "from-cyan-500 to-blue-600",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600",
    hover: "hover:border-rose-200",
    value: "text-rose-600",
    gradient: "from-rose-500 to-pink-600",
  },
};

const FranchiseDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(
        "/api/portal/dashboard"
      );

      setData(response?.data || {});
    } catch (requestError) {
      console.error(
        "Dashboard loading error:",
        requestError
      );

      setError(
        requestError?.message ||
          "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary = useMemo(() => {
    const recentBatches = data?.recentBatches || [];
    const recentStudents = data?.recentStudents || [];

    const activeBatches = recentBatches.filter(
      (batch) => batch?.status === "ACTIVE"
    ).length;

    return {
      recentBatches,
      recentStudents,
      activeBatches,
    };
  }, [data]);

  // =====================================================
  // HELPERS
  // =====================================================

  const getInitial = (name, fallback = "S") => {
    return (
      name?.trim()?.charAt(0)?.toUpperCase() ||
      fallback
    );
  };

  const avatarColors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-500",
    "from-cyan-500 to-blue-600",
  ];

  const getAvatarColor = (index) =>
    avatarColors[index % avatarColors.length];

  return (
    <div className="min-h-full space-y-4 bg-slate-50/40">
      {/* =================================================
          HERO HEADER
      ================================================= */}

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-5 text-white shadow-lg shadow-blue-100">
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute left-1/2 top-0 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-50 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Franchise Portal
            </div>

            <h1 className="text-2xl font-black tracking-tight">
              Dashboard
            </h1>

            <p className="mt-1 max-w-lg text-xs text-blue-100">
              Manage students, teachers, batches and
              daily operations from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-white/20 bg-white/10 px-3 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={14}
              className={
                loading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </div>
      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-red-100 text-red-600">
              <AlertCircle size={14} />
            </div>

            <p className="text-xs font-semibold text-red-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-xs font-bold text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* =================================================
          STAT CARDS
      ================================================= */}

      {loading ? (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
          {cards.map((card) => (
            <div
              key={card.key}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="animate-pulse">
                <div className="h-8 w-8 rounded-lg bg-slate-100" />
                <div className="mt-3 h-2 w-16 rounded bg-slate-100" />
                <div className="mt-2 h-5 w-10 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
          {cards.map(
            ({
              key,
              label,
              path,
              icon: Icon,
              color,
              description,
            }) => {
              const style = colorStyles[color];

              return (
                <Link
                  key={key}
                  to={path}
                  className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${style.hover}`}
                >
                  {/* top accent */}
                  <div
                    className={`absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r ${style.gradient}`}
                  />

                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`grid h-8 w-8 place-items-center rounded-lg ${style.icon}`}
                    >
                      <Icon size={16} />
                    </div>

                    <ArrowUpRight
                      size={14}
                      className="text-slate-300 transition group-hover:text-slate-500"
                    />
                  </div>

                  <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>

                  <p
                    className={`mt-0.5 truncate text-xl font-black ${style.value}`}
                  >
                    {key === "pendingFees"
                      ? `₹${Number(
                          data?.[key] || 0
                        ).toLocaleString("en-IN")}`
                      : (data?.[key] ?? "—")}
                  </p>

                  <p className="mt-0.5 truncate text-[9px] text-slate-400">
                    {description}
                  </p>
                </Link>
              );
            }
          )}
        </div>
      )}

      {/* =================================================
          RECENT DATA
      ================================================= */}

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Recent Batches */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <Layers3 size={15} />
              </div>

              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Recent Batches
                </h2>

                <p className="text-[9px] text-slate-400">
                  Latest batch activity
                </p>
              </div>
            </div>

            <Link
              to="/franchise/batches"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700"
            >
              View all
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {summary.recentBatches.length > 0 ? (
              summary.recentBatches.map(
                (batch, index) => (
                  <div
                    key={batch._id}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-50/70"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-[10px] font-black text-white ${getAvatarColor(
                          index
                        )}`}
                      >
                        {getInitial(
                          batch.name,
                          "B"
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800">
                          {batch.name ||
                            "Unnamed Batch"}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-slate-400">
                          {batch.course?.title ||
                            batch.course?.name ||
                            "No course"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[8px] font-bold ${
                          batch.status ===
                          "ACTIVE"
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {batch.status ||
                          "ACTIVE"}
                      </span>

                      <span className="text-[9px] text-slate-400">
                        {batch.teacher?.name ||
                          "Unassigned"}
                      </span>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-400">
                  <Layers3 size={18} />
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-500">
                  No batches found
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Students */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-50 text-purple-600">
                <Users size={15} />
              </div>

              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Recent Students
                </h2>

                <p className="text-[9px] text-slate-400">
                  Recently registered students
                </p>
              </div>
            </div>

            <Link
              to="/franchise/students"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700"
            >
              View all
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {summary.recentStudents.length > 0 ? (
              summary.recentStudents.map(
                (student, index) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-50/70"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[10px] font-black text-white ${getAvatarColor(
                          index + 2
                        )}`}
                      >
                        {getInitial(
                          student.name
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800">
                          {student.name ||
                            "Unnamed Student"}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-slate-400">
                          {student.courseId
                            ?.title ||
                            student.courseId
                              ?.name ||
                            "No course"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-bold ${
                        student.status ===
                        "ACTIVE"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-100 text-slate-500"
                      }`}
                    >
                      {student.status ||
                        "Registered"}
                    </span>
                  </div>
                )
              )
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-400">
                  <Users size={18} />
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-500">
                  No students found
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">
              Quick Actions
            </h2>

            <p className="text-[10px] text-slate-400">
              Frequently used operations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {/* Add Student */}
          <Link
            to="/franchise/students/add"
            className="group flex items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50/70 p-3 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Plus size={15} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-blue-900">
                Add Student
              </p>
              <p className="text-[9px] text-blue-600">
                Register student
              </p>
            </div>

            <ChevronRight
              size={14}
              className="ml-auto text-blue-300 transition group-hover:text-blue-600"
            />
          </Link>

          {/* Add Teacher */}
          <Link
            to="/franchise/teachers/add"
            className="group flex items-center gap-2.5 rounded-xl border border-purple-100 bg-purple-50/70 p-3 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple-600 text-white shadow-sm">
              <GraduationCap size={15} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-purple-900">
                Add Teacher
              </p>
              <p className="text-[9px] text-purple-600">
                Manage faculty
              </p>
            </div>

            <ChevronRight
              size={14}
              className="ml-auto text-purple-300 transition group-hover:text-purple-600"
            />
          </Link>

          {/* Create Batch */}
          <Link
            to="/franchise/batches"
            className="group flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Layers3 size={15} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-emerald-900">
                Create Batch
              </p>
              <p className="text-[9px] text-emerald-600">
                Manage batches
              </p>
            </div>

            <ChevronRight
              size={14}
              className="ml-auto text-emerald-300 transition group-hover:text-emerald-600"
            />
          </Link>

          {/* Attendance */}
          <Link
            to="/franchise/attendance"
            className="group flex items-center gap-2.5 rounded-xl border border-orange-100 bg-orange-50/70 p-3 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:shadow-sm"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange-500 text-white shadow-sm">
              <ClipboardCheck size={15} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-orange-900">
                Attendance
              </p>
              <p className="text-[9px] text-orange-600">
                Record attendance
              </p>
            </div>

            <ChevronRight
              size={14}
              className="ml-auto text-orange-300 transition group-hover:text-orange-600"
            />
          </Link>
        </div>
      </section>

      {/* =================================================
          BOTTOM INFO
      ================================================= */}

      {!loading && (
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck size={14} />
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-700">
                Portal overview
              </p>

              <p className="text-[9px] text-slate-400">
                Your franchise data is up to date.
              </p>
            </div>
          </div>

          <span className="text-[9px] font-semibold text-slate-400">
            {new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export { FranchiseDashboard };
export default FranchiseDashboard;