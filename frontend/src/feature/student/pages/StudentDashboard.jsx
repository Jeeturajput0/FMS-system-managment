import React from "react";
import {
  BookOpen,
  ClipboardList,
  Clock3,
  Award,
  TrendingUp,
  CreditCard,
} from "lucide-react";

const StudentDashboard = () => {
  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div>

        <h1 className="text-2xl font-extrabold text-slate-900">
          Welcome Back, Student! 👋
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Keep learning, keep growing.
        </p>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          icon={<BookOpen />}
          title="Course Progress"
          value="68%"
        />

        <StatCard
          icon={<ClipboardList />}
          title="Pending Assignments"
          value="4"
        />

        <StatCard
          icon={<Clock3 />}
          title="Attendance"
          value="87%"
        />

        <StatCard
          icon={<Award />}
          title="Certificate"
          value="Eligible"
        />

      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Course */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6">

          <h2 className="font-bold text-slate-900">
            My Course
          </h2>

          <div className="mt-5">

            <div className="flex justify-between">

              <div>
                <p className="font-bold">
                  MERN Stack Development
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  React • Node.js • Express • MongoDB
                </p>
              </div>

              <span className="font-bold text-blue-600">
                68%
              </span>

            </div>

            <div className="h-3 bg-slate-100 rounded-full mt-4 overflow-hidden">

              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: "68%" }}
              />

            </div>

          </div>

        </div>

        {/* Fees */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Pending Fees
              </p>

              <p className="text-xl font-extrabold">
                ₹12,000
              </p>
            </div>

          </div>

          <button className="mt-5 w-full py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold">
            View Fees
          </button>

        </div>

      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6">

        <h2 className="font-bold text-slate-900">
          Upcoming Activities
        </h2>

        <div className="mt-4 divide-y divide-slate-100">

          <Activity
            title="React Assignment"
            date="Today"
            type="Assignment"
          />

          <Activity
            title="JavaScript Test"
            date="Tomorrow"
            type="Test"
          />

          <Activity
            title="Node.js Project Review"
            date="08 Sep"
            type="Project"
          />

        </div>

      </div>

    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
}) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5">

    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
      {React.cloneElement(icon, {
        className: "w-5 h-5",
      })}
    </div>

    <p className="text-xs text-slate-500 mt-4">
      {title}
    </p>

    <p className="text-2xl font-extrabold text-slate-900 mt-1">
      {value}
    </p>

  </div>
);

const Activity = ({
  title,
  date,
  type,
}) => (
  <div className="flex items-center justify-between py-4">

    <div>

      <p className="text-sm font-bold text-slate-900">
        {title}
      </p>

      <p className="text-xs text-slate-500 mt-1">
        {type}
      </p>

    </div>

    <span className="text-xs font-bold text-blue-600">
      {date}
    </span>

  </div>
);

export default StudentDashboard;