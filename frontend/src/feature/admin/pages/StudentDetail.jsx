import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const value = (item) => {
  if (!item) return "Not assigned";

  if (typeof item === "string") {
    return item;
  }

  if (typeof item === "object") {
    return (
      item.title ||
      item.name ||
      item.batchName ||
      item.studentId ||
      "Not assigned"
    );
  }

  return String(item);
};

export const StudentDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const franchiseView = location.pathname.startsWith("/franchise");

  const backPath = franchiseView
    ? "/franchise/students"
    : "/admin/students";

  const editPath = franchiseView
    ? `/franchise/students/${id}/edit`
    : `/admin/students`;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(`/api/students/${id}`);

        console.log("STUDENT DETAIL RESPONSE:", response);

        if (!response) {
          throw new Error("Student not found");
        }

        const studentData =
          response.student ||
          response.data?.student ||
          response.data ||
          response;

        if (!studentData || typeof studentData !== "object") {
          throw new Error("Student not found");
        }

        setStudent(studentData);
      } catch (requestError) {
        console.error("Student detail error:", requestError);

        setError(
          requestError?.message || "Student not found"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    } else {
      setError("Student ID is missing");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />

          <p className="text-sm font-semibold text-slate-500">
            Loading student...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600"
        >
          <ArrowLeft size={16} />
          Back to students
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-bold">
            Unable to load student
          </p>

          <p className="mt-1 text-sm">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-4">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={16} />
          Back to students
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          Student not found.
        </div>
      </div>
    );
  }

  const fields = [
    [
      "Email",
      student.email || "-"
    ],

    [
      "Phone",
      student.mobile ||
        student.phone ||
        "-"
    ],

    [
      "Father Name",
      student.fatherName || "-"
    ],

    [
      "Course",
      value(student.courseId)
    ],

    [
      "Franchise",
      value(student.coachingId)
    ],

    [
      "Batch",
      value(student.batchId)
    ],

    [
      "Status",
      student.status || "Registered"
    ],

    [
      "Address",
      [
        student.address,
        student.city,
        student.state,
        student.pincode,
      ]
        .filter(Boolean)
        .join(", ") || "-"
    ],

    [
      "Joining Date",
      student.joiningDate
        ? new Date(
            student.joiningDate
          ).toLocaleDateString("en-IN")
        : "-"
    ],
  ];

  const status =
    student.status || "Registered";

  const statusClass =
    status.toLowerCase() === "active"
      ? "bg-emerald-100 text-emerald-700"
      : status.toLowerCase() === "completed"
      ? "bg-blue-100 text-blue-700"
      : status.toLowerCase() === "inactive"
      ? "bg-slate-100 text-slate-600"
      : "bg-orange-100 text-orange-700";

  return (
    <div className="space-y-6 pb-12">

      {/* BACK */}
      <Link
        to={backPath}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-orange-600"
      >
        <ArrowLeft size={16} />
        Back to students
      </Link>

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
            {student.studentId ||
              student._id ||
              id}
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            {student.name || "Student"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Complete student profile and enrollment details
          </p>
        </div>

        <div className="flex items-center gap-3">

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
          >
            {status}
          </span>

          <Link
            to={editPath}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
          >
            <Edit size={15} />
            Edit
          </Link>

        </div>
      </div>

      {/* STUDENT INFO */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {fields.map(
          ([label, fieldValue]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {label}
              </p>

              <p className="mt-2 break-words font-semibold text-slate-900">
                {fieldValue}
              </p>
            </div>
          )
        )}

      </div>

      {/* FEES */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="font-bold text-slate-900">
          Fees and Progress
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">

          {/* COURSE FEE */}
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Course Fee
            </p>

            <p className="mt-1 text-lg font-black text-slate-900">
              ₹
              {Number(
                student.courseFee || 0
              ).toLocaleString("en-IN")}
            </p>
          </div>

          {/* PAID */}
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Paid
            </p>

            <p className="mt-1 text-lg font-black text-emerald-600">
              ₹
              {Number(
                student.totalPaid || 0
              ).toLocaleString("en-IN")}
            </p>
          </div>

          {/* ATTENDANCE */}
          <div className="rounded-xl bg-orange-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Attendance
            </p>

            <p className="mt-1 text-lg font-black text-orange-600">
              {Number(
                student.attendancePercentage || 0
              )}
              %
            </p>
          </div>

        </div>

      </div>

      {/* ADDITIONAL INFO */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="font-bold text-slate-900">
          Enrollment Information
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <p className="text-xs text-slate-400">
              Student ID
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {student.studentId ||
                student._id ||
                "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Registration Fee
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              ₹
              {Number(
                student.registrationFee || 0
              ).toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Certificate Fee
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              ₹
              {Number(
                student.certificateFee || 0
              ).toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Pending Fee
            </p>

            <p className="mt-1 font-semibold text-red-600">
              ₹
              {Number(
                student.totalPending || 0
              ).toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Created At
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {student.createdAt
                ? new Date(
                    student.createdAt
                  ).toLocaleDateString(
                    "en-IN"
                  )
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Last Updated
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {student.updatedAt
                ? new Date(
                    student.updatedAt
                  ).toLocaleDateString(
                    "en-IN"
                  )
                : "-"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDetail;