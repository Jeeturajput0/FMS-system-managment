import React from "react";

const TeacherHeader = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">

      {/* Left */}
      <div>
        <h2 className="text-lg font-black text-slate-900">
          Teacher Portal
        </h2>

        <p className="hidden text-xs text-slate-500 sm:block">
          Manage your teaching workspace
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button
          type="button"
          className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100"
        >
          🔔

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">

          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-slate-900">
              Teacher
            </p>

            <p className="text-xs text-slate-500">
              Faculty
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            T
          </div>

        </div>

      </div>

    </header>
  );
};

export default TeacherHeader;