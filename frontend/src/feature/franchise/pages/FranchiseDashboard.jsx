import React from "react";

export const FranchiseDashboard = () => {
  return (
    <div className="space-y-6">

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Franchise Portal
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your franchise operations from one place.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Total Students
          </p>

          <h2 className="mt-2 text-3xl font-black">
            248
          </h2>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Active Courses
          </p>

          <h2 className="mt-2 text-3xl font-black">
            12
          </h2>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Running Batches
          </p>

          <h2 className="mt-2 text-3xl font-black">
            18
          </h2>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Pending Fees
          </p>

          <h2 className="mt-2 text-3xl font-black">
            ₹42,500
          </h2>
        </div>

      </div>

    </div>
  );
};