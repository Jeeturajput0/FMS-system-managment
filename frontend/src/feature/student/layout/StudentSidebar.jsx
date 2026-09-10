import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FlaskConical,
  BarChart3,
  CreditCard,
  Award,
  Bell,
  User,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

const StudentSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = () => onClose?.();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20"
        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("ai_scholars_token");
    localStorage.removeItem("ai_scholars_user");
    localStorage.removeItem("studentData");
    navigate("/log", { replace: true });
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 min-h-screen flex-col bg-[#0F172A] text-white transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>

            <div>
              <h1 className="font-extrabold text-lg">AI SCHOLAR</h1>

              <p className="text-[10px] text-slate-400">
                Learn Today, Build Tomorrow
              </p>
            </div>
          </div>

          <p className="text-xs font-bold text-amber-400 mt-5">
            Student Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-2">
          {/* Dashboard */}
          <NavLink to="/student/dashboard" className={linkClass} onClick={handleNavigation}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>

          <NavLink to="/student/courses" className={linkClass} onClick={handleNavigation}>
            <BookOpen className="w-5 h-5" />
            My Course
          </NavLink>

          <NavLink to="/student/assignments" className={linkClass} onClick={handleNavigation}>
            <ClipboardList className="w-5 h-5" />
            Assignments
          </NavLink>

          <NavLink to="/student/tests" className={linkClass} onClick={handleNavigation}>
            <FlaskConical className="w-5 h-5" />
            Tests & Exams
          </NavLink>

          <NavLink to="/student/progress" className={linkClass} onClick={handleNavigation}>
            <BarChart3 className="w-5 h-5" />
            My Progress
          </NavLink>

          <NavLink to="/student/fees" className={linkClass} onClick={handleNavigation}>
            <CreditCard className="w-5 h-5" />
            Fees
          </NavLink>

          <NavLink to="/student/certificate" className={linkClass} onClick={handleNavigation}>
            <Award className="w-5 h-5" />
            Certificate
          </NavLink>

          {/* Notifications */}
          <NavLink to="/student/notifications" className={linkClass} onClick={handleNavigation}>
            <Bell className="w-5 h-5" />
            Notifications
          </NavLink>

          {/* Profile */}
          <NavLink to="/student/profile" className={linkClass} onClick={handleNavigation}>
            <User className="w-5 h-5" />
            My Profile
          </NavLink>

          {/* Settings */}
          <NavLink to="/student/settings" className={linkClass} onClick={handleNavigation}>
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-slate-800/60"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
mere student ke sidebar course card ko sahi se view krao aur course  pe click krne pe course ke module show kraye module pe click krne pe topic show kraye
