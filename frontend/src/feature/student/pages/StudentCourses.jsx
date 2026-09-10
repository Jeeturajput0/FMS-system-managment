import React from "react";
import { Link } from "react-router-dom";
import { useStudentData } from "../context/StudentDataContext";

const StudentCourses = () => {
  const { courses, dashboard, loading, error } = useStudentData();
  const assignedStudent = dashboard?.recent?.[0];
  if (loading) return <p className="text-sm text-slate-500">Loading courses...</p>;
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold">
          My Course
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          View your assigned course and learning content.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <div key={course._id} className="bg-white p-6 rounded-3xl border border-slate-200">
            <h2 className="text-lg font-bold">{course.title}</h2>
            <p className="text-sm text-slate-500 mt-2">{course.shortDescription || course.description}</p>
            <p className="mt-3 text-xs font-semibold text-slate-500">
              Batch: {assignedStudent?.batchId?.name || assignedStudent?.batchId?.code || "Not assigned"}
            </p>
            <Link to={`/student/courses/${course._id}`} className="mt-4 inline-block text-sm font-bold text-blue-600">View course</Link>
          </div>
        ))}
        {!courses.length && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No courses are available.</p>}
      </div>

    </div>
  );
};

export default StudentCourses;