import React from "react";
import {
  Menu,
  Bell,
  UserCircle,
} from "lucide-react";

const StudentHeader = () => {
  const user = JSON.parse(
    localStorage.getItem("ai_scholars_user") || "{}",
  );

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">

      {/* Mobile menu */}
      <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="hidden md:block">
        <p className="text-xs text-slate-400">
          Student Portal
        </p>

        <p className="font-bold text-slate-900">
          AI Scholar
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 ml-auto">

        {/* Notification */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100">

          <Bell className="w-5 h-5 text-slate-600" />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />

        </button>

        {/* User */}
        <div className="flex items-center gap-3">

          <UserCircle className="w-9 h-9 text-blue-600" />

          <div className="hidden sm:block">

            <p className="text-sm font-bold text-slate-900">
              {user.name || "Student"}
            </p>

            <p className="text-[10px] text-slate-500">
              Student
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default StudentHeader;