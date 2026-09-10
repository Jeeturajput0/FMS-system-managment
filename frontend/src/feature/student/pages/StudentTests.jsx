import React from "react";
import { useStudentData } from "../context/StudentDataContext";

const StudentTests = () => {
  const { dashboard, loading, error } = useStudentData();
  const student = dashboard?.recent?.[0];

  if (loading) return <p className="text-sm text-slate-500">Loading tests...</p>;
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;

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
        <p className="text-sm text-slate-600">
          {student?.courseId?.title
            ? `No tests have been assigned for ${student.courseId.title} yet.`
            : "No tests have been assigned to you yet."}
        </p>
      </div>

    </div>
  );
};

export default StudentTests;