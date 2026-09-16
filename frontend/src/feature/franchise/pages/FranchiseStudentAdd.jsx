import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Loader2, Save } from "lucide-react";
import { apiFetch, apiUpload, assetUrl } from "../../../utils/api";
import { sanitizePhoneInput } from "../../../utils/phone";
import { sanitizeNameInput } from "../../../utils/name";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["Male", "Female", "Other"];
const statuses = ["enquiry", "registered", "active", "completed", "inactive", "dropped"];

const blank = () => ({
  name: "",
  studentId: "",
  mobile: "",
  email: "",
  fatherName: "",
  courseId: "",
  joiningDate: new Date().toISOString().slice(0, 10),
  dob: "",
  gender: "",
  bloodGroup: "",
  address: "",
  photo: "",
  status: "registered",
});

const dateValue = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

export default function FranchiseStudentAdd() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(blank);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const courseResponse = await apiFetch("/api/portal/courses");
        setCourses(courseResponse.data || []);
        if (id) {
          const { student } = await apiFetch(`/api/students/${id}`);
          setForm({
            ...blank(),
            ...student,
            courseId: student.courseId?._id || student.courseId || "",
            joiningDate: dateValue(student.joiningDate) || blank().joiningDate,
            dob: dateValue(student.dob),
            status: student.status || "registered",
          });
        }
      } catch (e) {
        setError(e.message || "Unable to load student details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const change = (event) => {
    const { name, value } = event.target;
    const safe =
      name === "mobile"
        ? sanitizePhoneInput(value)
        : ["name", "fatherName"].includes(name)
          ? sanitizeNameInput(value)
          : value;
    setForm((v) => ({ ...v, [name]: safe }));
    setErrors((v) => ({ ...v, [name]: "" }));
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Choose an image file no larger than 5 MB.");
      return;
    }
    try {
      setUploading(true);
      setError("");
      const body = new FormData();
      body.append("photo", file);
      const result = await apiUpload("/api/students/upload-photo", body);
      setForm((v) => ({ ...v, photo: result.photo }));
    } catch (e) {
      setError(e.message || "Photo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Student name is required.";
    if (!/^\d{10}$/.test(form.mobile)) next.mobile = "Enter a valid 10-digit mobile number.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.courseId) next.courseId = "Please select a course.";
    if (!form.joiningDate) next.joiningDate = "Joined date is required.";
    if (!form.dob) next.dob = "Date of birth is required.";
    if (!form.gender) next.gender = "Please select gender.";
    if (!form.address.trim()) next.address = "Address is required.";
    if (!form.status) next.status = "Please select status.";
    return next;
  };

  const submit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      setError("Please correct the highlighted fields.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const user = JSON.parse(localStorage.getItem("ai_scholars_user") || "null");
      // studentId backend auto-generates — never send it on create
      const { studentId: _omit, ...rest } = form;
      await apiFetch(isEdit ? `/api/students/${id}` : "/api/students", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify({ ...rest, coachingId: user?.coachingId }),
      });
      navigate("/franchise/students");
    } catch (e) {
      setError(e.message || "Unable to save student.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => navigate("/franchise/students")}
          className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600"
        >
          <ArrowLeft size={19} />
        </button>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">Franchise Operations</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">{isEdit ? "Edit Student" : "Add Student"}</h1>
          <p className="mt-2 text-sm text-slate-500">Complete these details to create a printable student ID card.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={submit} noValidate className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
          <h2 className="font-black text-slate-900">Student Information</h2>
          <p className="mt-1 text-sm text-slate-500">Fields marked * appear on the ID card.</p>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <Field label="Student Name *" name="name" value={form.name} onChange={change} error={errors.name} placeholder="Full name" />
          <div>
            <Label>Student ID</Label>
            <input
              value={isEdit ? form.studentId || form._id || "" : "Auto-generated on save"}
              disabled
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm text-slate-500 outline-none"
            />
            <p className="mt-1 text-xs text-slate-400">ID backend se auto-generate hota hai.</p>
          </div>
          <Field label="Mobile Number *" name="mobile" type="tel" maxLength="10" value={form.mobile} onChange={change} error={errors.mobile} placeholder="10-digit mobile" />
          <Field label="Email Address" name="email" type="email" value={form.email} onChange={change} error={errors.email} placeholder="student@gmail.com" />
          <Field label="Father's Name" name="fatherName" value={form.fatherName} onChange={change} placeholder="Father's full name" />
          <div>
            <Label>Course *</Label>
            <select
              name="courseId"
              value={form.courseId}
              onChange={change}
              disabled={loading}
              className={classes(errors.courseId)}
            >
              <option value="">{loading ? "Loading courses..." : "Select course"}</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
            <Error value={errors.courseId} />
          </div>
          <Field label="Joined Date *" name="joiningDate" type="date" value={form.joiningDate} onChange={change} error={errors.joiningDate} />
          <Field label="Date of Birth *" name="dob" type="date" value={form.dob} onChange={change} error={errors.dob} />
          <Select label="Gender *" name="gender" value={form.gender} onChange={change} error={errors.gender} options={genders} />
          <Select label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={change} options={bloodGroups} />
          <div>
            <Label>Status *</Label>
            <select name="status" value={form.status} onChange={change} className={classes(errors.status)}>
              {statuses.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <Error value={errors.status} />
          </div>
          <div className="sm:row-span-2">
            <Label>Student Photo</Label>
            <label className="mt-2 flex h-[155px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-blue-400">
              {form.photo ? (
                <img
                  src={assetUrl(form.photo)}
                  className="h-full w-full object-cover"
                  alt="Student preview"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <span className="flex flex-col items-center gap-2 text-sm font-semibold text-slate-500">
                  {uploading ? <Loader2 className="animate-spin" /> : <Camera size={24} />}
                  {uploading ? "Uploading..." : "Upload photo"}
                </span>
              )}
              <input
                className="hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={upload}
                disabled={uploading}
              />
            </label>
            <p className="mt-2 text-xs text-slate-400">JPEG, PNG, WebP or GIF — max 5 MB. ID card par lagegi.</p>
          </div>
          <div>
            <Label>Address *</Label>
            <textarea
              name="address"
              rows="4"
              value={form.address}
              onChange={change}
              className={classes(errors.address, "h-auto py-3")}
              placeholder="Student's residential address"
            />
            <Error value={errors.address} />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/franchise/students")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : isEdit ? "Update Student" : "Save Student"}
          </button>
        </div>
      </form>
    </div>
  );
}

const classes = (error, extra = "") =>
  `mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 outline-none focus:ring-4 ${extra} ${
    error ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-50"
  }`;
const Label = ({ children }) => <label className="text-sm font-bold text-slate-700">{children}</label>;
const Error = ({ value }) => (value ? <p className="mt-1 text-xs font-medium text-red-600">{value}</p> : null);
const Field = ({ label, error, ...props }) => (
  <div>
    <Label>{label}</Label>
    <input {...props} className={classes(error)} />
    <Error value={error} />
  </div>
);
const Select = ({ label, name, value, onChange, options, error }) => (
  <div>
    <Label>{label}</Label>
    <select name={name} value={value} onChange={onChange} className={classes(error)}>
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    <Error value={error} />
  </div>
);
