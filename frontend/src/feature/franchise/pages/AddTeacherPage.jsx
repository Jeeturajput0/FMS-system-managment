import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Lock,
  GraduationCap,
  BookOpen,
  Briefcase,
  CalendarDays,
  MapPin,
  AlertCircle,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { NAME_PATTERN } from "../../../utils/name";
import { sanitizeNameInput } from "../../../utils/name";
import { sanitizePhoneInput } from "../../../utils/phone";

const AddTeacherPage = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    qualification: "",
    specialization: "",
    experience: "",
    emergencyContact: "",
    joiningDate: "",
    address: "",
  });

  // =====================================================
  // LOAD COURSES
  // =====================================================

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoadingCourses(true);

        const response = await apiFetch("/api/portal/courses");

        setCourses(response?.data || []);
      } catch (err) {
        console.error("Courses loading error:", err);
        setError(err?.message || "Unable to load courses.");
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // COURSE TOGGLE
  // =====================================================

  const toggleCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Teacher name is required.");
      return;
    }

    if (!form.mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!form.password.trim()) {
      setError("Temporary password is required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        password: form.password,

        qualification: form.qualification.trim(),
        specialization: form.specialization.trim(),
        experience: form.experience.trim(),
        emergencyContact: form.emergencyContact.trim(),
        joiningDate: form.joiningDate,
        address: form.address.trim(),

        courseIds: selectedCourses,
      };

      await apiFetch("/api/portal/teachers", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      navigate("/franchise/teachers");
    } catch (err) {
      console.error("Create teacher error:", err);

      setError(
        err?.message || "Unable to create teacher. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/franchise/teachers")}
            className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={15} />
            Back to Teachers
          </button>

          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <GraduationCap size={21} />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">
                Faculty Management
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Add Teacher
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create a new faculty member.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-red-700">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* =====================================================
            FORM
        ===================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <User size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-black text-slate-900 sm:text-base">
                    Basic Information
                  </h2>

                  <p className="text-xs text-slate-400">
                    Enter the teacher's account information.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* NAME */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Teacher Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      required
                      pattern={NAME_PATTERN}
                      name="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          name: sanitizeNameInput(e.target.value),
                        }))
                      }
                      placeholder="Enter teacher name"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* MOBILE */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mobile Number
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      required
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      name="mobile"
                      value={form.mobile}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          mobile: sanitizePhoneInput(e.target.value),
                        }))
                      }
                      placeholder="Enter mobile number"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="teacher@example.com"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Temporary Password
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      required
                      minLength={6}
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                ADDITIONAL DETAILS
            ================================================= */}

            <section className="border-t border-slate-100 p-5 sm:p-7">
              <div className="mb-6">
                <h2 className="text-sm font-black text-slate-900 sm:text-base">
                  Additional Details
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Add the teacher's professional and contact information.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* QUALIFICATION */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Qualification
                  </label>

                  <div className="relative">
                    <GraduationCap
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="qualification"
                      value={form.qualification}
                      onChange={handleChange}
                      placeholder="e.g. M.Sc, B.Ed"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* SPECIALIZATION */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Subject / Specialization
                  </label>

                  <div className="relative">
                    <BookOpen
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="specialization"
                      value={form.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Mathematics"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* EXPERIENCE */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Teaching Experience
                  </label>

                  <div className="relative">
                    <Briefcase
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      placeholder="e.g. 5 years"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* EMERGENCY */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Emergency Contact
                  </label>

                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="emergencyContact"
                      value={form.emergencyContact}
                      onChange={handleChange}
                      placeholder="Name and phone number"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* JOINING DATE */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Joining Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="date"
                      name="joiningDate"
                      value={form.joiningDate}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* ADDRESS */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Address
                  </label>

                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />

                    <textarea
                      name="address"
                      rows={3}
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Residential address"
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                ASSIGNED COURSES
            ================================================= */}

            <section className="border-t border-slate-100 p-5 sm:p-7">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-600" />

                    <h2 className="text-sm font-black text-slate-900 sm:text-base">
                      Assigned Courses
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Select courses this teacher can manage.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                  {selectedCourses.length} selected
                </span>
              </div>

              {loadingCourses ? (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-200 p-8">
                  <Loader2
                    size={20}
                    className="animate-spin text-blue-600"
                  />

                  <span className="ml-2 text-xs font-semibold text-slate-400">
                    Loading courses...
                  </span>
                </div>
              ) : courses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <BookOpen
                    size={24}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-xs font-bold text-slate-500">
                    No courses available
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {courses.map((course) => {
                    const selected = selectedCourses.includes(course._id);

                    return (
                      <button
                        key={course._id}
                        type="button"
                        onClick={() => toggleCourse(course._id)}
                        className={`flex min-w-0 items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                          selected
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                      >
                        <div
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                            selected
                              ? "bg-blue-600 text-white"
                              : "bg-white text-slate-400"
                          }`}
                        >
                          <BookOpen size={15} />
                        </div>

                        <span className="min-w-0 flex-1 break-words text-xs font-bold text-slate-700">
                          {course.title || course.name}
                        </span>

                        <div
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {selected && <Check size={12} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                disabled={saving}
                onClick={() => navigate("/franchise/teachers")}
                className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating Teacher...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Create Teacher
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherPage;