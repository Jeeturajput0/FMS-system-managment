import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FlaskConical,
  BarChart3,
  Clock3,
  Trophy,
  CreditCard,
  Award,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  GraduationCap,
  FileText,
} from "lucide-react";

const StudentSidebar = () => {
  const [openMenu, setOpenMenu] = useState("course");

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? "" : menu));
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const subLinkClass = ({ isActive }) =>
    `block px-4 py-2 ml-8 rounded-lg text-xs font-medium transition ${
      isActive
        ? "text-blue-300 bg-white/10"
        : "text-slate-400 hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <aside className="w-72 min-h-screen bg-slate-950 text-white hidden lg:flex flex-col">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>

          <div>
            <h1 className="font-extrabold text-lg">
              AI SCHOLAR
            </h1>

            <p className="text-[10px] text-slate-400">
              Learn Today, Build Tomorrow
            </p>
          </div>

        </div>

        <p className="text-xs font-bold text-blue-400 mt-5">
          Student Portal
        </p>

      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-2">

        {/* Dashboard */}
        <NavLink
          to="/student/dashboard"
          className={linkClass}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        {/* My Course */}
        <div>

          <button
            onClick={() => toggleMenu("course")}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
          >

            <span className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              My Course
            </span>

            <ChevronDown
              className={`w-4 h-4 transition ${
                openMenu === "course" ? "rotate-180" : ""
              }`}
            />

          </button>

          {openMenu === "course" && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/student/courses"
                className={subLinkClass}
              >
                Course Overview
              </NavLink>

              <NavLink
                to="/student/courses/modules"
                className={subLinkClass}
              >
                Modules
              </NavLink>

              <NavLink
                to="/student/courses/topics"
                className={subLinkClass}
              >
                Topics
              </NavLink>

              <NavLink
                to="/student/courses/material"
                className={subLinkClass}
              >
                Study Material
              </NavLink>

            </div>
          )}

        </div>

        {/* Assignments */}
        <div>

          <button
            onClick={() => toggleMenu("assignments")}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
          >

            <span className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5" />
              Assignments
            </span>

            <ChevronDown
              className={`w-4 h-4 ${
                openMenu === "assignments"
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {openMenu === "assignments" && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/student/assignments"
                className={subLinkClass}
              >
                All Assignments
              </NavLink>

              <NavLink
                to="/student/assignments/pending"
                className={subLinkClass}
              >
                Pending
              </NavLink>

              <NavLink
                to="/student/assignments/submitted"
                className={subLinkClass}
              >
                Submitted
              </NavLink>

            </div>
          )}

        </div>

        {/* Tests */}
        <div>

          <button
            onClick={() => toggleMenu("tests")}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
          >

            <span className="flex items-center gap-3">
              <FlaskConical className="w-5 h-5" />
              Tests & Exams
            </span>

            <ChevronDown
              className={`w-4 h-4 ${
                openMenu === "tests"
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {openMenu === "tests" && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/student/tests"
                className={subLinkClass}
              >
                Upcoming Tests
              </NavLink>

              <NavLink
                to="/student/tests/attempt"
                className={subLinkClass}
              >
                Attempt Test
              </NavLink>

              <NavLink
                to="/student/tests/results"
                className={subLinkClass}
              >
                Results
              </NavLink>

            </div>
          )}

        </div>

        {/* Progress */}
        <div>

          <button
            onClick={() => toggleMenu("progress")}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
          >

            <span className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5" />
              My Progress
            </span>

            <ChevronDown
              className={`w-4 h-4 ${
                openMenu === "progress"
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {openMenu === "progress" && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/student/progress"
                className={subLinkClass}
              >
                Course Progress
              </NavLink>

              <NavLink
                to="/student/attendance"
                className={subLinkClass}
              >
                Attendance
              </NavLink>

              <NavLink
                to="/student/performance"
                className={subLinkClass}
              >
                Performance
              </NavLink>

            </div>
          )}

        </div>

        {/* Fees */}
        <div>

          <button
            onClick={() => toggleMenu("fees")}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
          >

            <span className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" />
              Fees
            </span>

            <ChevronDown
              className={`w-4 h-4 ${
                openMenu === "fees"
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {openMenu === "fees" && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/student/fees"
                className={subLinkClass}
              >
                Fee Details
              </NavLink>

              <NavLink
                to="/student/fees/history"
                className={subLinkClass}
              >
                Payment History
              </NavLink>

              <NavLink
                to="/student/fees/pending"
                className={subLinkClass}
              >
                Pending Fees
              </NavLink>

            </div>
          )}

        </div>

        {/* Certificate */}
        <div>

          <button
            onClick={() => toggleMenu("certificate")}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
          >

            <span className="flex items-center gap-3">
              <Award className="w-5 h-5" />
              Certificate
            </span>

            <ChevronDown
              className={`w-4 h-4 ${
                openMenu === "certificate"
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {openMenu === "certificate" && (
            <div className="mt-1 space-y-1">

              <NavLink
                to="/student/certificate/eligibility"
                className={subLinkClass}
              >
                Eligibility
              </NavLink>

              <NavLink
                to="/student/certificate"
                className={subLinkClass}
              >
                Certificate
              </NavLink>

              <NavLink
                to="/student/certificate/verify"
                className={subLinkClass}
              >
                Verify Certificate
              </NavLink>

            </div>
          )}

        </div>

        {/* Notifications */}
        <NavLink
          to="/student/notifications"
          className={linkClass}
        >
          <Bell className="w-5 h-5" />
          Notifications
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/student/profile"
          className={linkClass}
        >
          <User className="w-5 h-5" />
          My Profile
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/student/settings"
          className={linkClass}
        >
          <Settings className="w-5 h-5" />
          Settings
        </NavLink>

      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

      </div>

    </aside>
  );
};

export default StudentSidebar;