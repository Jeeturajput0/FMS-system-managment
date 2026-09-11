import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  Loader2,
  Users,
  Layers3,
  BarChart3,
  Eye,
} from "lucide-react";

import { apiFetch } from "../../../utils/api";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH COURSES
  // =========================

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch("/api/portal/courses");

        setCourses(response?.data || []);
      } catch (e) {
        console.error("Failed to load courses:", e);

        setError(
          e?.message || "Failed to load courses"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // =========================
  // GET COURSE DATA
  // =========================

  const getCourseTitle = (course) =>
    course?.title ||
    course?.name ||
    "Untitled Course";

  const getCategory = (course) =>
    course?.category || "General";

  const getLevel = (course) =>
    course?.level || "Beginner";

  const getModules = (course) =>
    course?.modules?.length || 0;

  const getTopics = (course) =>
    course?.topics?.length || 0;

  // =========================
  // LEVEL STYLE
  // =========================

  const getLevelStyle = (level) => {
    switch (level) {
      case "Advanced":
        return "bg-red-50 text-red-700 border-red-100";

      case "Intermediate":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "Competitive":
        return "bg-purple-50 text-purple-700 border-purple-100";

      case "Professional":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "Foundation":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";

      case "Beginner":
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-full space-y-5 bg-slate-50/40 p-1">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-700">

              <BookOpen size={13} />

              Teaching Library

            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              My Courses
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              View the courses assigned to your teaching account.
            </p>

          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
            <BookOpen size={23} />
          </div>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
          SUMMARY
      ================================================= */}

      {!loading &&
        !error &&
        courses.length > 0 && (

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* Total Courses */}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Assigned Courses
                  </p>

                  <p className="mt-1.5 text-2xl font-black text-slate-900">
                    {courses.length}
                  </p>

                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <BookOpen size={20} />
                </div>

              </div>

            </div>

            {/* Total Modules */}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Teaching Resources
                  </p>

                  <p className="mt-1.5 text-2xl font-black text-slate-900">
                    {courses.reduce(
                      (total, course) =>
                        total +
                        (course?.modules?.length || 0),
                      0
                    )}
                  </p>

                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <Layers3 size={20} />
                </div>

              </div>

            </div>

          </div>
        )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <Loader2
            size={28}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading your courses...
          </p>

        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        courses.length === 0 && (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <BookOpen size={27} />
            </div>

            <h2 className="mt-4 text-lg font-black text-slate-800">
              No courses assigned
            </h2>

            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
              You don't have any courses assigned to your teaching account yet.
            </p>

          </div>
        )}

      {/* =================================================
          COURSE TABLE
      ================================================= */}

      {!loading &&
        !error &&
        courses.length > 0 && (

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* TABLE TOP */}

            <div className="flex flex-col gap-2 border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

              <div className="flex items-center gap-3">

                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
                  <BookOpen size={17} />
                </div>

                <div>

                  <h2 className="text-sm font-black text-slate-900">
                    Assigned Courses
                  </h2>

                  <p className="text-[10px] text-slate-500">
                    Courses available for your teaching account
                  </p>

                </div>

              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-500 shadow-sm">

                {courses.length}{" "}
                {courses.length === 1
                  ? "Course"
                  : "Courses"}

              </div>

            </div>

            {/* RESPONSIVE TABLE */}

            <div className="w-full overflow-x-auto">

              <table className="w-full min-w-[1000px] border-collapse">

                {/* =========================
                    TABLE HEADER
                ========================= */}

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="w-[7%] px-4 py-3.5 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                      S.No.
                    </th>

                    <th className="w-[28%] px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Course
                    </th>

                    <th className="w-[15%] px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="w-[15%] px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Level
                    </th>

                    <th className="w-[11%] px-4 py-3.5 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Modules
                    </th>

                    <th className="w-[11%] px-4 py-3.5 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Topics
                    </th>

                    <th className="w-[13%] px-4 py-3.5 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* =========================
                    TABLE BODY
                ========================= */}

                <tbody className="divide-y divide-slate-100">

                  {courses.map((course, index) => {

                    const courseTitle =
                      getCourseTitle(course);

                    const category =
                      getCategory(course);

                    const level =
                      getLevel(course);

                    const modules =
                      getModules(course);

                    const topics =
                      getTopics(course);

                    const isOpen =
                      open === course?._id;

                    return (
                      <>

                        {/* MAIN ROW */}

                        <tr
                          key={course?._id}
                          className="group transition-colors hover:bg-blue-50/40"
                        >

                          {/* S.NO */}

                          <td className="px-4 py-4 text-center align-middle">

                            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-slate-100 px-2 text-[11px] font-black text-slate-600 transition group-hover:bg-blue-100 group-hover:text-blue-700">
                              {index + 1}
                            </span>

                          </td>

                          {/* COURSE */}

                          <td className="px-4 py-4 align-middle">

                            <div className="flex items-center gap-3">

                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">

                                <BookOpen size={17} />

                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[280px] truncate text-sm font-black text-slate-900">
                                  {courseTitle}
                                </p>

                                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                  Teaching Access
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* CATEGORY */}

                          <td className="px-4 py-4 align-middle">

                            <span className="inline-flex max-w-[150px] truncate rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-700">
                              {category}
                            </span>

                          </td>

                          {/* LEVEL */}

                          <td className="px-4 py-4 align-middle">

                            <span
                              className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-black ${getLevelStyle(
                                level
                              )}`}
                            >
                              {level}
                            </span>

                          </td>

                          {/* MODULES */}

                          <td className="px-4 py-4 text-center align-middle">

                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-black text-blue-700">

                              <Layers3 size={13} />

                              {modules}

                            </div>

                          </td>

                          {/* TOPICS */}

                          <td className="px-4 py-4 text-center align-middle">

                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-black text-purple-700">

                              <BarChart3 size={13} />

                              {topics}

                            </div>

                          </td>

                          {/* ACTION */}

                          <td className="px-4 py-4 text-center align-middle">

                            <button
                              type="button"
                              onClick={() =>
                                setOpen(
                                  isOpen
                                    ? null
                                    : course?._id
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] font-black text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-100 active:scale-95"
                            >

                              <Eye size={14} />

                              {isOpen
                                ? "Close"
                                : "View"}

                            </button>

                          </td>

                        </tr>

                        {/* =========================
                            EXPANDED ROW
                        ========================= */}

                        {isOpen && (

                          <tr
                            key={`${course?._id}-details`}
                            className="bg-slate-50/70"
                          >

                            <td
                              colSpan={7}
                              className="px-4 py-4 sm:px-6"
                            >

                              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                                  <div className="min-w-0">

                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                      Course Description
                                    </p>

                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                                      {course?.description ||
                                        course?.shortDescription ||
                                        "Course content is available for your assigned batches."}
                                    </p>

                                  </div>

                                  <Link
                                    to={`/teacher/courses/${course?._id}`}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-blue-700"
                                  >
                                    Open Full Course
                                    <ChevronRight
                                      size={15}
                                    />
                                  </Link>

                                </div>

                                {/* DETAILS */}

                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                  <div className="rounded-xl bg-slate-50 p-3">

                                    <div className="flex items-center gap-2 text-slate-400">

                                      <BookOpen size={14} />

                                      <span className="text-[9px] font-black uppercase tracking-wider">
                                        Course
                                      </span>

                                    </div>

                                    <p className="mt-2 text-xs font-black text-slate-800">
                                      {courseTitle}
                                    </p>

                                  </div>

                                  <div className="rounded-xl bg-slate-50 p-3">

                                    <div className="flex items-center gap-2 text-slate-400">

                                      <Layers3 size={14} />

                                      <span className="text-[9px] font-black uppercase tracking-wider">
                                        Modules
                                      </span>

                                    </div>

                                    <p className="mt-2 text-xs font-black text-slate-800">
                                      {modules}
                                    </p>

                                  </div>

                                  <div className="rounded-xl bg-slate-50 p-3">

                                    <div className="flex items-center gap-2 text-slate-400">

                                      <BarChart3 size={14} />

                                      <span className="text-[9px] font-black uppercase tracking-wider">
                                        Topics
                                      </span>

                                    </div>

                                    <p className="mt-2 text-xs font-black text-slate-800">
                                      {topics}
                                    </p>

                                  </div>

                                </div>

                              </div>

                            </td>

                          </tr>

                        )}

                      </>
                    );
                  })}

                </tbody>

              </table>

            </div>

            {/* FOOTER */}

            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">

              <p className="text-[10px] font-medium text-slate-400">
                Showing{" "}
                <span className="font-bold text-slate-700">
                  {courses.length}
                </span>{" "}
                assigned courses
              </p>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">

                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                Teaching Access Active

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default TeacherCourses;