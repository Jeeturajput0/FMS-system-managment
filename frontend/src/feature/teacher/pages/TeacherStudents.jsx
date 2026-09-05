import React from "react";
import { Link } from "react-router-dom";

const TeacherStudents = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black text-slate-900">
          My Students
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Students assigned to your teaching workspace.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left text-sm">
                Student
              </th>

              <th className="p-4 text-left text-sm">
                Course
              </th>

              <th className="p-4 text-left text-sm">
                Batch
              </th>

              <th className="p-4 text-left text-sm">
                Attendance
              </th>

              <th className="p-4 text-left text-sm">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td
                colSpan="5"
                className="p-10 text-center text-sm text-slate-500"
              >
                No students found.
              </td>
            </tr>
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default TeacherStudents;