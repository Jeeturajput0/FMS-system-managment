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

import { apiFetch, assetUrl } from "../../../utils/api";

const TeacherBatches = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Get batch image
  const getBatchImage = (batch) => {
    if (!batch?.image) return "";

    // If image is already a full URL
    if (
      batch.image.startsWith("http://") ||
      batch.image.startsWith("https://")
    ) {
      return batch.image;
    }

    return assetUrl(batch.image);
  };

  // Fetch teacher batches
  useEffect(() => {
    const loadBatches = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch("/api/portal/teacher-batches");

        setBatches(response?.data || []);
      } catch (requestError) {
        setError(
          requestError?.message || "Failed to load batches"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBatches();
  }, []);

  // Total students
  const totalStudents = batches.reduce(
    (total, batch) => total + (batch?.students?.length || 0),
    0
  );

  return (
    <div className="min-h-full space-y-6 bg-slate-50/40 p-1">
      {/* ================= HEADER ================= */}
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
              View the batches assigned to you, including their
              course, students and schedule.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <GraduationCap size={27} />
          </div>
        </div>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ================= SUMMARY ================= */}
      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Assigned Batches */}
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

          {/* Total Students */}
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

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
          <Loader2
            size={28}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading your batches...
          </p>
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && !error && batches.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <GraduationCap size={30} />
          </div>

          <h2 className="mt-5 text-lg font-black text-slate-800">
            No batches assigned
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            You don't have any batches assigned to you yet. Once a
            batch is assigned, it will appear here.
          </p>
        </div>
      )}

      {/* ================= BATCH CARDS ================= */}
      {!loading && batches.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {batches.map((batch) => {
            const image = getBatchImage(batch);

            const studentCount =
              batch?.students?.length || 0;

            const courseName =
              batch?.course?.title ||
              batch?.course?.name ||
              "Course not set";

            return (
              <div
                key={batch?._id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* ================= IMAGE ================= */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
                  {image ? (
                    <img
                      src={image}
                      alt={batch?.name || "Batch"}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";

                        const fallback =
                          e.currentTarget.parentElement?.querySelector(
                            ".batch-image-fallback"
                          );

                        if (fallback) {
                          fallback.classList.remove("hidden");
                        }
                      }}
                    />
                  ) : null}

                  {/* Image fallback */}
                  <div
                    className={`batch-image-fallback absolute inset-0 flex h-full w-full items-center justify-center ${
                      image ? "hidden" : ""
                    }`}
                  >
                    <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
                      <GraduationCap
                        size={58}
                        className="text-white/90"
                      />
                    </div>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                  {/* Batch Code */}
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-black text-slate-700 shadow-sm backdrop-blur">
                      <Hash size={12} />
                      {batch?.code || "BATCH"}
                    </span>
                  </div>

                  {/* Student Count */}
                  <div className="absolute bottom-4 right-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm">
                      <Users size={13} />
                      {studentCount} Students
                    </span>
                  </div>

                  {/* Batch Name */}
                  <div className="absolute bottom-4 left-4 right-32">
                    <h2 className="truncate text-xl font-black text-white drop-shadow">
                      {batch?.name || "Unnamed Batch"}
                    </h2>
                  </div>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-5">
                  {/* Course */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                      <BookOpen size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Course
                      </p>

                      <p className="mt-1 truncate text-sm font-bold text-slate-800">
                        {courseName}
                      </p>
                    </div>
                  </div>

                  {/* ================= DETAILS ================= */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {/* Days */}
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <CalendarDays size={15} />

                        <span className="text-[10px] font-black uppercase tracking-wider">
                          Days
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-700">
                        {batch?.days?.length
                          ? batch.days.join(", ")
                          : "Schedule not set"}
                      </p>
                    </div>

                    {/* Room */}
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <DoorOpen size={15} />

                        <span className="text-[10px] font-black uppercase tracking-wider">
                          Room
                        </span>
                      </div>

                      <p className="mt-2 truncate text-xs font-bold text-slate-700">
                        {batch?.room || "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* ================= CLASS TIME ================= */}
                  {(batch?.startTime ||
                    batch?.endTime ||
                    batch?.time) && (
                    <div className="mt-3 flex items-center gap-3 rounded-2xl bg-blue-50 p-3">
                      <div className="rounded-xl bg-white p-2 text-blue-600">
                        <Clock3 size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                          Class Time
                        </p>

                        <p className="mt-1 truncate text-xs font-bold text-blue-800">
                          {batch?.time ||
                            [batch?.startTime, batch?.endTime]
                              .filter(Boolean)
                              .join(" - ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ================= FOOTER ================= */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Batch Status
                      </p>

                      <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-black text-emerald-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Assigned to you
                      </span>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Users size={17} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherBatches;