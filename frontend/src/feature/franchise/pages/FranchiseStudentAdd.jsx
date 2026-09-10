import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { sanitizePhoneInput } from "../../../utils/phone";
import { NAME_PATTERN, sanitizeNameInput } from "../../../utils/name";

const FranchiseStudentAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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

    if (id) {
      apiFetch(`/api/students/${id}`)
        .then(({ student }) =>
          setForm({
            name: student.name || "",
            mobile: student.mobile || "",
            email: student.email || "",
            courseId: student.courseId?._id || student.courseId || "",
          }),
        )
        .catch((error) =>
          setMessage(error.message || "Unable to load student"),
        );
    }
  }, [id]);

  // =========================
  // Input Change
  // =========================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "mobile" ? sanitizePhoneInput(value) : name === "name" ? sanitizeNameInput(value) : value,
    }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      errors.name = "Student name is required.";
    } else if (!new RegExp(`^${NAME_PATTERN}$`, "u").test(name)) {
      errors.name = "Use letters, spaces, apostrophes, dots, or hyphens only.";
    } else if (name.length < 2) {
      errors.name = "Student name must be at least 2 characters.";
    }

    if (!/^\d{10}$/.test(form.mobile.trim())) {
      errors.mobile = "Mobile number must be exactly 10 digits.";
    }

    if (!email) {
      errors.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!form.courseId) {
      errors.courseId = "Please select a course.";
    }

    return errors;
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();
    setFieldErrors(errors);

    // Do not make a create/update API request until every required field is valid.
    if (Object.keys(errors).length) {
      setMessage("Please correct the highlighted fields and try again.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const user = JSON.parse(
        localStorage.getItem("ai_scholars_user") || "null",
      );

      if (!user?.coachingId) {
        throw new Error("Franchise coaching ID not found. Please login again.");
      }

      const payload = {
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        courseId: form.courseId,
        coachingId: user.coachingId,
      };

      await apiFetch(isEdit ? `/api/students/${id}` : "/api/students", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      navigate("/franchise/students");
    } catch (error) {
      console.error("Create Student Error:", error);

      setMessage(
        error.message || "Unable to create student. Please try again.",
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
            {isEdit ? "Edit Student" : "Add Student"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {isEdit
              ? "Update this franchise student record."
              : "Create a new student enrolment for your franchise centre."}
          </p>
        </div>
      </div>

      {/* =========================
          Error Message
      ========================= */}
      {message && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-semibold text-red-600">{message}</p>
        </div>
      )}

      {/* =========================
          Form Card
      ========================= */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Form Header */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-black text-slate-900">
            {isEdit ? "Edit Student Information" : "Student Information"}
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
              pattern={NAME_PATTERN}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              value={form.name}
              onChange={handleChange}
              placeholder="Enter student name"
              className={getInputClass(fieldErrors.name)}
            />
            <FieldError id="name-error" message={fieldErrors.name} />
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
              inputMode="numeric"
              maxLength={10}
              pattern="[0-9]{10}"
              aria-invalid={Boolean(fieldErrors.mobile)}
              aria-describedby={fieldErrors.mobile ? "mobile-error" : undefined}
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className={getInputClass(fieldErrors.mobile)}
            />
            <FieldError id="mobile-error" message={fieldErrors.mobile} />
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
              required
              inputMode="email"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className={getInputClass(fieldErrors.email)}
            />
            <FieldError id="email-error" message={fieldErrors.email} />
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
              aria-invalid={Boolean(fieldErrors.courseId)}
              aria-describedby={fieldErrors.courseId ? "course-error" : undefined}
              className={`${getInputClass(fieldErrors.courseId)} disabled:cursor-not-allowed disabled:bg-slate-50`}
            >
              <option value="">
                {loadingCourses ? "Loading courses..." : "Select course"}
              </option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} - {course.category || "General"}
                </option>
              ))}
            </select>
            <FieldError id="course-error" message={fieldErrors.courseId} />
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
                {isEdit ? "Update Student" : "Save Student"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const getInputClass = (hasError) =>
  `mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
  }`;

const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} className="mt-1.5 text-xs font-medium text-red-600" role="alert">
      {message}
    </p>
  ) : null;

export default FranchiseStudentAdd;
