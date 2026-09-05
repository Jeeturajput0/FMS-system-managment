import React from "react";

const StudentCourses = () => {
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

      <div className="bg-white p-6 rounded-3xl border border-slate-200">

        <h2 className="text-lg font-bold">
          MERN Stack Development
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          HTML, CSS, JavaScript, React, Node.js,
          Express.js and MongoDB
        </p>

      </div>

    </div>
  );
};

export default StudentCourses;