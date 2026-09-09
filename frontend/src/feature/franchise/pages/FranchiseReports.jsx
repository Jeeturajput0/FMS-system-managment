import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Download,
  GraduationCap,
  IndianRupee,
  Layers3,
  RefreshCw,
  Users,
  WalletCards,
  AlertCircle,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const FranchiseReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboard, fees] = await Promise.all([
        apiFetch("/api/portal/dashboard"),
        apiFetch("/api/portal/fees"),
      ]);

      setReport({
        ...(dashboard.data || {}),
        fees: fees.data || [],
      });
    } catch (requestError) {
      setError(
        requestError.message || "Unable to load franchise reports",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const exportCsv = () => {
    if (!report) return;

    const rows = [
      ["Metric", "Value"],
      ["Students", report.students || 0],
      ["Teachers", report.teachers || 0],
      ["Active batches", report.activeBatches || 0],
      ["Courses", report.courses || 0],
      ["Today's attendance", report.attendanceToday || 0],
      ["Pending fees", report.pendingFees || 0],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "franchise-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const stats = useMemo(
    () => [
      {
        label: "Total Students",
        value: report?.students ?? 0,
        icon: Users,
        color: "blue",
        description: "Registered students",
      },
      {
        label: "Total Teachers",
        value: report?.teachers ?? 0,
        icon: GraduationCap,
        color: "violet",
        description: "Faculty members",
      },
      {
        label: "Active Batches",
        value: report?.activeBatches ?? 0,
        icon: Layers3,
        color: "emerald",
        description: "Currently running",
      },
      {
        label: "Pending Fees",
        value: `₹${Number(
          report?.pendingFees || 0,
        ).toLocaleString("en-IN")}`,
        icon: IndianRupee,
        color: "rose",
        description: "Amount to collect",
      },
    ],
    [report],
  );

  const reportItems = [
    {
      label: "Students",
      value: report?.students ?? 0,
      icon: Users,
      color: "blue",
    },
    {
      label: "Teachers",
      value: report?.teachers ?? 0,
      icon: GraduationCap,
      color: "violet",
    },
    {
      label: "Courses",
      value: report?.courses ?? 0,
      icon: BookOpen,
      color: "orange",
    },
    {
      label: "Active Batches",
      value: report?.activeBatches ?? 0,
      icon: Layers3,
      color: "emerald",
    },
    {
      label: "Today's Attendance",
      value: report?.attendanceToday ?? 0,
      icon: CalendarCheck,
      color: "cyan",
    },
    {
      label: "Pending Fees",
      value: `₹${Number(
        report?.pendingFees || 0,
      ).toLocaleString("en-IN")}`,
      icon: WalletCards,
      color: "rose",
    },
  ];

  const colorStyles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      value: "text-blue-700",
      bar: "bg-blue-500",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      value: "text-violet-700",
      bar: "bg-violet-500",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      value: "text-emerald-700",
      bar: "bg-emerald-500",
    },
    rose: {
      icon: "bg-rose-50 text-rose-600",
      value: "text-rose-700",
      bar: "bg-rose-500",
    },
    orange: {
      icon: "bg-orange-50 text-orange-600",
      value: "text-orange-700",
      bar: "bg-orange-500",
    },
    cyan: {
      icon: "bg-cyan-50 text-cyan-600",
      value: "text-cyan-700",
      bar: "bg-cyan-500",
    },
  };

  return (
    <div className="min-h-full space-y-5 bg-slate-50/50 p-1">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-5 text-white shadow-lg shadow-blue-100 sm:p-6">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-400/10" />
        <div className="absolute -bottom-24 right-28 h-56 w-56 rounded-full bg-violet-400/10" />

        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-200">
              <BarChart3 size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Analytics & Overview
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Franchise Reports
            </h1>

            <p className="mt-1 max-w-xl text-sm text-slate-300">
              Get a clear overview of students, faculty, batches,
              attendance and fee performance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadReport}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={exportCsv}
              disabled={!report || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = colorStyles[stat.color];

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-500">
                    {stat.label}
                  </p>

                  {loading ? (
                    <div className="mt-2 h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
                  ) : (
                    <p
                      className={`mt-1 truncate text-2xl font-black ${colors.value} sm:text-3xl`}
                    >
                      {stat.value}
                    </p>
                  )}

                  <p className="mt-1 text-[11px] font-medium text-slate-400">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`shrink-0 rounded-xl p-2.5 ${colors.icon}`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

   {/* Main Report Grid */}
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-black text-slate-900">
                Performance Overview
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Current franchise statistics
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Activity size={18} />
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportItems.map((item) => {
              const Icon = item.icon;
              const colors = colorStyles[item.color];

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-slate-200 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`rounded-lg p-2 ${colors.icon}`}
                    >
                      <Icon size={16} />
                    </div>

                    <CheckCircle2
                      size={15}
                      className="text-emerald-500"
                    />
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-500">
                    {item.label}
                  </p>

                  {loading ? (
                    <div className="mt-1 h-7 w-20 animate-pulse rounded bg-slate-200" />
                  ) : (
                    <p
                      className={`mt-1 text-xl font-black ${colors.value}`}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fee Summary */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
                <WalletCards size={19} />
              </div>

              <div>
                <h2 className="font-black text-slate-900">
                  Fee Summary
                </h2>
                <p className="text-xs text-slate-400">
                  Collection overview
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Pending Collection
            </p>

            {loading ? (
              <div className="mt-2 h-10 w-36 animate-pulse rounded-lg bg-slate-100" />
            ) : (
              <p className="mt-1 text-3xl font-black text-rose-600">
                ₹
                {Number(
                  report?.pendingFees || 0,
                ).toLocaleString("en-IN")}
              </p>
            )}

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">
                  Fee records
                </span>
                <span className="font-black text-slate-700">
                  {report?.fees?.length || 0}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-rose-500 to-orange-400" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-[11px] font-semibold text-emerald-600">
                  Fee Records
                </p>
                <p className="mt-1 text-lg font-black text-emerald-700">
                  {report?.fees?.length || 0}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <p className="text-[11px] font-semibold text-blue-600">
                  Students
                </p>
                <p className="mt-1 text-lg font-black text-blue-700">
                  {report?.students || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Report */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-black text-slate-900">
              Detailed Report
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Key metrics from your franchise
            </p>
          </div>

          <button
            onClick={exportCsv}
            disabled={!report}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <Download size={14} />
            Download Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Metric
                </th>
                <th className="px-5 py-3 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Current Value
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {reportItems.map((item) => {
                const Icon = item.icon;
                const colors = colorStyles[item.color];

                return (
                  <tr
                    key={item.label}
                    className="border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-lg p-2 ${colors.icon}`}
                        >
                          <Icon size={15} />
                        </div>

                        <span className="font-bold text-slate-700">
                          {item.label}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`font-black ${colors.value}`}
                      >
                        {item.value}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Available
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:flex-row sm:items-center">
        <div className="rounded-xl bg-white p-2.5 text-blue-600 shadow-sm">
          <BarChart3 size={20} />
        </div>

        <div>
          <p className="text-sm font-black text-slate-800">
            Franchise performance snapshot
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Use the report data to monitor student growth, faculty,
            active batches and pending fee collections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FranchiseReports;