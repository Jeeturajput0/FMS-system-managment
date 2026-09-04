import React from "react";
import { Link } from "react-router-dom";

export const FranchiseStudents = () => {
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Students
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage all students enrolled in your franchise.
          </p>
        </div>

        <Link
          to="/franchise/students/add"
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
        >
          + Add Student
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left text-sm">Student</th>
              <th className="p-4 text-left text-sm">Mobile</th>
              <th className="p-4 text-left text-sm">Course</th>
              <th className="p-4 text-left text-sm">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-100">
              <td className="p-4 font-semibold">
                Rahul Sharma
              </td>

              <td className="p-4">
                9876543210
              </td>

              <td className="p-4">
                Full Stack Development
              </td>

              <td className="p-4">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Active
                </span>
              </td>
            </tr>
          </tbody>

        </table>

      </div>

    </div>
  );
};