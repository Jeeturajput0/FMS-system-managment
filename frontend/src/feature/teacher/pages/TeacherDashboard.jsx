import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Layers,
  CheckCircle,
  ClipboardList,
  FileText,
  CalendarDays,
  Clock3,
  BarChart3,
  UserCheck,
  GraduationCap,
} from "lucide-react";

const TeacherDashboard = () => {
  return (
    <div className="space-y-6">

      {/* =========================
          WELCOME
      ========================= */}

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Welcome Back, Teacher! 👋
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your classes, students and teaching activities.
        </p>
      </div>

      {/* =========================
          STATS
      ========================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={<Users />}
          title="My Students"
          value="48"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          link="/teacher/students"
        />

        <StatCard
          icon={<BookOpen />}
          title="My Courses"
          value="4"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          link="/teacher/courses"
        />

        <StatCard
          icon={<Layers />}
          title="My Batches"
          value="3"
          iconBg="bg-green-50"
          iconColor="text-green-600"
          link="/teacher/batches"
        />

        <StatCard
          icon={<CheckCircle />}
          title="Attendance"
          value="91%"
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          link="/teacher/attendance"
        />

      </div>

      {/* =========================
          MAIN SECTION
      ========================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* =========================
            MY COURSE
        ========================= */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:col-span-2">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  My Courses
                </h2>

                <p className="text-xs text-slate-500">
                  Courses assigned to you
                </p>
              </div>

            </div>

            <Link
              to="/teacher/courses"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>

          </div>

          {/* Course 1 */}

          <div className="mt-6 rounded-2xl border border-slate-100 p-4">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    MERN Stack Development
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    React • Node.js • Express • MongoDB
                  </p>
                </div>

              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                Active
              </span>

            </div>

            <div className="mt-5 flex items-center justify-between">

              <p className="text-xs font-semibold text-slate-500">
                24 Students
              </p>

              <p className="text-xs font-bold text-blue-600">
                72% Course Progress
              </p>

            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-blue-600"
                style={{
                  width: "72%",
                }}
              />

            </div>

          </div>

          {/* Course 2 */}

          <div className="mt-4 rounded-2xl border border-slate-100 p-4">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Data Analyst
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Excel • SQL • Python • Power BI
                  </p>
                </div>

              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                Active
              </span>

            </div>

            <div className="mt-5 flex items-center justify-between">

              <p className="text-xs font-semibold text-slate-500">
                18 Students
              </p>

              <p className="text-xs font-bold text-purple-600">
                58% Course Progress
              </p>

            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-purple-600"
                style={{
                  width: "58%",
                }}
              />

            </div>

          </div>

        </div>

        {/* =========================
            TODAY SUMMARY
        ========================= */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Today's Classes
              </p>

              <p className="text-xl font-extrabold text-slate-900">
                3 Classes
              </p>
            </div>

          </div>

          {/* Class */}

          <div className="mt-6 space-y-4">

            <ClassItem
              title="MERN Stack"
              batch="Batch A"
              time="10:00 AM"
              icon={<BookOpen />}
            />

            <ClassItem
              title="Data Analyst"
              batch="Batch B"
              time="12:30 PM"
              icon={<BarChart3 />}
            />

            <ClassItem
              title="JavaScript"
              batch="Batch C"
              time="04:00 PM"
              icon={<FileText />}
            />

          </div>

          <Link
            to="/teacher/batches"
            className="mt-5 block w-full rounded-xl bg-blue-600 py-2.5 text-center text-xs font-bold text-white hover:bg-blue-700"
          >
            View Schedule
          </Link>

        </div>

      </div>

      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6">

        <div>
          <h2 className="font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Quickly access your teaching activities.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <QuickAction
            to="/teacher/students"
            icon={<Users />}
            title="My Students"
            description="View students"
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <QuickAction
            to="/teacher/attendance"
            icon={<UserCheck />}
            title="Attendance"
            description="Mark attendance"
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />

          <QuickAction
            to="/teacher/assignments"
            icon={<ClipboardList />}
            title="Assignments"
            description="Manage assignments"
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />

          <QuickAction
            to="/teacher/exams"
            icon={<FileText />}
            title="Exams"
            description="Manage exams"
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
          />

        </div>

      </div>

      {/* =========================
          UPCOMING ACTIVITIES
      ========================= */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="font-bold text-slate-900">
              Upcoming Activities
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your upcoming teaching activities.
            </p>
          </div>

          <Clock3 className="h-5 w-5 text-slate-400" />

        </div>

        <div className="mt-4 divide-y divide-slate-100">

          <Activity
            title="React Assignment Review"
            date="Today"
            type="Assignment"
            icon={<ClipboardList />}
          />

          <Activity
            title="JavaScript Assessment"
            date="Tomorrow"
            type="Test"
            icon={<FileText />}
          />

          <Activity
            title="MERN Project Review"
            date="08 Sep"
            type="Project"
            icon={<BookOpen />}
          />

          <Activity
            title="Batch A Attendance"
            date="10 Sep"
            type="Attendance"
            icon={<UserCheck />}
          />

        </div>

      </div>

    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon,
  title,
  value,
  iconBg,
  iconColor,
  link,
}) => {
  return (
    <Link
      to={link}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
    >

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        {React.cloneElement(icon, {
          className: "h-5 w-5",
        })}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-extrabold text-slate-900 group-hover:text-blue-600">
        {value}
      </p>

    </Link>
  );
};

/* =========================================================
   QUICK ACTION
========================================================= */

const QuickAction = ({
  to,
  icon,
  title,
  description,
  iconBg,
  iconColor,
}) => {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-100 p-4 transition hover:border-slate-200 hover:bg-slate-50"
    >

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        {React.cloneElement(icon, {
          className: "h-5 w-5",
        })}
      </div>

      <p className="mt-3 text-sm font-bold text-slate-900 group-hover:text-blue-600">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </Link>
  );
};

/* =========================================================
   CLASS ITEM
========================================================= */

const ClassItem = ({
  title,
  batch,
  time,
  icon,
}) => {
  return (
    <div className="flex items-center justify-between gap-3">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          {React.cloneElement(icon, {
            className: "h-4 w-4",
          })}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {batch}
          </p>
        </div>

      </div>

      <span className="text-xs font-bold text-blue-600">
        {time}
      </span>

    </div>
  );
};

/* =========================================================
   ACTIVITY
========================================================= */

const Activity = ({
  title,
  date,
  type,
  icon,
}) => {
  return (
    <div className="flex items-center justify-between py-4">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          {React.cloneElement(icon, {
            className: "h-4 w-4",
          })}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {type}
          </p>
        </div>

      </div>

      <span className="text-xs font-bold text-blue-600">
        {date}
      </span>

    </div>
  );
};

export default TeacherDashboard;