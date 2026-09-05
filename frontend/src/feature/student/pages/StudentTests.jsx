import React from "react";

const StudentTests = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold">
          Tests & Exams
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          View upcoming tests and exams.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6">

        <h2 className="font-bold">
          JavaScript Fundamentals Test
        </h2>

        <p className="text-xs text-slate-500 mt-2">
          25 Questions • 30 Minutes
        </p>

        <button className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Start Test
        </button>

      </div>

    </div>
  );
};

export default StudentTests;