import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Eye, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch, assetUrl } from "../../../utils/api";
import { Pagination } from "../../../components/Pagination";

const getDuration = (duration) => {
  if (!duration) return "-";

  if (typeof duration === "string") {
    return duration;
  }

  return `${duration.value || 1} ${duration.unit || "months"}`;
};

const getFee = (fee) => {
  return `₹${Number(fee || 0).toLocaleString("en-IN")}`;
};

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

export const FranchiseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const pageSize = 20;

  // ================================
  // LOAD COURSES
  // ================================
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch("/api/portal/courses");

        setCourses(response?.data || []);
      } catch (requestError) {
        console.error("Load courses error:", requestError);

        setError(requestError?.message || "Unable to load courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // ================================
  // CATEGORIES
  // ================================
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(courses.map((course) => course.category || "General")),
    ];
  }, [courses]);

  // ================================
  // LEVELS
  // ================================
  const levels = useMemo(() => {
    return [
      "All",
      ...new Set(courses.map((course) => course.level || "Beginner")),
    ];
  }, [courses]);

  // ================================
  // SEARCH + FILTER
  // ================================
  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        [
          course.title,
          course.description,
          course.shortDescription,
          course.category,
          course.level,
          course.targetAudience,
        ].some((field) =>
          String(field || "")
            .toLowerCase()
            .includes(query),
        );

      const matchesCategory =
        category === "All" || (course.category || "General") === category;

      const matchesLevel =
        level === "All" || (course.level || "Beginner") === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, search, category, level]);

  // ================================
  // PAGINATION
  // ================================
  const pageCourses = filteredCourses.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // ================================
  // RESET PAGE
  // ================================
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* ================================
          HEADER
      ================================= */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Courses</h1>

        <p className="mt-2 text-sm text-slate-500">
          Courses added by admin and available for your franchise.
        </p>
      </div>

      {/* ================================
          ERROR
      ================================= */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* ================================
          SEARCH & FILTERS
      ================================= */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:flex-row">
        {/* Search */}
        <label className="relative flex-1">
          <Search size={17} className="absolute left-3 top-3 text-slate-400" />

          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search course, category, level..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </label>

        {/* Category */}
        <select
          value={category}
          onChange={handleCategoryChange}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All Categories" : item}
            </option>
          ))}
        </select>

        {/* Level */}
        <select
          value={level}
          onChange={handleLevelChange}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
        >
          {levels.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All Levels" : item}
            </option>
          ))}
        </select>
      </div>

      {/* ================================
          RESULT COUNT
      ================================= */}
      {!loading && !error && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {filteredCourses.length}
            </span>{" "}
            course
            {filteredCourses.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* ================================
          COURSE TABLE
      ================================= */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] table-auto text-left text-sm">
            {/* TABLE HEADER */}
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                <th className="w-[25%] px-4 py-3.5 font-bold">Course</th>

                <th className="w-[13%] px-4 py-3.5 font-bold">Category</th>

                <th className="w-[12%] px-4 py-3.5 font-bold">Duration</th>

                <th className="w-[14%] px-4 py-3.5 font-bold">Level</th>

                <th className="w-[13%] px-4 py-3.5 font-bold">Fee</th>

                <th className="w-[12%] px-4 py-3.5 font-bold">Status</th>

                <th className="w-[11%] px-4 py-3.5 text-right font-bold">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-slate-100">
              {/* LOADING */}
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center">
                    <Loader2
                      size={24}
                      className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading courses...
                    </p>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                /* EMPTY */
                <tr>
                  <td colSpan={7} className="p-10 text-center">
                    <BookOpen size={32} className="mx-auto text-slate-300" />

                    <p className="mt-3 font-semibold text-slate-600">
                      No courses found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                /* COURSES */
                pageCourses.map((course) => {
                  const courseLevel = course.level || "Beginner";

                  // IMPORTANT:
                  // MongoDB course ID
                  const courseId = course._id || course.id;

                  return (
                    <tr key={courseId} className="transition hover:bg-slate-50">
                      {/* COURSE */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-10 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-blue-50 text-blue-600">
                            {course.thumbnail || course.images?.[0] ? (
                              <img
                                src={assetUrl(
                                  course.thumbnail || course.images[0],
                                )}
                                alt={course.title || "Course"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <BookOpen size={17} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate font-bold text-slate-900">
                              {course.title || "Untitled Course"}
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {courseLevel}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex max-w-[120px] truncate rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {course.category || "General"}
                        </span>
                      </td>

                      {/* DURATION */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
                        {getDuration(course.duration)}
                      </td>

                      {/* LEVEL */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold ${getLevelStyle(
                            courseLevel,
                          )}`}
                        >
                          {courseLevel}
                        </span>
                      </td>

                      {/* FEE */}
                      <td className="whitespace-nowrap px-4 py-3.5 font-bold text-slate-900">
                        {getFee(course.courseFee)}
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
                            course.isPublished === false
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {course.isPublished === false ? "Draft" : "Published"}
                        </span>
                      </td>

                      {/* ================================
                          VIEW BUTTON
                      ================================= */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/franchise/courses/${courseId}`}
                          title="View course"
                          aria-label="View course"
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                        >
                      
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}
        pageCount={Math.ceil(filteredCourses.length / pageSize)}
        onPageChange={setPage}
        totalItems={filteredCourses.length}
        pageSize={pageSize}
      />
    </div>
  );
};
