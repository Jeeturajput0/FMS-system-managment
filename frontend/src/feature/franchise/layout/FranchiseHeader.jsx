import React from "react";
import {
  Menu,
  Bell,
  Search,
} from "lucide-react";

export const FranchiseHeader = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-slate-200">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-3">

          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>

          <div className="hidden sm:flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-10 w-64">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search..."
              className="w-full outline-none text-sm"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          <button className="relative p-2.5 rounded-xl hover:bg-slate-100">
            <Bell size={20} />

            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              F
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900">
                Franchise Admin
              </p>

              <p className="text-xs text-slate-500">
                Franchise
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};