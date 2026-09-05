import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Eye, Loader2, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch, assetUrl } from "../../../utils/api";

const getDuration = (duration) => {
  if (!duration) return "-";

  if (typeof duration === "string") return duration;

  return `${duration.value || 1} ${duration.unit || "months"}`;
};

const getFee = (fee) => `₹${Number(fee || 0).toLocaleString("en-IN")}`;

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

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch("/api/portal/courses");

        setCourses(response.data || []);
      } catch (requestError) {
        setError(requestError.message || "Unable to load courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Categories
  const categories = useMemo(
    () => [
      "All",
      ...new Set(courses.map((course) => course.category || "General")),
    ],
    [courses],
  );

  // Levels
  const levels = useMemo(
    () => [
      "All",
      ...new Set(courses.map((course) => course.level || "Beginner")),
    ],
    [courses],
  );

  // Search + Filters
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Courses</h1>

        <p className="mt-2 text-sm text-slate-500">
          Courses added by admin and available for your franchise.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:flex-row">
        {/* Search */}
        <label className="relative flex-1">
          <Search size={17} className="absolute left-3 top-3 text-slate-400" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search course, category, level..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </label>

        {/* Category */}
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
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
          onChange={(event) => setLevel(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
        >
          {levels.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All Levels" : item}
            </option>
          ))}
        </select>
      </div>

      {/* Result Count */}
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

      {/* Course Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            {/* Table Header */}
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Course</th>

                <th className="px-5 py-4">Category</th>

                <th className="px-5 py-4">Duration</th>

                <th className="px-5 py-4">Course Level</th>


                <th className="px-5 py-4">Fee</th>

                <th className="px-5 py-4">Status</th>

                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {/* Loading */}
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center">
                    <Loader2 className="mx-auto animate-spin text-blue-600" />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading courses...
                    </p>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                /* Empty */
                <tr>
                  <td colSpan="8" className="p-12 text-center">
                    <BookOpen size={35} className="mx-auto text-slate-300" />

                    <p className="mt-3 font-semibold text-slate-600">
                      No courses found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                /* Courses */
                filteredCourses.map((course) => {
                  const courseLevel = course.level || "Beginner";

                  return (
                    <tr
                      key={course._id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Course */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-blue-50 text-blue-600">
                            {course.thumbnail || course.images?.[0] ? (
                              <img
                                src={assetUrl(
                                  course.thumbnail || course.images[0],
                                )}
                                alt={course.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <BookOpen size={19} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-900">
                              {course.title}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                             {courseLevel}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {course.category || "General"}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4 text-slate-700">
                        {getDuration(course.duration)}
                      </td>

                      {/* Level */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getLevelStyle(
                            courseLevel,
                          )}`}
                        >
                          {courseLevel}
                        </span>
                      </td>

                      {/* Target Audience */}
                      <td className="px-5 py-4">
                        {course.targetAudience ? (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Users
                              size={14}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="max-w-[180px] truncate text-xs font-medium">
                              {course.targetAudience}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            All Students
                          </span>
                        )}
                      </td>

                      {/* Fee */}
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {getFee(course.courseFee)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            course.isPublished === false
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {course.isPublished === false ? "Draft" : "Published"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/courses/${course._id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                        >
                          <Eye size={14} />
                          View
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
    </div>
  );
};
