import React, { useEffect, useState } from "react";
import { Activity, BarChart3, BookOpen, ClipboardCheck, ClipboardList, GraduationCap, LayoutDashboard, UserRound, Users, WalletCards } from "lucide-react";
import { NavLink } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const menuItems = [
  ["Dashboard", "/teacher", LayoutDashboard], ["My Courses", "/teacher/courses", BookOpen],
  ["My Students", "/teacher/students", Users], ["Batches", "/teacher/batches", GraduationCap],
  ["Attendance", "/teacher/attendance", ClipboardCheck], ["Assignments", "/teacher/assignments", ClipboardList],
  ["Exams", "/teacher/exams", Activity], ["Results", "/teacher/results", BarChart3], ["Fees", "/teacher/fees", WalletCards],
];

const TeacherSidebar = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => { apiFetch("/api/portal/courses").then((response) => setCourses(response.data || [])).catch(() => {}); }, []);
  const courseLabel = courses.length === 1 ? courses[0].title || courses[0].name : courses.length > 1 ? `${courses.length} assigned courses` : "No course assigned";
  return <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white md:flex md:flex-col">
    <div className="flex h-16 items-center border-b border-slate-200 px-6"><div><h1 className="text-xl font-black text-blue-600">AI SCHOLAR</h1><p className="text-xs font-semibold text-slate-400">Teacher Portal</p></div></div>
    <nav className="flex-1 space-y-1 overflow-y-auto p-4">{menuItems.map(([label, path, Icon]) => <NavLink key={path} to={path} end={path === "/teacher"} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${isActive ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><Icon size={18} /><span>{label}{label === "My Courses" && <small className="mt-0.5 block max-w-40 truncate text-[10px] font-medium opacity-70">{courseLabel}</small>}</span></NavLink>)}</nav>
    <div className="border-t border-slate-200 p-4"><NavLink to="/teacher/profile" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${isActive ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}><UserRound size={18} />My Profile</NavLink></div>
  </aside>;
};
export default TeacherSidebar;
