import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const week = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const initials = (value) => {
  const words = String(value || "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "XX";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.map((word) => word[0]).join("").slice(0, 4).toUpperCase();
};

const previewBatchCode = (franchiseName, courseTitle, startDate) => {
  const date = startDate ? new Date(`${startDate}T00:00:00`) : new Date();
  const validDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return `${initials(franchiseName)}${initials(courseTitle)}${String(validDate.getMonth() + 1).padStart(2, "0")}${String(validDate.getFullYear()).slice(-2)}`;
};

const FranchiseBatchForm = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("ai_scholars_user") || "null");
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [franchiseName, setFranchiseName] = useState("");
  const [franchiseId, setFranchiseId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    course: "",
    teacher: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    days: [],
    room: "",
    maxStudents: 30,
    status: "ACTIVE",
  });

  useEffect(() => {
    const storedFranchiseId = user?.coachingId || user?.franchiseId;
    Promise.all([
      apiFetch("/api/courses"),
      apiFetch("/api/portal/teachers"),
      id ? apiFetch(`/api/batches/${id}`) : Promise.resolve(null),
      storedFranchiseId ? apiFetch(`/api/coaching/${storedFranchiseId}`) : apiFetch("/api/portal/settings"),
    ])
      .then(([courseResponse, teacherResponse, batchResponse, franchiseResponse]) => {
        const franchise = franchiseResponse?.coaching || franchiseResponse?.data || {};
        setCourses(courseResponse.data || []);
        setTeachers(teacherResponse.data || []);
        setFranchiseId(storedFranchiseId || franchise?._id || "");
        setFranchiseName(franchise.name || user?.coachingName || "");
        if (batchResponse?.batch)
          setForm((current) => ({
            ...current,
          ...batchResponse.batch,
          startDate: batchResponse.batch.startDate
            ? String(batchResponse.batch.startDate).slice(0, 10)
            : "",
          endDate: batchResponse.batch.endDate
            ? String(batchResponse.batch.endDate).slice(0, 10)
            : "",
            course:
              batchResponse.batch.course?._id ||
              batchResponse.batch.course ||
              "",
            teacher:
              batchResponse.batch.teacher?._id ||
              batchResponse.batch.teacher ||
              "",
          }));
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  useEffect(() => {
    if (id || !franchiseName || !form.course) return;
    const selectedCourse = courses.find((course) => course._id === form.course);
    if (!selectedCourse) return;
    setForm((current) => ({
      ...current,
      code: previewBatchCode(
        franchiseName,
        selectedCourse.title || selectedCourse.name,
        current.startDate,
      ),
    }));
  }, [courses, franchiseName, form.course, form.startDate, id]);

  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const toggleDay = (day) =>
    setForm({
      ...form,
      days: form.days.includes(day)
        ? form.days.filter((item) => item !== day)
        : [...form.days, day],
    });
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiFetch(id ? `/api/batches/${id}` : "/api/batches", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify({
          ...form,
          franchise: franchiseId || user?.coachingId || user?.franchiseId,
        }),
      });
      navigate("/franchise/batches");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to="/franchise/batches"
          className="text-sm font-semibold text-blue-600"
        >
          ← Back to batches
        </Link>
        <h1 className="mt-3 text-3xl font-black text-slate-900">
          Create batch
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Set up a batch for your franchise students.
        </p>
      </div>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <form
        onSubmit={submit}
        className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2"
      >
        <label>
          <span className="label">Batch name</span>
          <input
            required
            name="name"
            value={form.name}
            onChange={update}
            className="input"
          />
        </label>
        <label>
          <span className="label">Batch code</span>
          <input
            name="code"
            value={form.code}
            readOnly
            placeholder="Select course and start date"
            className="input"
          />
         
        </label>
        <label>
          <span className="label">Course</span>
          <select
            required
            name="course"
            value={form.course}
            onChange={update}
            className="input"
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title || course.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Teacher</span>
          <select
            name="teacher"
            value={form.teacher}
            onChange={update}
            className="input"
          >
            <option value="">Unassigned</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Start date</span>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={update}
            className="input"
          />
        </label>
        <label>
          <span className="label">End date</span>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={update}
            className="input"
          />
        </label>
        <label>
          <span className="label">Start time</span>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={update}
            className="input"
          />
        </label>
        <label>
          <span className="label">End time</span>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={update}
            className="input"
          />
        </label>
        <label>
          <span className="label">Room</span>
          <input
            name="room"
            value={form.room}
            onChange={update}
            className="input"
          />
        </label>
        <label>
          <span className="label">Maximum students</span>
          <input
            required
            type="number"
            min="1"
            name="maxStudents"
            value={form.maxStudents}
            onChange={update}
            className="input"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="label">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={update}
            className="input min-h-24"
          />
        </label>
        <div className="sm:col-span-2">
          <span className="label">Days</span>
          <div className="flex flex-wrap gap-2">
            {week.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => toggleDay(day)}
                className={`rounded-lg px-3 py-2 text-xs font-bold ${form.days.includes(day) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <button
            disabled={saving}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create batch"}
          </button>
        </div>
      </form>
      <style>{`.label{display:block;margin-bottom:.35rem;font-size:.875rem;font-weight:600;color:#334155}.input{width:100%;border:1px solid #e2e8f0;border-radius:.75rem;padding:.7rem .8rem;outline:none}.input:focus{border-color:#3b82f6}`}</style>
    </div>
  );
};

export default FranchiseBatchForm;
