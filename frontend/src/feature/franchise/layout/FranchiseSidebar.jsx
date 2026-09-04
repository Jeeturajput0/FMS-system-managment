import React from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  IndianRupee,
  CalendarDays,
  ClipboardCheck,
  BarChart3,
  UserRound,
  Settings,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/franchise",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    path: "/franchise/students",
    icon: Users,
  },
  {
    label: "Courses",
    path: "/franchise/courses",
    icon: BookOpen,
  },
  {
    label: "Batches",
    path: "/franchise/batches",
    icon: GraduationCap,
  },
  {
    label: "Teachers",
    path: "/franchise/teachers",
    icon: UserRound,
  },
  {
    label: "Attendance",
    path: "/franchise/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Fees",
    path: "/franchise/fees",
    icon: IndianRupee,
  },
  {
    label: "Schedule",
    path: "/franchise/schedule",
    icon: CalendarDays,
  },
  {
    label: "Reports",
    path: "/franchise/reports",
    icon: BarChart3,
  },
];

export const FranchiseSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64
          bg-white border-r border-slate-200
          flex flex-col
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200">
          <div>
            <h1 className="text-xl font-black text-slate-900">
              AI Scholars
            </h1>

            <p className="text-xs font-medium text-slate-500">
              Franchise Portal
            </p>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/franchise"}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  px-4 py-3 rounded-xl
                  text-sm font-semibold
                  transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                  `
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-200 p-4">
          <NavLink
            to="/franchise/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-4 py-3 rounded-xl
              text-sm font-semibold
              ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }
              `
            }
          >
            <Settings size={19} />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
};