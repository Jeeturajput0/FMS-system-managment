import React, { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Users,
} from "lucide-react";
import { apiFetch } from "../../utils/api";

const config = {
  STUDENT: {
    title: "Your learning space",
    subtitle: "Track courses, assignments, tests and progress from one place.",
    accent: "blue",
    stats: [
      ["My Courses", "2", BookOpen],
      ["Assignments", "6", ClipboardCheck],
      ["Attendance", "92%", CalendarDays],
      ["Pending Fees", "₹0", CreditCard],
    ],
    actions: ["Continue learning", "View assignments", "Check results"],
  },
  TEACHER: {
    title: "Your teaching workspace",
    subtitle: "Manage classes, students, attendance and academic performance.",
    accent: "emerald",
    stats: [
      ["Assigned Courses", "4", BookOpen],
      ["My Students", "86", Users],
      ["Today's Classes", "3", CalendarDays],
      ["Pending Reviews", "12", ClipboardCheck],
    ],
    actions: ["Mark attendance", "Create assignment", "View students"],
  },
  FRANCHISE: {
    title: "Your franchise control room",
    subtitle:
      "Keep your centre, team, students and collections moving together.",
    accent: "orange",
    stats: [
      ["Active Students", "124", Users],
      ["Teachers", "8", BookOpen],
      ["Active Batches", "12", CalendarDays],
      ["Pending Fees", "₹48,500", CreditCard],
    ],
    actions: ["Add student", "Create batch", "Open reports"],
  },
};

export const PortalDashboard = ({ role }) => {
  const [status, setStatus] = useState("Checking portal access...");
  const [liveData, setLiveData] = useState(null);
  const user = JSON.parse(localStorage.getItem("ai_scholars_user") || "null");
  const current = config[role] || config.STUDENT;
  useEffect(() => {
    Promise.all([apiFetch("/api/auth/portal"), apiFetch("/api/portal/dashboard")])
      .then(([access, dashboard]) => {
        setStatus(access.message);
        setLiveData(dashboard.data);
      })
      .catch(() => setStatus("Portal access ready"));
  }, []);
  const accent = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    orange: "bg-orange-500",
  }[current.accent];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <section
        className={`${accent} relative overflow-hidden rounded-3xl p-7 text-white shadow-xl sm:p-10`}
      >
        <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="relative">
          <p className="mb-2 text-sm font-semibold text-white/75">{status}</p>
          <h1 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            {current.title}, {user?.name?.split(" ")[0] || "there"}.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
            {current.subtitle}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {current.actions.map((action) => (
              <button
                key={action}
                className="rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold backdrop-blur transition hover:bg-white/25"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {current.stats.map(([label, value, Icon]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {label}
              </p>
              <Icon size={19} className="text-slate-400" />
            </div>
            <p className="mt-5 text-3xl font-black text-slate-900">{liveData ? ({
              "My Courses": liveData.courses,
              Assignments: liveData.assignments || value,
              Attendance: liveData.attendance ? `${liveData.attendance}%` : value,
              "Pending Fees": liveData.pendingFees !== undefined ? `₹${Number(liveData.pendingFees).toLocaleString("en-IN")}` : value,
              "Assigned Courses": liveData.courses,
              "My Students": liveData.students,
              "Active Students": liveData.students,
              Teachers: liveData.teachers,
              "Active Batches": liveData.batches,
            })[label] || value : value}</p>
            <p className="mt-1 text-xs text-emerald-600">
              <CheckCircle2 className="mr-1 inline" size={13} />
              Updated today
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Recent activity</h2>
              <p className="mt-1 text-xs text-slate-400">
                Your latest workspace updates
              </p>
            </div>
            <button className="text-xs font-bold text-blue-600">
              View all
            </button>
          </div>
          {[
            "Profile is active and verified",
            "New learning content is available",
            "Your next schedule is ready",
          ].map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-3 border-t border-slate-100 py-4"
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-lg ${index === 0 ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}
              >
                <CheckCircle2 size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-700">{item}</p>
                <p className="text-xs text-slate-400">Just now</p>
              </div>
            </div>
          ))}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-900">Quick access</h2>
          <p className="mt-1 text-xs text-slate-400">
            Common tasks for your role
          </p>
          <div className="mt-5 grid gap-3">
            {current.actions.map((action) => (
              <button
                key={action}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <span>{action}</span>
                <span className="text-blue-600">-&gt;</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
