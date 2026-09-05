import React from "react";

const TeacherCourses = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black text-slate-900">
          My Courses
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Courses assigned to your teaching account.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 text-3xl">
            📚
          </div>

          <h2 className="text-xl font-black">
            No Courses
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Courses assigned to you will appear here.
          </p>
        </div>

      </div>

    </div>
  );
};

export default TeacherCourses;