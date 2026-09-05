import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  CheckSquare,
  CircleUserRound,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
  ClipboardCheck,
} from "lucide-react";

const menus = {
  STUDENT: [
    ["Dashboard", "/student/dashboard", LayoutDashboard],
    [
      "My Course",
      "/student/courses",
      BookOpen,
      ["Course Overview", "Modules", "Topics", "Study Material"],
    ],
    [
      "Assignments",
      "/student/assignments",
      FileText,
      ["All Assignments", "Pending", "Submitted"],
    ],
    [
      "Tests & Exams",
      "/student/tests",
      ClipboardCheck,
      ["Upcoming Tests", "Attempt Test", "Results"],
    ],
    [
      "My Progress",
      "/student/progress",
      ChartNoAxesCombined,
      ["Course Progress", "Attendance", "Performance"],
    ],
    [
      "Fees",
      "/student/fees",
      CreditCard,
      ["Fee Details", "Payment History", "Pending Fees"],
    ],
    [
      "Certificate",
      "/student/certificate",
      Award,
      ["Eligibility", "Certificate", "Verify Certificate"],
    ],
    ["Notifications", "/student/notifications", Bell],
    ["My Profile", "/student/profile", CircleUserRound],
    ["Settings", "/student/settings", Settings],
  ],
  TEACHER: [
    ["Dashboard", "/teacher/dashboard", LayoutDashboard],
    [
      "My Courses",
      "/teacher/courses",
      BookOpen,
      ["Assigned Courses", "Course Content", "Modules & Topics"],
    ],
    [
      "My Batches",
      "/teacher/batches",
      CalendarDays,
      ["All Batches", "Today's Classes", "Class Schedule"],
    ],
    [
      "Students",
      "/teacher/students",
      Users,
      ["My Students", "Student Progress", "Student Performance"],
    ],
    [
      "Attendance",
      "/teacher/attendance",
      ClipboardCheck,
      ["Mark Attendance", "Attendance History", "Attendance Report"],
    ],
    [
      "Assignments",
      "/teacher/assignments",
      FileText,
      ["Create Assignment", "All Assignments", "Submissions"],
    ],
    [
      "Tests",
      "/teacher/tests",
      CheckSquare,
      ["Create Test", "Test List", "Questions", "Results"],
    ],
    [
      "Performance",
      "/teacher/performance",
      ChartNoAxesCombined,
      ["Batch Performance", "Student Performance", "Reports"],
    ],
    ["Announcements", "/teacher/announcements", Bell],
    ["My Profile", "/teacher/profile", CircleUserRound],
    ["Settings", "/teacher/settings", Settings],
  ],
 
};

const labels = {
  STUDENT: "Student Portal",
  TEACHER: "Teacher Portal",
  FRANCHISE: "Franchise Portal",
};

export const getPortalMenu = (role) => menus[role] || menus.STUDENT;

export const PortalLayout = ({ role }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("ai_scholars_user") || "null");
  const menu = getPortalMenu(role);
  const logout = () => {
    localStorage.removeItem("ai_scholars_token");
    localStorage.removeItem("ai_scholars_user");
    navigate("/log");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-xl transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-24 items-center gap-3 border-b border-slate-100 px-6">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-900">
              AI SCHOLAR
            </p>
            <p className="text-xs font-semibold text-blue-600">
              {labels[role]}
            </p>
          </div>
          <button
            className="ml-auto text-slate-400 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {menu.map(([name, path, Icon, children]) => (
            <div key={name} className="mb-1">
              <NavLink
                onClick={() => setOpen(false)}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"}`
                }
              >
                <Icon size={18} />
                <span>{name}</span>
              </NavLink>
              {children && (
                <div className="ml-11 mt-1 space-y-1 border-l border-slate-200 pl-3">
                  {children.map((child) => (
                    <NavLink
                      key={child}
                      to={`${path}/${child.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2 py-1 text-xs text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      {child}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
            <button
              title="Logout"
              onClick={logout}
              className="ml-auto text-slate-400 hover:text-red-500"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur sm:px-8">
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="text-slate-600 lg:hidden"
          >
            <Menu />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </p>
            <p className="font-bold text-slate-900">{labels[role]}</p>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={19} className="text-slate-400" />
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <span className="text-sm font-bold text-slate-700">
              {user?.name || "User"}
            </span>
          </div>
        </header>
        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
