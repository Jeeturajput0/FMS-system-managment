import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useData } from "../../../context/DataContext";

import {
  BookOpen,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  ClipboardList,
  HelpCircle,
  CheckCircle2,
  Clock,
  Layers,
  Users,
} from "lucide-react";

import { apiFetch, assetUrl } from "../../../utils/api";

export const CourseDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const { students = [] } = useData();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Modules");

  const [expandedModules, setExpandedModules] = useState([]);

  /* =========================================================
     VIEW DETECTION
  ========================================================= */

  const isAdminView =
    location.pathname.startsWith("/admin/") ||
    location.pathname.startsWith("/dashboard/admin/");

  const isTeacherView =
    location.pathname.startsWith("/teacher/") ||
    location.pathname === "/teacher";

  const isFranchiseView =
    location.pathname.startsWith("/franchise/") ||
    location.pathname === "/franchise";

  /* =========================================================
     BACK PATH
  ========================================================= */

  const backPath = isAdminView
    ? "/admin/courses"
    : isTeacherView
      ? "/teacher/courses"
      : isFranchiseView
        ? "/franchise/courses"
        : "/courses";

  /* =========================================================
     FETCH COURSE
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchCourse = async () => {
      try {
        setLoading(true);

        const response = await apiFetch(`/api/courses/${id}`);

        if (!mounted) return;

        const courseData = response?.data;

        setCourse(courseData || null);

        if (courseData?.modules?.length) {
          setExpandedModules(
            courseData.modules.map(
              (module) => module?._id || module?.id
            )
          );
        } else {
          setExpandedModules([]);
        }
      } catch (error) {
        console.error("Course detail error:", error);

        if (mounted) {
          setCourse(null);
          setExpandedModules([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchCourse();
    } else {
      setCourse(null);
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-sm font-semibold text-slate-600">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     COURSE NOT FOUND
  ========================================================= */

  if (!course) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
            <BookOpen className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="text-lg font-extrabold text-red-800">
            Course Not Found
          </h2>

          <p className="mt-2 text-sm text-red-600">
            The requested course could not be found.
          </p>

          <Link
            to={backPath}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================
     COURSE DATA
  ========================================================= */

  const courseImage =
    course?.images?.[0] ||
    course?.thumbnail ||
    course?.image;

  const courseId =
    course?._id ||
    course?.id;

  const modules = Array.isArray(course?.modules)
    ? course.modules
    : [];

  /* =========================================================
     ENROLLED STUDENTS
  ========================================================= */

  const enrolledList = students.filter((student) => {
    const studentCourseId =
      student?.courseId ||
      student?.course?._id ||
      student?.course?.id;

    const studentCourseTitle =
      typeof student?.course === "string"
        ? student.course
        : student?.course?.title;

    return (
      String(studentCourseId || "") === String(courseId || "") ||
      studentCourseTitle === course?.title
    );
  });

  /* =========================================================
     TOGGLE MODULE
  ========================================================= */

  const toggleModule = (moduleId) => {
    if (!moduleId) return;

    setExpandedModules((previous) => {
      if (previous.includes(moduleId)) {
        return previous.filter(
          (module) => module !== moduleId
        );
      }

      return [...previous, moduleId];
    });
  };

  /* =========================================================
     TABS
  ========================================================= */

  const tabs = [
    {
      label: "Modules",
      icon: Layers,
    },
    {
      label: "Students",
      icon: Users,
    },
  ];

  /* =========================================================
     HELPERS
  ========================================================= */

  const getTopicIcon = (type) => {
    switch (type) {
      case "Video":
        return (
          <Video className="h-4 w-4 text-sky-500" />
        );

      case "PDF":
        return (
          <FileText className="h-4 w-4 text-amber-500" />
        );

      case "Assignment":
        return (
          <ClipboardList className="h-4 w-4 text-purple-500" />
        );

      case "Test":
        return (
          <HelpCircle className="h-4 w-4 text-rose-500" />
        );

      default:
        return (
          <BookOpen className="h-4 w-4 text-slate-400" />
        );
    }
  };

  const getDuration = (duration) => {
    if (!duration) return "Duration not specified";

    if (typeof duration === "object") {
      return `${duration?.value || 1} ${
        duration?.unit || "minutes"
      }`;
    }

    return duration;
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-12">

      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <div>
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 transition-colors hover:text-blue-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Courses
        </Link>
      </div>

      {/* =====================================================
          HEADER BANNER
      ===================================================== */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="p-5 sm:p-6 lg:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* COURSE INFO */}

            <div className="flex min-w-0 items-start gap-4">

              {/* IMAGE */}

              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-amber-100 text-amber-700 shadow-sm sm:h-20 sm:w-20">

                {courseImage ? (
                  <img
                    src={assetUrl(courseImage)}
                    alt={`${course?.title || "Course"} course`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <BookOpen className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* TEXT */}

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                  <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                    {course?.title || "Untitled Course"}
                  </h1>

                  {course?.level && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                      {course.level}
                    </span>
                  )}

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      course?.isPublished
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {course?.isPublished
                      ? "Published"
                      : "Draft"}
                  </span>
                </div>

                {course?.description && (
                  <p className="mt-2 max-w-3xl text-xs font-medium leading-5 text-slate-600 sm:text-sm">
                    {course.description}
                  </p>
                )}

              </div>
            </div>

            {/* COURSE META */}

            <div className="flex shrink-0 flex-wrap items-center gap-5 border-t border-slate-100 pt-4 sm:gap-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">

              {/* FEE */}

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Fee Price
                </p>

                <p className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                  {course?.feePrice ||
                    `Rs. ${Number(
                      course?.courseFee || 0
                    ).toLocaleString("en-IN")}`}
                </p>
              </div>

              {/* DURATION */}

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Duration
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {getDuration(course?.duration)}
                </p>
              </div>

              {/* MODULE COUNT */}

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Modules
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {modules.length}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="overflow-x-auto border-b border-slate-200 pb-1">

        <div className="flex min-w-max items-center gap-2">

          {tabs.map((tab) => {
            const Icon = tab.icon;

            const active =
              activeTab === tab.label;

            return (
              <button
                key={tab.label}
                type="button"
                onClick={() =>
                  setActiveTab(tab.label)
                }
                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}

        </div>
      </div>

      {/* =====================================================
          MODULE TAB
      ===================================================== */}

      {activeTab === "Modules" && (
        <div className="space-y-4">

          {/* HEADER */}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Course Modules
              </h2>

              <p className="mt-1 text-xs font-medium text-slate-500">
                {modules.length}{" "}
                {modules.length === 1
                  ? "module"
                  : "modules"}{" "}
                available in this course.
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
              {modules.reduce(
                (total, module) =>
                  total +
                  (module?.topics?.length || 0),
                0
              )}{" "}
              Topics
            </div>
          </div>

          {/* MODULE LIST */}

          {modules.length > 0 ? (
            <div className="space-y-4">

              {modules.map((module, index) => {
                const moduleId =
                  module?._id ||
                  module?.id ||
                  `module-${index}`;

                const isExpanded =
                  expandedModules.includes(
                    moduleId
                  );

                const topics = Array.isArray(
                  module?.topics
                )
                  ? module.topics
                  : [];

                return (
                  <div
                    key={moduleId}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >

                    {/* MODULE HEADER */}

                    {isAdminView ? (
                      <div className="flex items-center justify-between gap-3 bg-slate-50/80 p-4">

                        <Link
                          to={`/admin/modules/${moduleId}/topics`}
                          className="flex min-w-0 flex-1 items-center gap-3"
                        >

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                            <Layers className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900 hover:text-orange-600">
                              {module?.title ||
                                `Module ${index + 1}`}
                            </h3>

                            <p className="truncate text-[10px] font-medium text-slate-500">
                              {module?.description ||
                                "No description"}
                            </p>
                          </div>

                        </Link>

                        <div className="flex shrink-0 items-center gap-2">

                          <span className="hidden text-xs font-semibold text-slate-500 sm:block">
                            {topics.length} Topics
                          </span>

                          <Link
                            to={`/admin/modules/${moduleId}/topics`}
                            className="rounded-lg bg-orange-50 px-2.5 py-1.5 text-[10px] font-bold text-orange-600 hover:bg-orange-100"
                          >
                            Manage
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              toggleModule(
                                moduleId
                              )
                            }
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-slate-200"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-500" />
                            )}
                          </button>

                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          toggleModule(moduleId)
                        }
                        className="flex w-full cursor-pointer items-center justify-between gap-3 bg-slate-50/80 p-4 text-left transition hover:bg-slate-100"
                      >

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                            <Layers className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900">
                              {module?.title ||
                                `Module ${index + 1}`}
                            </h3>

                            <p className="truncate text-[10px] font-medium text-slate-500">
                              {module?.description ||
                                "No description"}
                            </p>
                          </div>

                        </div>

                        <div className="flex shrink-0 items-center gap-3">

                          <span className="hidden text-xs font-semibold text-slate-500 sm:block">
                            {topics.length} Topics
                          </span>

                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          )}

                        </div>

                      </button>
                    )}

                    {/* TOPICS */}

                    {isExpanded && (
                      <div className="divide-y divide-slate-100 p-3 sm:p-4">

                        {topics.length > 0 ? (
                          topics.map(
                            (topic, topicIndex) => (
                              <div
                                key={
                                  topic?._id ||
                                  topic?.id ||
                                  `topic-${topicIndex}`
                                }
                                className="flex flex-col gap-3 rounded-xl px-3 py-3 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                              >

                                {/* TOPIC INFO */}

                                <div className="flex min-w-0 items-start gap-3">

                                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                    {getTopicIcon(
                                      topic?.type
                                    )}
                                  </div>

                                  <div className="min-w-0">

                                    <p className="break-words text-xs font-bold text-slate-900">
                                      {topic?.title ||
                                        `Topic ${
                                          topicIndex +
                                          1
                                        }`}
                                    </p>

                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-medium text-slate-500">

                                      {topic?.type && (
                                        <>
                                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">
                                            {topic.type}
                                          </span>

                                          <span>
                                            •
                                          </span>
                                        </>
                                      )}

                                      <span className="inline-flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {getDuration(
                                          topic?.duration
                                        )}
                                      </span>

                                    </div>
                                  </div>
                                </div>

                                {/* STATUS */}

                                <div className="shrink-0">

                                  {topic?.isCompleted ? (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Verified
                                    </span>
                                  ) : (
                                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                                      Pending
                                    </span>
                                  )}

                                </div>

                              </div>
                            )
                          )
                        ) : (
                          <div className="rounded-xl bg-slate-50 px-4 py-6 text-center">
                            <p className="text-xs font-semibold text-slate-500">
                              No topics available in
                              this module.
                            </p>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <BookOpen className="h-7 w-7 text-slate-400" />
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-slate-900">
                No Modules Available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs font-medium leading-5 text-slate-500">
                Modules for this course are
                currently being mapped to AI
                Scholar LMS.
              </p>

            </div>
          )}

        </div>
      )}

      {/* =====================================================
          STUDENTS TAB
      ===================================================== */}

      {activeTab === "Students" && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* HEADER */}

          <div className="border-b border-slate-100 p-5 sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Enrolled Candidates
                </h2>

                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  {enrolledList.length}{" "}
                  {enrolledList.length === 1
                    ? "student"
                    : "students"}{" "}
                  enrolled
                </p>
              </div>

            </div>

          </div>

          {/* TABLE */}

          {enrolledList.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px] text-left text-xs">

                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">
                      Student Name
                    </th>

                    <th className="px-4 py-3">
                      Franchise
                    </th>

                    <th className="px-4 py-3">
                      Batch
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {enrolledList.map(
                    (student, index) => (
                      <tr
                        key={
                          student?._id ||
                          student?.id ||
                          index
                        }
                        className="transition hover:bg-slate-50"
                      >

                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900">
                            {student?.name ||
                              student?.fullName ||
                              "Unnamed Student"}
                          </div>

                          {student?.email && (
                            <div className="mt-0.5 text-[10px] text-slate-500">
                              {student.email}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-4 font-medium text-slate-600">
                          {student?.franchise ||
                            student?.franchiseName ||
                            "-"}
                        </td>

                        <td className="px-4 py-4 font-mono font-semibold text-slate-700">
                          {student?.batch ||
                            student?.batchName ||
                            "-"}
                        </td>

                        <td className="px-4 py-4">

                          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                            {student?.status ||
                              "Active"}
                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>
              </table>

            </div>
          ) : (
            <div className="p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Users className="h-7 w-7 text-slate-400" />
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-slate-900">
                No Students Found
              </h3>

              <p className="mt-2 text-xs font-medium text-slate-500">
                No students are currently enrolled
                in this course.
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default CourseDetail;