import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  ShieldCheck,
  Check,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useData } from '../../../context/DataContext';

const titleMap = {
  '/admin/dashboard': 'Overview Dashboard',
  '/admin/franchises': 'Franchise Network Management',
  '/admin/courses': 'Curriculum & Master Course Catalog',
  '/admin/students': 'Student Directory & LMS Records',
  '/admin/fees': 'Fee Collections & Financial OS',
  '/admin/certificates': 'AI Certificate Issuance Engine',
  '/admin/notifications': 'Notification Center',
  '/admin/admins': 'Admin User Management',
  '/admin/reports': 'Analytics & Franchise Performance Reports',
  '/admin/settings': 'System & Franchise OS Preferences'
};

export const TopHeader = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const currentUser = JSON.parse(localStorage.getItem('ai_scholars_user') || 'null');
  const profileName = currentUser?.name || 'Admin';
  const profileEmail = currentUser?.email || 'admin@aischolar.com';
  const profileRole = currentUser?.role || 'ADMIN';

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Dynamic breadcrumb text
  const currentTitle = titleMap[location.pathname] || 'Admin Portal';
  const pathParts = location.pathname.split('/').filter(Boolean);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/students?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-0.5 font-medium">
            <Link to="/admin/dashboard" className="hover:text-orange-600 transition-colors">
              AI Scholars
            </Link>
            {pathParts.map((part, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="capitalize text-slate-700 font-semibold">{part}</span>
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{currentTitle}</h1>
        </div>
      </div>

      {/* Right: Search, Notifications, Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search students, courses, receipts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
          />
        </form>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  {unreadNotifs.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                        !notif.read ? 'bg-orange-50/30' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <Link
                  to="/admin/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  View Notification Center →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Super Admin Badge & Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-100 border border-slate-200/80 transition-all text-left"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
              alt={profileName}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-orange-500/40"
            />
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-900 leading-tight">{profileName}</p>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                  <ShieldCheck className="w-3 h-3 text-amber-600" /> {profileRole}
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-600">HQ Master Control</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-900">{profileName}</p>
                <p className="text-xs text-slate-600">{profileEmail}</p>
              </div>
              <Link
                to="/admin/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" /> Account Settings
              </Link>
              <Link
                to="/admin/admins"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" /> Manage Admins
              </Link>
              <div className="border-t border-slate-100 my-1"></div>
              <Link
                to="/login"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
