import React from "react";

const TeacherBatches = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black text-slate-900">
          My Batches
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage batches assigned to you.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">

        <div className="border-b p-5">
          <h2 className="font-black">
            Batch List
          </h2>
        </div>

        <div className="p-10 text-center text-sm text-slate-500">
          No batches assigned yet.
        </div>

      </div>

    </div>
  );
};

export default TeacherBatches;