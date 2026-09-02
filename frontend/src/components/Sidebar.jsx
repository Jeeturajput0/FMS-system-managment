import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Users,
  CreditCard,
  Award,
  Bell,
  ShieldCheck,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  ChevronRight,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import logo from '../../assist/logo.png';
const navItems = [
  { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Franchises', path: '/admin/franchises', icon: Building2 },
  { name: 'Courses', path: '/admin/courses', icon: BookOpen },
  { name: 'Students', path: '/admin/students', icon: Users },
  { name: 'Fees', path: '/admin/fees', icon: CreditCard },
  { name: 'Certificates', path: '/admin/certificates', icon: Award },
  { name: 'Admins', path: '/admin/admins', icon: ShieldCheck },
  { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { notifications } = useData();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800 shadow-2xl`}
      >
        {/* Brand Header */}
      {/* Brand Header */}
<div className="h-20 px-5 flex items-center justify-between border-b border-slate-800/80">
  <div className="flex items-center min-w-0">
    <img
      src={logo}
      alt="AI Scholars"
      className="h-12 w-auto max-w-[190px] object-contain"
    />
  </div>

  <button
    onClick={onClose}
    className="lg:hidden ml-2 shrink-0 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
  >
    <X className="w-5 h-5" />
  </button>
</div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Main OS Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && unreadCount > 0 && (
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive ? 'bg-white text-orange-600' : 'bg-orange-500 text-white'
                  }`}>
                    {unreadCount}
                  </span>
                )}
                {!isActive && !item.badge && (
                  <ChevronRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Admin User Profile Bottom Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                alt="Arjun"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/50"
              />
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate">Arjun Sharma</p>
                <p className="text-[11px] font-medium text-amber-400 truncate">Super Admin HQ</p>
              </div>
            </div>
            <NavLink
              to="/login"
              title="Logout"
              className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};
