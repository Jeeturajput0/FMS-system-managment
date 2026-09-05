import React from "react";

const StudentAssignments = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold">
          Assignments
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          View and submit your assignments.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6">

        <p className="text-sm font-bold">
          React Todo Application
        </p>

        <p className="text-xs text-slate-500 mt-1">
          Due: 10 September 2026
        </p>

        <span className="inline-block mt-4 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
          Pending
        </span>

      </div>

    </div>
  );
};

export default StudentAssignments;