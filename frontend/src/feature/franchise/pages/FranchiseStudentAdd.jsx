import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  User,
  Phone,
  Mail,
  BookOpen,
  Save,
  Loader2,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const FranchiseStudentAdd = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    courseId: "",
  });

  // =========================
  // Get Courses
  // =========================
  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoadingCourses(true);
        setMessage("");

        const response = await apiFetch("/api/portal/courses");

        setCourses(response?.data || []);
      } catch (error) {
        console.error("Get Courses Error:", error);
        setMessage(error.message || "Unable to load courses");
      } finally {
        setLoadingCourses(false);
      }
    };

    getCourses();
  }, []);

  // =========================
  // Input Change
  // =========================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const user = JSON.parse(
        localStorage.getItem("ai_scholars_user") || "null"
      );

      if (!user?.coachingId) {
        throw new Error(
          "Franchise coaching ID not found. Please login again."
        );
      }

      const payload = {
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        courseId: form.courseId,
        coachingId: user.coachingId,
      };

      await apiFetch("/api/students", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      navigate("/franchise/students");
    } catch (error) {
      console.error("Create Student Error:", error);

      setMessage(
        error.message || "Unable to create student. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* =========================
          Header
      ========================= */}
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => navigate("/franchise/students")}
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <UserPlus size={19} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Franchise Operations
            </p>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Add Student
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create a new student enrolment for your franchise centre.
          </p>
        </div>
      </div>

      {/* =========================
          Error Message
      ========================= */}
      {message && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-semibold text-red-600">
            {message}
          </p>
        </div>
      )}

      {/* =========================
          Form Card
      ========================= */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Form Header */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-black text-slate-900">
            Student Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter the student's basic information and course details.
          </p>
        </div>

        {/* Form Body */}
        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          {/* Student Name */}
          <div>
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-bold text-slate-700"
            >
              <User size={16} className="text-blue-600" />
              Student Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Enter student name"
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Mobile */}
          <div>
            <label
              htmlFor="mobile"
              className="flex items-center gap-2 text-sm font-bold text-slate-700"
            >
              <Phone size={16} className="text-blue-600" />
              Mobile Number
            </label>

            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-bold text-slate-700"
            >
              <Mail size={16} className="text-blue-600" />
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Course */}
          <div>
            <label
              htmlFor="courseId"
              className="flex items-center gap-2 text-sm font-bold text-slate-700"
            >
              <BookOpen size={16} className="text-blue-600" />
              Course
            </label>

            <select
              id="courseId"
              name="courseId"
              required
              value={form.courseId}
              onChange={handleChange}
              disabled={loadingCourses}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">
                {loadingCourses ? "Loading courses..." : "Select course"}
              </option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/franchise/students")}
            disabled={saving}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || loadingCourses}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Student
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FranchiseStudentAdd;