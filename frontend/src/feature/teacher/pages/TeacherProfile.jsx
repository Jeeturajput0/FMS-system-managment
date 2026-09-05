import React from "react";

const TeacherProfile = () => {
  return (
    <div className="max-w-3xl space-y-6">

      <div>
        <h1 className="text-3xl font-black text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your teacher profile.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">

        <div className="flex items-center gap-5">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-black text-white">
            T
          </div>

          <div>
            <h2 className="text-xl font-black">
              Teacher
            </h2>

            <p className="text-sm text-slate-500">
              Faculty
            </p>
          </div>

        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-bold">
              Name
            </label>

            <input
              className="w-full rounded-xl border p-3"
              placeholder="Teacher Name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Email
            </label>

            <input
              type="email"
              className="w-full rounded-xl border p-3"
              placeholder="teacher@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Mobile
            </label>

            <input
              className="w-full rounded-xl border p-3"
              placeholder="Mobile number"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Designation
            </label>

            <input
              className="w-full rounded-xl border p-3"
              placeholder="Faculty"
            />
          </div>

        </div>

        <button className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">
          Save Profile
        </button>

      </div>

    </div>
  );
};

export default TeacherProfile;