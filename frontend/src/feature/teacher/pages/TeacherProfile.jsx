
import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  GraduationCap,
  Briefcase,
  CalendarDays,
  MapPin,
  HeartPulse,
  BookOpen,
  Eye,
  EyeOff,
  Save,
  Loader2,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const empty = {
  name: "",
  mobile: "",
  email: "",
  password: "",
  qualification: "",
  specialization: "",
  experience: "",
  joiningDate: "",
  address: "",
  emergencyContact: "",
  courseIds: [],
};

const TeacherProfile = () => {
  const [formData, setFormData] = useState(empty);
  const [courses, setCourses] = useState([]);
  const [savedFormData, setSavedFormData] = useState(empty);
  const [teacherId, setTeacherId] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        setError("");

        // `/api/auth/me` is the actual current-user endpoint. Its `user.id`
        // is then used with the existing populated teacher-profile endpoint.
        const currentUserResponse = await apiFetch("/api/auth/me");
        const currentTeacherId = currentUserResponse?.user?.id;

        if (!currentTeacherId) {
          throw new Error("Unable to identify the current teacher account.");
        }

        const profileResponse = await apiFetch(
          `/api/portal/teachers/${currentTeacherId}`,
        );
        const teacher = profileResponse?.data;

        if (!teacher) {
          throw new Error("Teacher profile was not found.");
        }

        const assignedCourses = Array.isArray(teacher.assignedCourses)
          ? teacher.assignedCourses
          : [];

        const nextFormData = {
          name: teacher.name || "",
          mobile: teacher.mobile || "",
          email: teacher.email || "",
          password: "",
          qualification: teacher.qualification || "",
          specialization: teacher.specialization || "",
          experience: teacher.experience || "",
          joiningDate: teacher.joiningDate
            ? String(teacher.joiningDate).slice(0, 10)
            : "",
          address: teacher.address || "",
          emergencyContact: teacher.emergencyContact || "",
          // `courseIds` is the PUT request field; the persisted field is
          // `assignedCourses`, which this endpoint has already populated.
          courseIds: assignedCourses.map((course) =>
            String(course?._id || course),
          ),
        };

        setTeacherId(currentTeacherId);
        setCourses(assignedCourses);
        setFormData(nextFormData);
        setSavedFormData(nextFormData);
      } catch (err) {
        console.error("LOAD TEACHER PROFILE:", err);
        setError(err.message || "Unable to load your teacher profile.");
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!teacherId) {
      setError("Teacher profile is still loading. Please try again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const payload = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        qualification: formData.qualification.trim(),
        specialization: formData.specialization.trim(),
        experience: formData.experience.trim(),
        joiningDate: formData.joiningDate || null,
        address: formData.address.trim(),
        emergencyContact: formData.emergencyContact.trim(),
        // Preserve the franchise-assigned courses. The backend expects this
        // exact request field when updating a teacher.
        courseIds: formData.courseIds,
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      await apiFetch(`/api/portal/teachers/${teacherId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setFormData((current) => ({ ...current, password: "" }));
      setSavedFormData((current) => ({ ...current, password: "" }));
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("SAVE PROFILE:", err);
      setError(err.message || "Unable to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const initials =
    formData.name?.trim()?.charAt(0)?.toUpperCase() || "T";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* HEADER */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Teacher Account
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information, professional details
            and assigned courses.
          </p>
        </div>

        {/* SUCCESS */}
        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {profileLoading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              Loading your teacher profile...
            </div>
          </div>
        ) : !teacherId ? null : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PROFILE HEADER CARD */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-28 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />

            <div className="px-6 pb-6">
              <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4">
                  {/* AVATAR */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-blue-600 text-2xl font-black text-white shadow-lg">
                    {initials}
                  </div>

                  <div className="pb-1">
                    <h2 className="text-xl font-black text-slate-900">
                      {formData.name || "Teacher"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {formData.specialization ||
                        "Faculty / Teacher"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">
                  <User className="h-4 w-4" />
                  Teacher Profile
                </div>
              </div>
            </div>
          </div>

          {/* PERSONAL INFORMATION */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <User className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-black text-slate-900">
                  Personal Information
                </h2>

                <p className="text-xs text-slate-500">
                  Basic information about you.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* NAME */}
              <FormField
                label="Full Name"
                icon={<User className="h-4 w-4" />}
                required
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                  required
                />
              </FormField>

              {/* EMAIL */}
              <FormField
                label="Email Address"
                icon={<Mail className="h-4 w-4" />}
                required
              >
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="teacher@example.com"
                  className={inputClass}
                  required
                />
              </FormField>

              {/* MOBILE */}
              <FormField
                label="Mobile Number"
                icon={<Phone className="h-4 w-4" />}
              >
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className={inputClass}
                />
              </FormField>

              {/* PASSWORD */}
              <FormField
                label="Password"
                icon={<Lock className="h-4 w-4" />}
              >
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className={`${inputClass} pr-11`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormField>
            </div>
          </section>

          {/* PROFESSIONAL INFORMATION */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-black text-slate-900">
                  Professional Information
                </h2>

                <p className="text-xs text-slate-500">
                  Add your qualification and teaching experience.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* QUALIFICATION */}
              <FormField
                label="Qualification"
                icon={<GraduationCap className="h-4 w-4" />}
              >
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g. M.Tech, M.Sc, MBA"
                  className={inputClass}
                />
              </FormField>

              {/* SPECIALIZATION */}
              <FormField
                label="Specialization"
                icon={<Briefcase className="h-4 w-4" />}
              >
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className={inputClass}
                />
              </FormField>

              {/* EXPERIENCE */}
              <FormField
                label="Experience"
                icon={<Briefcase className="h-4 w-4" />}
              >
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5 years"
                  className={inputClass}
                />
              </FormField>

              {/* JOINING DATE */}
              <FormField
                label="Joining Date"
                icon={<CalendarDays className="h-4 w-4" />}
              >
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>
            </div>
          </section>

          {/* ADDRESS & EMERGENCY */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <MapPin className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-black text-slate-900">
                  Contact Details
                </h2>

                <p className="text-xs text-slate-500">
                  Address and emergency contact information.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              {/* ADDRESS */}
              <FormField
                label="Address"
                icon={<MapPin className="h-4 w-4" />}
              >
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </FormField>

              {/* EMERGENCY CONTACT */}
              <FormField
                label="Emergency Contact"
                icon={<HeartPulse className="h-4 w-4" />}
              >
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Emergency contact name / mobile"
                  className={inputClass}
                />
              </FormField>
            </div>
          </section>

          {/* COURSES */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Assigned Courses
                  </h2>

                  <p className="text-xs text-slate-500">
                    Courses assigned to you by your franchise.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                {formData.courseIds.length} Selected
              </span>
            </div>

            {courses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No courses assigned
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Your franchise has not assigned any courses to this account yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => {
                  const selected = formData.courseIds.includes(
                    course._id
                  );

                  return (
                    <article
                      key={course._id}
                      className={`flex items-start gap-3 rounded-2xl border p-4 ${
                        selected
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-600 text-[10px] font-black text-white">
                        ✓
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {course.title || "Untitled Course"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {course.description
                            ? course.description.slice(0, 60)
                            : "Course"}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* SAVE */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setFormData(savedFormData);
                setMessage("");
                setError("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   REUSABLE FORM FIELD
------------------------------------------------------- */

const FormField = ({
  label,
  icon,
  required = false,
  children,
}) => {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
        <span className="text-slate-400">{icon}</span>
        {label}

        {required && (
          <span className="text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
};

/* -------------------------------------------------------
   INPUT STYLE
------------------------------------------------------- */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50";

export default TeacherProfile;
