import React from "react";
import { useStudentData } from "../context/StudentDataContext";

const StudentAssignments = () => {
  const { dashboard, loading, error } = useStudentData();
  const student = dashboard?.recent?.[0];

  if (loading) return <p className="text-sm text-slate-500">Loading assignments...</p>;
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;

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
        <p className="text-sm text-slate-600">
          {student?.courseId?.title
            ? `No assignments have been assigned for ${student.courseId.title} yet.`
            : "No assignments have been assigned to you yet."}
        </p>
      </div>

    </div>
  );
};

export default StudentAssignments;