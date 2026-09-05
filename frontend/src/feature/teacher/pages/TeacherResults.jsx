import React from "react";

const TeacherResults = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Results
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View and manage student results.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">

        <div className="border-b p-5">
          <h2 className="font-black">
            Student Results
          </h2>
        </div>

        <div className="p-10 text-center text-sm text-slate-500">
          No results available.
        </div>

      </div>

    </div>
  );
};

export default TeacherResults;