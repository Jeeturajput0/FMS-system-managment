import React from "react";
import {
  Users,
  BookOpen,
  Layers,
  CheckCircle,
  ClipboardList,
  FileText,
} from "lucide-react";

const stats = [
  {
    title: "My Students",
    value: "0",
    icon: Users,
    path: "/teacher/students",
  },
  {
    title: "My Courses",
    value: "0",
    icon: BookOpen,
    path: "/teacher/courses",
  },
  {
    title: "My Batches",
    value: "0",
    icon: Layers,
    path: "/teacher/batches",
  },
  {
    title: "Attendance",
    value: "0%",
    icon: CheckCircle,
    path: "/teacher/attendance",
  },
];

const TeacherDashboard = () => {
  return (
    <div className="space-y-8">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Teacher Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Welcome to your teaching workspace.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.title}
              href={item.path}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    {item.value}
                  </h2>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Icon size={24} />
                </div>

              </div>
            </a>
          );
        })}

      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <h2 className="text-xl font-black text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <a
              href="/teacher/students"
              className="rounded-xl border p-4 hover:bg-slate-50"
            >
              <Users className="mb-2 text-blue-600" />
              <p className="font-bold">
                View Students
              </p>
            </a>

            <a
              href="/teacher/attendance"
              className="rounded-xl border p-4 hover:bg-slate-50"
            >
              <CheckCircle className="mb-2 text-green-600" />
              <p className="font-bold">
                Mark Attendance
              </p>
            </a>

            <a
              href="/teacher/assignments"
              className="rounded-xl border p-4 hover:bg-slate-50"
            >
              <ClipboardList className="mb-2 text-purple-600" />
              <p className="font-bold">
                Assignments
              </p>
            </a>

            <a
              href="/teacher/exams"
              className="rounded-xl border p-4 hover:bg-slate-50"
            >
              <FileText className="mb-2 text-orange-600" />
              <p className="font-bold">
                Exams
              </p>
            </a>

          </div>

        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <h2 className="text-xl font-black text-slate-900">
            Recent Activity
          </h2>

          <div className="mt-5 rounded-xl bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-500">
              No recent activity.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TeacherDashboard;