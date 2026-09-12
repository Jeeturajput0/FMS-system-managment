import React, { useEffect, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  GraduationCap,
  Hash,
  Loader2,
  Mail,
  Pencil,
  Save,
  UserRound,
} from "lucide-react";
import { useStudentData } from "../context/StudentDataContext";
import { apiFetch } from "../../../utils/api";

const emptyForm = {
  name: "",
  mobile: "",
  dob: "",
  gender: "Other",
  address: "",
  city: "",
  state: "",
  pincode: "",
  fatherName: "",
  motherName: "",
};

const StudentProfile = () => {
  const { user, dashboard, loading, error } = useStudentData();
  const student = dashboard?.recent?.[0];

  const [form, setForm] = useState(emptyForm);
  const [formReady, setFormReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!student) return;
    const formatDob = (date) =>
      date ? new Date(date).toISOString().slice(0, 10) : "";
    setForm({
      name: student.name || user?.name || "",
      mobile: student.mobile || user?.mobile || "",
      dob: formatDob(student.dob),
      gender: student.gender || "Other",
      address: student.address || "",
      city: student.city || "",
      state: student.state || "",
      pincode: student.pincode || "",
      fatherName: student.fatherName || "",
      motherName: student.motherName || "",
    });
    setFormReady(true);
    setEditMode(false);
    setMessage("");
  }, [student, user]);

  if (loading || !formReady) {
    return (
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          Loading your profile...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      </section>
    );
  }

  if (!student) {
    return (
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Profile not found.
        </div>
      </section>
    );
  }

  const course = student?.courseId;
  const batch = student?.batchId;
  const email = student?.email || user?.email || "";

  const updateField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      setMessage("Full name is required.");
      return;
    }
    if (!form.mobile.trim()) {
      setMessage("Phone number is required.");
      return;
    }
    setSaving(true);
    setMessage("");

    try {
      await apiFetch("/api/portal/student-profile", {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          dob: form.dob || null,
          pincode: form.pincode || "",
        }),
      });
      setMessage("Profile updated successfully.");
      setEditMode(false);
    } catch (saveError) {
      setMessage(saveError.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50 disabled:text-slate-500";

  const labelClass =
    "mb-2 block text-xs font-black uppercase tracking-wider text-slate-500";

  const infoItems = [
    {
      label: "Student ID",
      value: student.studentId || "Not provided",
      icon: Hash,
      locked: true,
    },
    {
      label: "Email",
      value: email || "Not provided",
      icon: Mail,
      locked: true,
    },
    {
      label: "Course",
      value: course?.title || course?.name || "Not provided",
      icon: BookOpen,
      locked: true,
    },
    {
      label: "Batch",
      value: batch?.name || batch?.code || "Not provided",
      icon: GraduationCap,
      locked: true,
    },
  ];

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            View your course details and update your personal information.
          </p>
        </div>

        {!editMode ? (
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setEditMode(true);
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
          >
            <Pencil size={17} />
            Edit Profile
          </button>
        ) : (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setMessage("");
              }}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${
            message
              .toLowerCase()
              .includes("successfully")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-white text-slate-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* =====================================================
          READ-ONLY IDENTITY (course / batch / id / email)
      ===================================================== */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
            <BadgeCheck size={19} />
          </div>
          <div>
            <h2 className="font-black text-slate-900">Admission Details</h2>
            <p className="text-xs text-slate-500">
              These details are managed by your franchise and cannot be edited.
            </p>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          {infoItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1 break-words font-black text-slate-900">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          EDITABLE PERSONAL DETAILS
      ===================================================== */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
            <UserRound size={19} />
          </div>
          <div>
            <h2 className="font-black text-slate-900">Personal Details</h2>
            <p className="text-xs text-slate-500">
              {editMode
                ? "Update your personal information below."
                : "Tap “Edit Profile” to update your personal information."}
            </p>
          </div>
        </div>

        <div className="p-6">
          {editMode ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Phone Number *</label>
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={(event) =>
                    updateField("mobile", event.target.value)
                  }
                  placeholder="10 digit mobile number"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(event) => updateField("dob", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Gender</label>
                <select
                  value={form.gender}
                  onChange={(event) =>
                    updateField("gender", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Address</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  placeholder="House, street, area..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass}>Father's Name</label>
                <input
                  name="fatherName"
                  value={form.fatherName}
                  onChange={(event) =>
                    updateField("fatherName", event.target.value)
                  }
                  placeholder="Father's full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Mother's Name</label>
                <input
                  name="motherName"
                  value={form.motherName}
                  onChange={(event) =>
                    updateField("motherName", event.target.value)
                  }
                  placeholder="Mother's full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>City</label>
                <input
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="City"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>State</label>
                <input
                  value={form.state}
                  onChange={(event) => updateField("state", event.target.value)}
                  placeholder="State"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Pincode</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.pincode}
                  onChange={(event) =>
                    updateField(
                      "pincode",
                      event.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  placeholder="6 digit pincode"
                  className={inputClass}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Full Name", form.name],
                ["Phone Number", form.mobile],
                ["Date of Birth", student.dob ? new Date(student.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "Not provided"],
                ["Gender", student.gender || "Not provided"],
                ["Address", form.address || "Not provided"],
                ["Father's Name", form.fatherName || "Not provided"],
                ["Mother's Name", form.motherName || "Not provided"],
                ["City", form.city || "Not provided"],
                ["State", form.state || "Not provided"],
                ["Pincode", form.pincode || "Not provided"],
              ].map(([label, item]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 break-words font-bold text-slate-900">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentProfile;