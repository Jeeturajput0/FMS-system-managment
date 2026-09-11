import { useEffect, useState } from "react";

import {
  CalendarDays,
  Clock3,
  DoorOpen,
  GraduationCap,
  Loader2,
  Users,
  BookOpen,
  Hash,
} from "lucide-react";

import { apiFetch } from "../../../utils/api";

const TeacherBatches = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH TEACHER BATCHES
  ========================================================= */

  useEffect(() => {
    const loadBatches = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(
          "/api/portal/teacher-batches"
        );

        setBatches(response?.data || []);
      } catch (requestError) {
        console.error(
          "Teacher batches error:",
          requestError
        );

        setError(
          requestError?.message ||
            "Failed to load batches"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBatches();
  }, []);

  /* =========================================================
     TOTAL STUDENTS
  ========================================================= */

  const totalStudents = batches.reduce(
    (total, batch) =>
      total + (batch?.students?.length || 0),
    0
  );

  /* =========================================================
     FORMAT DAYS
  ========================================================= */

  const getDays = (batch) => {
    if (Array.isArray(batch?.days)) {
      return batch.days.length
        ? batch.days.join(", ")
        : "Not set";
    }

    if (typeof batch?.days === "string") {
      return batch.days || "Not set";
    }

    return "Not set";
  };

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const getTime = (batch) => {
    if (batch?.time) {
      return batch.time;
    }

    if (batch?.startTime || batch?.endTime) {
      return [
        batch?.startTime,
        batch?.endTime,
      ]
        .filter(Boolean)
        .join(" - ");
    }

    return "Not set";
  };

  /* =========================================================
     COURSE NAME
  ========================================================= */

  const getCourseName = (batch) => {
    return (
      batch?.course?.title ||
      batch?.course?.name ||
      batch?.courseName ||
      "Course not set"
    );
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatus = (batch) => {
    if (
      batch?.status === "inactive" ||
      batch?.status === "completed" ||
      batch?.isActive === false
    ) {
      return "Inactive";
    }

    return "Active";
  };

  /* =========================================================
     STATUS STYLE
  ========================================================= */

  const getStatusClass = (status) => {
    if (status === "Active") {
      return "bg-emerald-50 text-emerald-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-full space-y-6 bg-slate-50/40 p-1">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              <GraduationCap size={14} />
              Teaching Dashboard
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              My Batches
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View the batches assigned to you,
              including their course, students and
              schedule.
            </p>

          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <GraduationCap size={27} />
          </div>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2">

          {/* ASSIGNED BATCHES */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Assigned Batches
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {batches.length}
                </p>

              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <GraduationCap size={21} />
              </div>

            </div>

          </div>


          {/* TOTAL STUDENTS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Total Students
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {totalStudents}
                </p>

              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Users size={21} />
              </div>

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">

          <Loader2
            size={30}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading your batches...
          </p>

        </div>
      )}


      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        !error &&
        batches.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <GraduationCap size={30} />
            </div>

            <h2 className="mt-5 text-lg font-black text-slate-800">
              No batches assigned
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You don't have any batches assigned
              to you yet. Once a batch is assigned,
              it will appear here.
            </p>

          </div>
        )}


      {/* =====================================================
          BATCH TABLE
      ===================================================== */}

      {!loading &&
        !error &&
        batches.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* TABLE HEADER */}

            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-base font-black text-slate-900">
                  Assigned Batches
                </h2>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  All batches currently assigned
                  to you.
                </p>

              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                <GraduationCap size={15} />
                {batches.length} Batches
              </div>

            </div>


            {/* =================================================
                RESPONSIVE TABLE
            ================================================= */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px] border-collapse">

                {/* =================================================
                    TABLE HEAD
                ================================================= */}

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    {/* S.NO */}

                    <th className="w-16 px-5 py-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                      S.No.
                    </th>

                    {/* BATCH */}

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Batch
                    </th>

                    {/* COURSE */}

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Course
                    </th>

                    {/* STUDENTS */}

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Students
                    </th>

                    {/* DAYS */}

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Days
                    </th>

                    {/* TIMING */}

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Timing
                    </th>

                    {/* ROOM */}

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Room
                    </th>

                    {/* STATUS */}

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                  </tr>

                </thead>


                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <tbody className="divide-y divide-slate-100">

                  {batches.map((batch, index) => {

                    const studentCount =
                      batch?.students?.length || 0;

                    const status =
                      getStatus(batch);

                    return (
                      <tr
                        key={
                          batch?._id ||
                          batch?.id ||
                          index
                        }
                        className="group transition-colors hover:bg-slate-50"
                      >

                        {/* =================================================
                            S.NO
                        ================================================= */}

                        <td className="px-5 py-5 text-center">

                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-600">
                            {index + 1}
                          </span>

                        </td>


                        {/* =================================================
                            BATCH
                        ================================================= */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <GraduationCap size={18} />
                            </div>

                            <div className="min-w-0">

                              <p className="max-w-[180px] truncate text-sm font-black text-slate-900">
                                {batch?.name ||
                                  "Unnamed Batch"}
                              </p>

                              <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">

                                <Hash size={10} />

                                {batch?.code ||
                                  "BATCH"}

                              </p>

                            </div>

                          </div>

                        </td>


                        {/* =================================================
                            COURSE
                        ================================================= */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

                            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                              <BookOpen size={15} />
                            </div>

                            <span className="max-w-[200px] truncate text-xs font-bold text-slate-700">
                              {getCourseName(batch)}
                            </span>

                          </div>

                        </td>


                        {/* =================================================
                            STUDENTS
                        ================================================= */}

                        <td className="px-5 py-5">

                          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">

                            <Users
                              size={15}
                              className="text-emerald-600"
                            />

                            <span className="text-xs font-black text-emerald-700">
                              {studentCount}
                            </span>

                          </div>

                        </td>


                        {/* =================================================
                            DAYS
                        ================================================= */}

                        <td className="px-5 py-5">

                          <div className="flex items-start gap-2">

                            <CalendarDays
                              size={15}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />

                            <span className="max-w-[180px] text-xs font-semibold leading-5 text-slate-600">
                              {getDays(batch)}
                            </span>

                          </div>

                        </td>


                        {/* =================================================
                            TIMING
                        ================================================= */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

                            <Clock3
                              size={15}
                              className="shrink-0 text-blue-500"
                            />

                            <span className="whitespace-nowrap text-xs font-bold text-slate-700">
                              {getTime(batch)}
                            </span>

                          </div>

                        </td>


                        {/* =================================================
                            ROOM
                        ================================================= */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

                            <DoorOpen
                              size={15}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="text-xs font-bold text-slate-700">
                              {batch?.room ||
                                batch?.roomNo ||
                                "Not set"}
                            </span>

                          </div>

                        </td>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <td className="px-5 py-5">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ${getStatusClass(
                              status
                            )}`}
                          >

                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                status === "Active"
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            />

                            {status}

                          </span>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>
        )}

    </div>
  );
};

export default TeacherBatches;