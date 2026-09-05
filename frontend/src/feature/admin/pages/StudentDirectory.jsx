import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Eye,
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { apiFetch } from "../../../utils/api";

/* =========================================================
   API ENDPOINTS
========================================================= */

const STUDENT_API = "/api/students";
const COURSE_API = "/api/courses";
const COACHING_API = "/api/coaching";

/* =========================================================
   HELPERS
========================================================= */

const getId = (item) => {
  if (!item) return "";

  return (
    item._id ||
    item.id ||
    item.value ||
    ""
  );
};

const getCourseName = (course) => {
  if (!course) return "Not Assigned";

  if (typeof course === "string") {
    return course;
  }

  return (
    course.title ||
    course.name ||
    "Not Assigned"
  );
};

const getCoachingName = (coaching) => {
  if (!coaching) return "Not Assigned";

  if (typeof coaching === "string") {
    return coaching;
  }

  return (
    coaching.name ||
    coaching.title ||
    "Not Assigned"
  );
};

const getBatchName = (batch) => {
  if (!batch) return "Not Assigned";

  if (typeof batch === "string") {
    return batch;
  }

  return (
    batch.name ||
    batch.title ||
    batch.batchName ||
    "Not Assigned"
  );
};

const formatCurrency = (amount = 0) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const formatStatus = (status) => {
  if (!status) return "Registered";

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
};

const isObjectId = (value) => /^[a-f\d]{24}$/i.test(value || "");

/* =========================================================
   COMPONENT
========================================================= */

export const StudentDirectory = () => {
  /* =======================================================
     STATES
  ======================================================= */

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [franchises, setFranchises] = useState([]);

  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [franchisesLoading, setFranchisesLoading] = useState(false);

  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [franchiseFilter, setFranchiseFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showAddModal, setShowAddModal] =
    useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  /* =======================================================
     FORM DATA
  ======================================================= */

  const initialFormData = {
    name: "",
    email: "",
    mobile: "",
    courseId: "",
    coachingId: "",
    batchId: "",
  };

  const [formData, setFormData] =
    useState(initialFormData);

  /* =======================================================
     FETCH COURSES
  ======================================================= */

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);

      const response = await apiFetch(
        COURSE_API,
        {
          method: "GET",
        }
      );

      console.log(
        "COURSE API RESPONSE:",
        response
      );

      /*
        Backend can return:

        {
          success: true,
          courses: [...]
        }

        OR

        {
          success: true,
          data: [...]
        }

        OR

        [...]
      */

      let courseList = [];

      if (Array.isArray(response)) {
        courseList = response;
      } else if (
        Array.isArray(response?.courses)
      ) {
        courseList = response.courses;
      } else if (
        Array.isArray(response?.data)
      ) {
        courseList = response.data;
      } else if (
        Array.isArray(response?.data?.courses)
      ) {
        courseList =
          response.data.courses;
      }

      console.log(
        "COURSES FOUND:",
        courseList
      );

      setCourses(courseList);
    } catch (err) {
      console.error(
        "Course fetch error:",
        err
      );

      setCourses([]);

      setError(
        err?.message ||
          "Failed to load courses"
      );
    } finally {
      setCoursesLoading(false);
    }
  };

  /* =======================================================
     FETCH FRANCHISES / COACHINGS
  ======================================================= */

  const fetchFranchises = async () => {
    try {
      setFranchisesLoading(true);

      const response = await apiFetch(
        COACHING_API,
        {
          method: "GET",
        }
      );

      console.log(
        "COACHING API RESPONSE:",
        response
      );

      let franchiseList = [];

      if (Array.isArray(response)) {
        franchiseList = response;
      } else if (
        Array.isArray(response?.coaching)
      ) {
        franchiseList =
          response.coaching;
      } else if (
        Array.isArray(response?.coachings)
      ) {
        franchiseList =
          response.coachings;
      } else if (
        Array.isArray(response?.franchises)
      ) {
        franchiseList =
          response.franchises;
      } else if (
        Array.isArray(response?.data)
      ) {
        franchiseList = response.data;
      } else if (
        Array.isArray(response?.data?.coaching)
      ) {
        franchiseList =
          response.data.coaching;
      } else if (
        Array.isArray(response?.data?.franchises)
      ) {
        franchiseList =
          response.data.franchises;
      }

      console.log(
        "FRANCHISES FOUND:",
        franchiseList
      );

      setFranchises(franchiseList);
    } catch (err) {
      console.error(
        "Franchise fetch error:",
        err
      );

      setFranchises([]);

      setError(
        err?.message ||
          "Failed to load franchises"
      );
    } finally {
      setFranchisesLoading(false);
    }
  };

  /* =======================================================
     FETCH STUDENTS
  ======================================================= */

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(`${STUDENT_API}?limit=1000`, {
        method: "GET",
      });

      console.log(
        "STUDENT API RESPONSE:",
        response
      );

      let studentList = [];

      if (Array.isArray(response)) {
        studentList = response;
      } else if (
        Array.isArray(response?.students)
      ) {
        studentList =
          response.students;
      } else if (
        Array.isArray(response?.data)
      ) {
        studentList = response.data;
      } else if (
        Array.isArray(response?.data?.students)
      ) {
        studentList =
          response.data.students;
      }

      setStudents(studentList);
    } catch (err) {
      console.error(
        "Student fetch error:",
        err
      );

      setStudents([]);

      setError(
        err?.message ||
          "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL DATA
  ======================================================= */

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    setFranchises([]);
  }, []);

  /* =======================================================
     NORMALIZE STUDENTS
  ======================================================= */

  const normalizedStudents = useMemo(() => {
    return students.map((student) => {
      const totalFee =
        Number(
          student.registrationFee || 0
        ) +
        Number(
          student.courseFee || 0
        ) +
        Number(
          student.certificateFee || 0
        );

      const totalPaid =
        Number(student.totalPaid || 0);

      const pending =
        Number(
          student.totalPending ??
            totalFee - totalPaid
        );

      return {
        ...student,

        id:
          student.studentId ||
          student._id ||
          student.id,

        course:
          getCourseName(
            student.courseId
          ),

        franchise:
          getCoachingName(
            student.coachingId
          ),

        batch:
          getBatchName(
            student.batchId
          ),

        phone:
          student.mobile ||
          student.phone ||
          "",

        feesTotal:
          formatCurrency(totalFee),

        feesPaid:
          formatCurrency(totalPaid),

        feesStatus:
          pending <= 0
            ? "Paid"
            : "Pending",

        attendance:
          `${Number(
            student.attendancePercentage ||
              0
          )}%`,

        status:
          formatStatus(
            student.status
          ),

        avatar:
          student.photo ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            student.name ||
              "Student"
          )}&background=f97316&color=fff`,
      };
    });
  }, [students]);

  /* =======================================================
     FILTER STUDENTS
  ======================================================= */

  const filteredStudents =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase();

      return normalizedStudents.filter(
        (student) => {
          const matchesSearch =
            !searchValue ||
            student.name
              ?.toLowerCase()
              .includes(searchValue) ||
            student.email
              ?.toLowerCase()
              .includes(searchValue) ||
            student.id
              ?.toLowerCase()
              .includes(searchValue) ||
            student.phone
              ?.toLowerCase()
              .includes(searchValue);

          const matchesCourse =
            courseFilter === "All" ||
            student.course ===
              courseFilter;

          const matchesFranchise =
            franchiseFilter === "All" ||
            student.franchise ===
              franchiseFilter;

          const matchesStatus =
            statusFilter === "All" ||
            student.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesCourse &&
            matchesFranchise &&
            matchesStatus
          );
        }
      );
    }, [
      normalizedStudents,
      search,
      courseFilter,
      franchiseFilter,
      statusFilter,
    ]);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleInputChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================================================
     ADD STUDENT
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError(
        "Student name is required"
      );
      return;
    }

    if (!formData.email.trim()) {
      setError(
        "Student email is required"
      );
      return;
    }

    if (!formData.mobile.trim()) {
      setError(
        "Phone number is required"
      );
      return;
    }

    if (!formData.courseId) {
      setError(
        "Please select a course"
      );
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");

      const payload = {
        name: formData.name.trim(),

        email:
          formData.email.trim(),

        mobile:
          formData.mobile.trim(),

        courseId:
          formData.courseId,

        ...(formData.coachingId
          ? { coachingId: formData.coachingId }
          : {}),

        ...(isObjectId(formData.batchId)
          ? {
              batchId:
                formData.batchId,
            }
          : {}),
      };

      console.log(
        "CREATE STUDENT PAYLOAD:",
        payload
      );

      const response =
        await apiFetch(
          editingStudent ? `${STUDENT_API}/${editingStudent._id}` : STUDENT_API,
          {
            method: editingStudent ? "PUT" : "POST",
            body: JSON.stringify(
              payload
            ),
          }
        );

      console.log(
        "CREATE STUDENT RESPONSE:",
        response
      );

      /*
        After successful enrollment,
        fetch again so the table gets
        the latest populated course,
        coaching and batch data.
      */

      await fetchStudents();

      setFormData(
        initialFormData
      );

      setShowAddModal(false);
      setEditingStudent(null);
    } catch (err) {
      console.error(
        "Create student error:",
        err
      );

      setError(
        err?.message ||
          "Student enrollment failed"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setCourseFilter("All");
    setFranchiseFilter("All");
    setStatusFilter("All");
  };

  /* =======================================================
     OPEN MODAL
  ======================================================= */

  const openAddModal = () => {
    setError("");
    setEditingStudent(null);

    setFormData({
      ...initialFormData,

      /*
        Automatically select first
        available course if needed.
      */
      courseId:
        courses.length > 0
          ? getId(courses[0])
          : "",

      coachingId:
        franchises.length > 0
          ? getId(franchises[0])
          : "",
    });

    setShowAddModal(true);
  };

  const openEditModal = (student) => {
    setError("");
    setEditingStudent(student);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      mobile: student.mobile || student.phone || "",
      courseId: getId(student.courseId),
      coachingId: getId(student.coachingId),
      batchId: getId(student.batchId),
    });
    setShowAddModal(true);
  };

  const deleteStudent = async (student) => {
    if (!window.confirm(`Deactivate ${student.name}?`)) return;
    try {
      setError("");
      await apiFetch(`${STUDENT_API}/${student._id}`, { method: "DELETE" });
      await fetchStudents();
    } catch (requestError) {
      setError(requestError.message || "Unable to deactivate student");
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6 pb-12">
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Directory
          </h2>

          <p className="text-xs text-slate-600 mt-1">
            Comprehensive LMS candidate
            profiles, fee balances, and
            academic progress
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />

          <span>
            Add New Student
          </span>
        </button>
      </div>

      {/* =================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

          <div className="flex-1">
            <p className="font-bold text-sm">
              Something went wrong
            </p>

            <p className="text-xs mt-1">
              {error}
            </p>
          </div>

          <button
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =================================================
          FILTER BAR
      ================================================== */}

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* SEARCH */}

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

            <input
              type="text"
              placeholder="Search by student name, ID..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white"
            />
          </div>

          {/* COURSE FILTER */}

          <select
            value={courseFilter}
            onChange={(e) =>
              setCourseFilter(
                e.target.value
              )
            }
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="All">
              All Courses
            </option>

            {courses.map((course) => (
              <option
                key={getId(course)}
                value={getCourseName(
                  course
                )}
              >
                {getCourseName(course)}
              </option>
            ))}
          </select>

          {/* FRANCHISE FILTER */}

          <select
            value={franchiseFilter}
            onChange={(e) =>
              setFranchiseFilter(
                e.target.value
              )
            }
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="All">
              All Franchises
            </option>

            {franchises.map(
              (franchise) => (
                <option
                  key={getId(
                    franchise
                  )}
                  value={getCoachingName(
                    franchise
                  )}
                >
                  {getCoachingName(
                    franchise
                  )}
                </option>
              )
            )}
          </select>

          {/* STATUS FILTER */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="All">
              All Statuses
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Registered">
              Registered
            </option>

            <option value="Inactive">
              Inactive
            </option>

            <option value="Dropped">
              Dropped
            </option>
          </select>
        </div>

        {/* FILTER FOOTER */}

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-700">
              {filteredStudents.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-700">
              {students.length}
            </span>{" "}
            students
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-slate-500 hover:text-orange-600"
            >
              Reset Filters
            </button>

            <button
              onClick={() => {
                fetchStudents();
                fetchCourses();
                setFranchises([]);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-orange-600"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================== */}

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-4 px-4">
                  Student ID
                </th>

                <th className="py-4 px-4">
                  Student Name
                </th>

                <th className="py-4 px-4">
                  Course
                </th>

                <th className="py-4 px-4">
                  Franchise
                </th>

                <th className="py-4 px-4">
                  Batch
                </th>

                <th className="py-4 px-4">
                  Fees Status
                </th>

                <th className="py-4 px-4">
                  Attendance
                </th>

                <th className="py-4 px-4">
                  Status
                </th>

                <th className="py-4 px-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {/* LOADING */}

              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-7 h-7 text-orange-500 animate-spin" />

                      <p className="text-xs font-semibold text-slate-500">
                        Loading students...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length ===
                0 ? (
                /* EMPTY */

                <tr>
                  <td
                    colSpan="9"
                    className="py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <Users className="w-10 h-10 text-slate-300 mb-3" />

                      <p className="font-bold text-slate-600 text-sm">
                        No students found
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        No students match
                        your current
                        filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* STUDENTS */

                filteredStudents.map(
                  (student) => (
                    <tr
                      key={
                        student._id ||
                        student.id
                      }
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* STUDENT ID */}

                      <td className="py-4 px-4 font-mono font-bold text-orange-600">
                        {student.id}
                      </td>

                      {/* NAME */}

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              student.avatar
                            }
                            alt={
                              student.name
                            }
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />

                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {
                                student.name
                              }
                            </p>

                            <p className="text-[10px] text-slate-600">
                              {
                                student.email
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* COURSE */}

                      <td className="py-4 px-4 text-slate-700 max-w-xs">
                        <div
                          className="truncate max-w-55"
                          title={
                            student.course
                          }
                        >
                          {
                            student.course
                          }
                        </div>
                      </td>

                      {/* FRANCHISE */}

                      <td className="py-4 px-4 text-slate-700">
                        {
                          student.franchise
                        }
                      </td>

                      {/* BATCH */}

                      <td className="py-4 px-4 font-mono">
                        {
                          student.batch
                        }
                      </td>

                      {/* FEES */}

                      <td className="py-4 px-4">
                        <div>
                          <p className="font-bold text-slate-900">
                            {
                              student.feesPaid
                            }{" "}
                            /{" "}
                            {
                              student.feesTotal
                            }
                          </p>

                          <span
                            className={`text-[10px] font-bold ${
                              student.feesStatus ===
                              "Paid"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {
                              student.feesStatus
                            }
                          </span>
                        </div>
                      </td>

                      {/* ATTENDANCE */}

                      <td className="py-4 px-4 font-bold text-slate-900">
                        {
                          student.attendance
                        }
                      </td>

                      {/* STATUS */}

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            student.status ===
                            "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : student.status ===
                                "Completed"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : student.status ===
                                  "Registered"
                                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                                  : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {
                            student.status
                          }
                        </span>
                      </td>

                      {/* ACTION */}

                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            to={`/admin/students/${student.id}`}
                            className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors font-bold text-xs inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                          <button onClick={() => openEditModal(student)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 inline-flex items-center gap-1" title="Edit">
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => deleteStudent(student)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 inline-flex items-center gap-1" title="Deactivate">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
          ADD STUDENT MODAL
      ================================================== */}

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Enroll New Candidate
                    </h3>

                    <p className="text-xs text-slate-600">
                      Register student into
                      AI Scholar LMS
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(
                      false
                    )
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4 text-xs"
              >
                {/* NAME + EMAIL */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Student Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Full Name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleInputChange
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>

                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="student@gmail.com"
                      value={
                        formData.email
                      }
                      onChange={
                        handleInputChange
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* MOBILE */}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>

                  <input
                    type="text"
                    name="mobile"
                    required
                    placeholder="9876500000"
                    value={
                      formData.mobile
                    }
                    onChange={
                      handleInputChange
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* COURSE + FRANCHISE */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* COURSE */}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Assign Course *
                    </label>

                    <select
                      name="courseId"
                      required
                      value={
                        formData.courseId
                      }
                      onChange={
                        handleInputChange
                      }
                      disabled={
                        coursesLoading
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:opacity-60"
                    >
                      <option value="">
                        {coursesLoading
                          ? "Loading courses..."
                          : courses.length ===
                              0
                            ? "No courses available"
                            : "Select a course"}
                      </option>

                      {courses.map(
                        (course) => {
                          const courseId =
                            getId(
                              course
                            );

                          return (
                            <option
                              key={
                                courseId
                              }
                              value={
                                courseId
                              }
                            >
                              {getCourseName(
                                course
                              )}
                            </option>
                          );
                        }
                      )}
                    </select>

                    {courses.length ===
                      0 &&
                      !coursesLoading && (
                        <p className="text-[10px] text-red-500 mt-1">
                          No courses
                          found from
                          API.
                        </p>
                      )}
                  </div>

                  {/* FRANCHISE */}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Assign Franchise
                    </label>

                    <select
                      name="coachingId"
                      value={
                        formData.coachingId
                      }
                      onChange={
                        handleInputChange
                      }
                      disabled={
                        franchisesLoading
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:opacity-60"
                    >
                      <option value="">
                        {franchisesLoading
                          ? "Loading franchises..."
                          : franchises.length ===
                              0
                            ? "No franchises available"
                            : "Select a franchise"}
                      </option>

                      {franchises.map(
                        (franchise) => {
                          const franchiseId =
                            getId(
                              franchise
                            );

                          return (
                            <option
                              key={
                                franchiseId
                              }
                              value={
                                franchiseId
                              }
                            >
                              {getCoachingName(
                                franchise
                              )}
                            </option>
                          );
                        }
                      )}
                    </select>

                    {franchises.length ===
                      0 &&
                      !franchisesLoading && (
                        <p className="text-[10px] text-red-500 mt-1">
                          No franchises
                          found from
                          API.
                        </p>
                      )}
                  </div>
                </div>

                {/* BATCH */}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Batch ID
                  </label>

                  <input
                    type="text"
                    name="batchId"
                    placeholder="Enter Batch ID (optional)"
                    value={
                      formData.batchId
                    }
                    onChange={
                      handleInputChange
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />

                  <p className="text-[10px] text-slate-400 mt-1">
                    Leave empty if batch is
                    not assigned yet.
                  </p>
                </div>

                {/* FORM FOOTER */}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={
                      submitLoading
                    }
                    onClick={() =>
                      setShowAddModal(
                        false
                      )
                    }
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      submitLoading
                    }
                    className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitLoading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}

                    {submitLoading
                      ? "Enrolling..."
                      : "Complete Enrollment"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDirectory;