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
          <div key={course._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-400" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">Assigned course</p><h2 className="mt-2 text-xl font-black text-slate-900">{course.title}</h2></div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Active</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">{course.shortDescription || course.description}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Info label="Duration" value={course.duration?.value ? `${course.duration.value} ${course.duration.unit}` : "Not provided"} />
                <Info label="Batch" value={assignedStudent?.batchId?.name || assignedStudent?.batchId?.code || "Not assigned"} />
              </div>
              <Link to={`/student/courses/${course._id}`} className="mt-6 inline-flex rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600">Open course modules</Link>
            </div>
          </div>
        ))}
        {!courses.length && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No courses are available.</p>}
      </div>

    </div>
  );
};

const Info = ({ label, value }) => <div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-800">{value}</p></div>;

export default StudentCourses;