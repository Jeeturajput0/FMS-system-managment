
import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Loader2,
  Users,
  Layers3,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

import { apiFetch, assetUrl } from "../../../utils/api";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // Course Image
  // =========================
  const getCourseImage = (course) => {
    const image =
      course?.image ||
      course?.thumbnail ||
      course?.coverImage ||
      course?.courseImage;

    if (!image) return "";

    // Full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return assetUrl(image);
  };

  // =========================
  // Fetch Courses
  // =========================
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch("/api/portal/courses");

        setCourses(response?.data || []);
      } catch (e) {
        setError(e?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <div className="min-h-full space-y-6 bg-slate-50/40 p-1">

      {/* =========================
          HEADER
      ========================= */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-blue-700">
              <BookOpen size={14} />
              Teaching Library
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              My Courses
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View and manage the courses assigned to your teaching account.
            </p>
          </div>

          {/* Course count */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <BookOpen size={27} />
          </div>
        </div>
      </div>

      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =========================
          SUMMARY
      ========================= */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">

          {/* Total Courses */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Assigned Courses
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {courses.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <BookOpen size={21} />
              </div>

            </div>
          </div>

          {/* Total Students */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Teaching Resources
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {courses.reduce(
                    (total, course) =>
                      total +
                      (course?.modules?.length || 0),
                    0
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Layers3 size={21} />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}
      {loading && (
        <div className="rounded-3xl border border-slate-200 bg-white p-14 text-center shadow-sm">

          <Loader2
            size={30}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading your courses...
          </p>

        </div>
      )}

      {/* =========================
          EMPTY
      ========================= */}
      {!loading && !error && courses.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <BookOpen size={30} />
          </div>

          <h2 className="mt-5 text-lg font-black text-slate-800">
            No courses assigned
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            You don't have any courses assigned to your teaching account yet.
          </p>

        </div>
      )}

      {/* =========================
          COURSE GRID
      ========================= */}
      {!loading && courses.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {courses.map((course) => {
            const image = getCourseImage(course);

            const courseTitle =
              course?.title ||
              course?.name ||
              "Untitled Course";

            const description =
              course?.description ||
              course?.shortDescription ||
              "Course content is available for your assigned batches.";

            const category =
              course?.category || "General";

            const level =
              course?.level || "Beginner";

            const modules =
              course?.modules?.length || 0;

            const topics =
              course?.topics?.length || 0;

            return (
              <article
                key={course?._id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* =========================
                    IMAGE
                ========================= */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">

                  {image ? (
                    <img
                      src={image}
                      alt={courseTitle}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";

                        const fallback =
                          e.currentTarget.parentElement?.querySelector(
                            ".course-image-fallback"
                          );

                        if (fallback) {
                          fallback.classList.remove("hidden");
                        }
                      }}
                    />
                  ) : null}

                  {/* Image Fallback */}
                  <div
                    className={`course-image-fallback absolute inset-0 flex items-center justify-center ${
                      image ? "hidden" : ""
                    }`}
                  >
                    <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
                      <BookOpen
                        size={58}
                        className="text-white/90"
                      />
                    </div>
                  </div>

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                  {/* Category */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-black text-slate-700 shadow-sm backdrop-blur">
                      {category}
                    </span>
                  </div>

                  {/* Level */}
                  <div className="absolute right-4 top-4">
                    <span className="rounded-full bg-blue-600/90 px-3 py-1.5 text-[11px] font-black text-white shadow-sm backdrop-blur">
                      {level}
                    </span>
                  </div>

                  {/* Course Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="line-clamp-2 text-xl font-black leading-tight text-white drop-shadow">
                      {courseTitle}
                    </h2>
                  </div>
                </div>

                {/* =========================
                    CONTENT
                ========================= */}
                <div className="p-5">

                  {/* Short Description */}
                  <p className="line-clamp-3 text-sm leading-6 text-slate-500">
                    {description}
                  </p>

                  {/* Stats */}
                  <div className="mt-5 grid grid-cols-2 gap-3">

                    {/* Modules */}
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Layers3 size={15} />

                        <span className="text-[10px] font-black uppercase tracking-wider">
                          Modules
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-black text-slate-800">
                        {modules || "View course"}
                      </p>
                    </div>

                    {/* Topics */}
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <BarChart3 size={15} />

                        <span className="text-[10px] font-black uppercase tracking-wider">
                          Topics
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-black text-slate-800">
                        {topics || "View course"}
                      </p>
                    </div>

                  </div>


                  {/* =========================
                      EXPANDED CONTENT
                  ========================= */}
                  {open === course?._id && (
                    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Course Description
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {description}
                        </p>
                      </div>

                      
                      {/* Open Course */}
                      <Link
                        to={`/teacher/courses/${course?._id}`}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
                      >
                        Open Full Course
                        <ChevronRight size={16} />
                      </Link>

                    </div>
                  )}

                  {/* =========================
                      FOOTER
                  ========================= */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Teaching Access
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
              </article>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
