import React from "react";
import { useStudentData } from "../context/StudentDataContext";

const StudentProgress = () => {
  const { dashboard, loading, error } = useStudentData();
  const student = dashboard?.recent?.[0];
  if (loading) return <p className="text-sm text-slate-500">Loading progress...</p>;
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-extrabold">
        My Progress
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <Card
          title="Course Progress"
          value={`${student?.courseProgress || 0}%`}
        />

        <Card
          title="Attendance"
          value={`${student?.attendancePercentage || dashboard?.attendance || 0}%`}
        />

        <Card
          title="Average Score"
          value="—"
        />

      </div>

    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200">

    <p className="text-xs text-slate-500">
      {title}
    </p>

    <p className="text-3xl font-extrabold mt-2">
      {value}
    </p>

  </div>
);

export default StudentProgress;