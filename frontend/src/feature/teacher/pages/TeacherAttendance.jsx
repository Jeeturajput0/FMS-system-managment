import React from "react";

const TeacherAttendance = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Attendance
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Mark and manage student attendance.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">

        <div className="grid gap-4 md:grid-cols-3">

          <div>
            <label className="mb-2 block text-sm font-bold">
              Select Batch
            </label>

            <select className="w-full rounded-xl border p-3">
              <option>
                Select Batch
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Date
            </label>

            <input
              type="date"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="flex items-end">
            <button className="w-full rounded-xl bg-blue-600 p-3 font-bold text-white">
              Load Students
            </button>
          </div>

        </div>

        <div className="mt-8 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
          Select a batch and date to mark attendance.
        </div>

      </div>

    </div>
  );
};

export default TeacherAttendance;