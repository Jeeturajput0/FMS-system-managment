import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const cards = [
  ["students", "Total Students", "/franchise/students"],
  ["teachers", "Total Teachers", "/franchise/teachers"],
  ["activeBatches", "Active Batches", "/franchise/batches"],
  ["courses", "Total Courses", "/franchise/courses"],
  ["attendanceToday", "Today's Attendance", "/franchise/attendance"],
  ["pendingFees", "Pending Fees", "/franchise/fees"],
];

export const FranchiseDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/portal/dashboard")
      .then((response) => setData(response.data || {}))
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Franchise Portal
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage students, teachers, batches and daily operations.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([key, label, path]) => (
          <Link
            key={key}
            to={path}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-900">
              {key === "pendingFees"
                ? `₹${Number(data?.[key] || 0).toLocaleString("en-IN")}`
                : (data?.[key] ?? "—")}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">Recent batches</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {(data?.recentBatches || []).map((batch) => (
              <div
                key={batch._id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-800">{batch.name}</p>
                  <p className="text-slate-500">
                    {batch.course?.title || batch.course?.name || "No course"}
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {batch.teacher?.name || "Unassigned"}
                </span>
              </div>
            ))}
            {!data?.recentBatches?.length && (
              <p className="py-4 text-sm text-slate-500">No batches found.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">Recent students</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {(data?.recentStudents || []).map((student) => (
              <div
                key={student._id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-800">{student.name}</p>
                  <p className="text-slate-500">
                    {student.courseId?.title ||
                      student.courseId?.name ||
                      "No course"}
                  </p>
                </div>
                <span className="text-xs font-bold capitalize text-slate-500">
                  {student.status || "registered"}
                </span>
              </div>
            ))}
            {!data?.recentStudents?.length && (
              <p className="py-4 text-sm text-slate-500">No students found.</p>
            )}
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            to="/franchise/students/add"
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
          >
            Add Student
          </Link>
          <Link
            to="/franchise/teachers"
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
          >
            Add Teacher
          </Link>
          <Link
            to="/franchise/batches"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700"
          >
            Create Batch
          </Link>
          <Link
            to="/franchise/attendance"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700"
          >
            Record Attendance
          </Link>
        </div>
      </section>
    </div>
  );
};
