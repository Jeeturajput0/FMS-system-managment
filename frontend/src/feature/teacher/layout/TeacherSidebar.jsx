import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/teacher",
    icon: "🏠",
  },
  {
    label: "My Courses",
    path: "/teacher/courses",
    icon: "📚",
  },
  {
    label: "My Students",
    path: "/teacher/students",
    icon: "👨‍🎓",
  },
  {
    label: "Batches",
    path: "/teacher/batches",
    icon: "👥",
  },
  {
    label: "Attendance",
    path: "/teacher/attendance",
    icon: "✅",
  },
  {
    label: "Assignments",
    path: "/teacher/assignments",
    icon: "📝",
  },
  {
    label: "Exams",
    path: "/teacher/exams",
    icon: "📋",
  },
  {
    label: "Results",
    path: "/teacher/results",
    icon: "📊",
  },
  {
    label: "Fees",
    path: "/teacher/fees",
    icon: "💰",
  },
];

const TeacherSidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white md:block">

      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-xl font-black text-blue-600">
            AI SCHOLAR
          </h1>

          <p className="text-xs font-semibold text-slate-400">
            Teacher Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/teacher"}
            className={({ isActive }) =>
              `
              flex items-center gap-3 rounded-xl px-4 py-3
              text-sm font-bold transition
              ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
              `
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </NavLink>
        ))}

      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">

        <NavLink
          to="/teacher/profile"
          className={({ isActive }) =>
            `
            flex items-center gap-3 rounded-xl px-4 py-3
            text-sm font-bold
            ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50"
            }
            `
          }
        >
          <span>👤</span>
          <span>My Profile</span>
        </NavLink>

      </div>

    </aside>
  );
};

export default TeacherSidebar;