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
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../../assist/logo.png";

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
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("ai_scholars_token");
    localStorage.removeItem("ai_scholars_user");
    navigate("/log", { replace: true });
  };
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
          bg-[#0F172A] text-slate-300 border-r border-slate-800
          flex flex-col
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div>
            <img
              src={logo}
              alt="AI Scholars"
              className="h-12 w-auto max-w-[190px] object-contain"
            />
            <p className="text-xs font-medium text-amber-400">
              Franchise Portal
            </p>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
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
                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
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
        <div className="border-t border-slate-800/80 p-4">
          <NavLink
            to="/franchise/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-4 py-3 rounded-xl
              text-sm font-semibold
              ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }
              `
            }
          >
            <Settings size={19} />
            Settings
          </NavLink>
          <button
            type="button"
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 hover:bg-red-950/40 hover:text-red-300"
          >
            <LogOut size={19} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};
