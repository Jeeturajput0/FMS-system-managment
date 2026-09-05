import React from "react";

const StudentProgress = () => {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-extrabold">
        My Progress
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <Card
          title="Course Progress"
          value="68%"
        />

        <Card
          title="Attendance"
          value="87%"
        />

        <Card
          title="Average Score"
          value="82%"
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