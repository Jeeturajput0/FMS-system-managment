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
} from "lucide-react";
import logo from "../../../../assist/logo.png";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { logout } from "../../../store/auth/authSlice";
import { resetServerState } from "../../../store/reset";
import { selectStudentCourse } from "../../../store/selectors";

const StudentSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const course = useAppSelector(selectStudentCourse);

  const handleNavigation = () => onClose?.();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20"
        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
    }`;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetServerState());
    onClose?.();
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
            <div>
              <img src={logo} alt="AI Scholars" className="h-12 w-auto max-w-[190px] object-contain" />

              
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
            <span className="min-w-0"><span className="block">My Course</span></span>
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
