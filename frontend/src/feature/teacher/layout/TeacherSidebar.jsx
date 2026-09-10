import React, { useEffect, useState } from "react";
import { Activity, BarChart3, BookOpen, ClipboardCheck, ClipboardList, GraduationCap, LayoutDashboard, LogOut, UserRound, Users, WalletCards } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const menuItems = [
  ["Dashboard", "/teacher", LayoutDashboard], ["My Courses", "/teacher/courses", BookOpen],
  ["My Students", "/teacher/students", Users], ["Batches", "/teacher/batches", GraduationCap],
  ["Attendance", "/teacher/attendance", ClipboardCheck], ["Assignments", "/teacher/assignments", ClipboardList],
  ["Exams", "/teacher/exams", Activity], ["Results", "/teacher/results", BarChart3], ["Fees", "/teacher/fees", WalletCards],
];

const TeacherSidebar = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  useEffect(() => { apiFetch("/api/portal/courses").then((response) => setCourses(response.data || [])).catch(() => {}); }, []);
  const courseLabel = courses.length === 1 ? courses[0].title || courses[0].name : courses.length > 1 ? `${courses.length} assigned courses` : "No course assigned";
  const logout = () => {
    localStorage.removeItem("ai_scholars_token");
    localStorage.removeItem("ai_scholars_user");
    navigate("/log", { replace: true });
  };
  return <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-800 bg-[#0F172A] text-slate-300 md:flex md:flex-col">
    <div className="flex h-16 items-center border-b border-slate-800/80 px-6"><div><h1 className="text-xl font-black text-white">AI SCHOLAR</h1><p className="text-xs font-semibold text-amber-400">Teacher Portal</p></div></div>
    <nav className="flex-1 space-y-1 overflow-y-auto p-4">{menuItems.map(([label, path, Icon]) => <NavLink key={path} to={path} end={path === "/teacher"} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${isActive ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"}`}><Icon size={18} className="transition-transform group-hover:scale-110" /><span>{label}{label === "My Courses" && <small className="mt-0.5 block max-w-40 truncate text-[10px] font-medium opacity-70">{courseLabel}</small>}</span></NavLink>)}</nav>
    <div className="border-t border-slate-800/80 p-4"><NavLink to="/teacher/profile" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${isActive ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"}`}><UserRound size={18} />My Profile</NavLink><button type="button" onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-400 hover:bg-red-950/40 hover:text-red-300"><LogOut size={18} />Logout</button></div>
  </aside>;
};
export default TeacherSidebar;
