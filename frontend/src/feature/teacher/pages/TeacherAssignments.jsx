import React from "react";

const TeacherAssignments = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Assignments
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create and manage assignments for your students.
        </p>
      </div>

      <div className="flex justify-end">
        <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">
          + Create Assignment
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        No assignments found.
      </div>

    </div>
  );
};

export default TeacherAssignments;