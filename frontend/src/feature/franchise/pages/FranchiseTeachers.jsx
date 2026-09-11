import { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Eye,
  Plus,
  Trash2,
  Search,
  Users,
  BookOpen,
  UserCheck,
  X,
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
  RefreshCw,
  GraduationCap,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { NAME_PATTERN } from "../../../utils/name";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sanitizePhoneInput } from "../../../utils/phone";
import { sanitizeNameInput } from "../../../utils/name";
import { Pagination } from "../../../components/Pagination";

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

const FranchiseTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const location = useLocation();
  const navigate = useNavigate();
  const isAddRoute = location.pathname.endsWith("/teachers/add");

  // =====================================================
  // LOAD DATA
  // =====================================================

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const [teachersResponse, coursesResponse] =
        await Promise.all([
          apiFetch("/api/portal/teachers"),
          apiFetch("/api/portal/courses"),
        ]);

      setTeachers(teachersResponse?.data || []);
      setCourses(coursesResponse?.data || []);
    } catch (e) {
      console.error("Error loading teachers:", e);
      setError(e?.message || "Unable to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setShowForm(isAddRoute);
    if (isAddRoute) {
      setEditing(null);
      setForm(empty);
    }
  }, [isAddRoute]);

  // =====================================================
  // FILTER
  // =====================================================

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return teachers;

    return teachers.filter((teacher) =>
      [
        teacher?.name,
        teacher?.mobile,
        teacher?.email,
        ...(teacher?.assignedCourses || []).map(
          (course) => course?.title || course?.name
        ),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [teachers, search]);
  const pageTeachers = filtered.slice((page - 1) * pageSize, page * pageSize);

  // =====================================================
  // STATS
  // =====================================================

  const stats = useMemo(() => {
    const active = teachers.filter(
      (teacher) => teacher?.isActive
    ).length;

    const inactive = teachers.length - active;

    const assignedCourses = teachers.reduce(
      (total, teacher) =>
        total + (teacher?.assignedCourses?.length || 0),
      0
    );

    return {
      total: teachers.length,
      active,
      inactive,
      assignedCourses,
    };
  }, [teachers]);

  // =====================================================
  // FORM
  // =====================================================

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setError("");
    navigate("/franchise/teachers/add");
  };

  const openEdit = (teacher) => {
    setEditing(teacher);

    setForm({
      name: teacher?.name || "",
      mobile: teacher?.mobile || "",
      email: teacher?.email || "",
      password: "",
      qualification: teacher?.qualification || "",
      specialization: teacher?.specialization || "",
      experience: teacher?.experience || "",
      joiningDate: teacher?.joiningDate ? teacher.joiningDate.slice(0, 10) : "",
      address: teacher?.address || "",
      emergencyContact: teacher?.emergencyContact || "",
      courseIds: (teacher?.assignedCourses || []).map(
        (course) => course._id
      ),
    });

    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(empty);
    if (isAddRoute) navigate("/franchise/teachers");
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await apiFetch(
        editing
          ? `/api/portal/teachers/${editing._id}`
          : "/api/portal/teachers",
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify(form),
        }
      );

      closeForm();
      await load();
    } catch (err) {
      console.error("Teacher save error:", err);
      setError(err?.message || "Unable to save teacher");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE / DEACTIVATE
  // =====================================================

  const remove = async (teacher) => {
    if (
      !window.confirm(
        `Delete ${teacher.name}?`
      )
    ) {
      return;
    }

    try {
      setError("");

      await apiFetch(
        `/api/portal/teachers/${teacher._id}`,
        {
          method: "DELETE",
        }
      );

      await load();
    } catch (e) {
      console.error("Teacher delete error:", e);
      setError(e?.message || "Unable to delete teacher");
    }
  };

  // =====================================================
  // COURSE TOGGLE
  // =====================================================

  const toggle = (id) => {
    setForm((current) => ({
      ...current,
      courseIds: current.courseIds.includes(id)
        ? current.courseIds.filter((x) => x !== id)
        : [...current.courseIds, id],
    }));
  };

  // =====================================================
  // AVATAR
  // =====================================================

  const getInitial = (name) => {
    return (
      name?.trim()?.charAt(0)?.toUpperCase() || "T"
    );
  };

  const avatarColors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-500",
    "from-cyan-500 to-blue-600",
    "from-violet-500 to-purple-600",
  ];

  const getAvatarColor = (index) => {
    return avatarColors[index % avatarColors.length];
  };

  return (
    <div className="min-h-full space-y-4 bg-slate-50/40">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-100">
            <GraduationCap size={20} />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-blue-600">
              Faculty Management
            </p>

            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Teachers
            </h1>

            <p className="text-xs text-slate-500">
              Manage your franchise teaching staff.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 text-xs font-bold text-white shadow-sm shadow-blue-100 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-md"
          >
            <Plus size={15} />
            Add Teacher
          </button>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-red-100 text-red-600">
              !
            </span>

            <p className="text-xs font-semibold text-red-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="rounded-lg p-1 text-red-500 hover:bg-red-100"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      {!loading && (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {/* Total */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <Users size={16} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Total
                </p>

                <p className="text-lg font-black text-slate-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <UserCheck size={16} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Active
                </p>

                <p className="text-lg font-black text-emerald-600">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-50 text-purple-600">
                <BookOpen size={16} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Assignments
                </p>

                <p className="text-lg font-black text-purple-600">
                  {stats.assignedCourses}
                </p>
              </div>
            </div>
          </div>

          {/* Inactive */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <ShieldCheck size={16} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Inactive
                </p>

                <p className="text-lg font-black text-slate-600">
                  {stats.inactive}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search teacher, mobile, email or course..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {!loading && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[10px] text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-700">
                {filtered.length}
              </span>{" "}
              teachers
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Loader2
            size={26}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-2 text-xs font-semibold text-slate-500">
            Loading teachers...
          </p>
        </div>
      )}

      {/* =================================================
          TEACHER TABLE
      ================================================= */}

      {!loading && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Teacher
                  </th>

                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Contact
                  </th>

                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Courses
                  </th>

                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {pageTeachers.map((teacher, index) => (
                  <tr
                    key={teacher._id}
                    className="group transition hover:bg-slate-50/70"
                  >
                    {/* Teacher */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-black text-white shadow-sm ${getAvatarColor(
                            index
                          )}`}
                        >
                          {getInitial(teacher.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-800">
                            {teacher.name}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            Faculty member
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Phone
                            size={12}
                            className="text-slate-400"
                          />
                          {teacher.mobile || "No mobile"}
                        </div>

                        <div className="flex max-w-[220px] items-center gap-1.5 truncate text-[10px] text-slate-500">
                          <Mail
                            size={12}
                            className="shrink-0 text-slate-400"
                          />

                          <span className="truncate">
                            {teacher.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Courses */}
                    <td className="px-4 py-3">
                      {teacher.assignedCourses?.length ? (
                        <div className="flex max-w-[250px] flex-wrap gap-1">
                          {teacher.assignedCourses
                            .slice(0, 2)
                            .map((course) => (
                              <span
                                key={course._id}
                                className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-700"
                              >
                                <BookOpen size={10} />

                                {course.title ||
                                  course.name}
                              </span>
                            ))}

                          {teacher.assignedCourses
                            .length > 2 && (
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500">
                              +
                              {teacher.assignedCourses
                                .length - 2}{" "}
                              more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">
                          Not assigned
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {teacher.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          to={`/franchise/teachers/${teacher._id}`}
                          title="View teacher"
                          aria-label="View teacher"
                          className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                        >
                          <Eye size={14} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            openEdit(teacher)
                          }
                          title="Edit teacher"
                          aria-label="Edit teacher"
                          className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                        >
                          <Edit size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            remove(teacher)
                          }
                          title="Deactivate teacher"
                          aria-label="Deactivate teacher"
                          className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty */}
            {!filtered.length && (
              <div className="p-10 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-400">
                  <Search size={21} />
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-800">
                  No teachers found
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Try searching with another name, email
                  or mobile number.
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-3 rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
            <Pagination page={page} pageCount={Math.ceil(filtered.length / pageSize)} onPageChange={setPage} totalItems={filtered.length} pageSize={pageSize} />
          </div>
        </div>
      )}

      {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={closeForm}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">
                  {editing ? (
                    <Edit size={17} />
                  ) : (
                    <Plus size={18} />
                  )}
                </div>

                <div>
                  <h2 className="text-base font-black text-slate-900">
                    {editing
                      ? "Edit Teacher"
                      : "Add Teacher"}
                  </h2>

                  <p className="text-[10px] text-slate-500">
                    {editing
                      ? "Update teacher information and courses."
                      : "Create a new faculty member."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white text-slate-400 shadow-sm transition hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Teacher Name
                  </label>

                  <input
                    required
                    pattern={NAME_PATTERN}
                    placeholder="Enter teacher name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: sanitizeNameInput(e.target.value),
                      })
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Mobile Number
                  </label>

                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="Enter mobile number"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mobile: sanitizePhoneInput(e.target.value),
                      })
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Email
                  </label>

                  <input
                    required
                    type="email"
                    placeholder="teacher@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
                  />
                </div>

                {/* Password */}
                {!editing && (
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Temporary Password
                    </label>

                    <input
                      required
                      minLength={6}
                      type="password"
                      autoComplete="new-password"
                      placeholder="Minimum 6 characters"
                      value={form.password}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          password: e.target.value,
                        })
                      }
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
                    />
                  </div>
                )}
              </div>

              {/* Professional and personal details */}
              <div className="border-t border-slate-100 pt-4">
                <div className="mb-3">
                  <p className="text-xs font-black text-slate-800">Additional Details</p>
                  <p className="text-[10px] text-slate-400">Add the teacher&apos;s professional and contact information.</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["qualification", "Qualification", "e.g. M.Sc, B.Ed"],
                    ["specialization", "Subject / Specialization", "e.g. Mathematics"],
                    ["experience", "Teaching Experience", "e.g. 5 years"],
                    ["emergencyContact", "Emergency Contact", "Name and phone number"],
                  ].map(([key, label, placeholder]) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {label}
                      </label>
                      <input
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      value={form.joiningDate}
                      onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Address
                    </label>
                    <input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Residential address"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Courses */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-800">
                      Assigned Courses
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Select courses this teacher can manage.
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-600">
                    {form.courseIds.length} selected
                  </span>
                </div>

                {courses.length > 0 ? (
                  <div className="grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
                    {courses.map((course) => {
                      const selected =
                        form.courseIds.includes(
                          course._id
                        );

                      return (
                        <button
                          type="button"
                          key={course._id}
                          onClick={() =>
                            toggle(course._id)
                          }
                          className={`flex items-center gap-2 rounded-lg border p-2.5 text-left transition ${
                            selected
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                          }`}
                        >
                          <div
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                              selected
                                ? "bg-blue-600 text-white"
                                : "bg-white text-slate-400"
                            }`}
                          >
                            <BookOpen size={13} />
                          </div>

                          <span className="min-w-0 flex-1 truncate text-[10px] font-bold">
                            {course.title ||
                              course.name}
                          </span>

                          {selected && (
                            <CheckIcon />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                    <BookOpen
                      size={20}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-1 text-[10px] text-slate-400">
                      No courses available.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
              <button
                type="button"
                onClick={closeForm}
                className="h-9 rounded-lg bg-white px-4 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-xs font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                )}

                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : "Create Teacher"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setViewing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Profile Header */}
            <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-5 pb-12 pt-5 text-white">
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg bg-white/15 text-white transition hover:bg-white/25"
              >
                <X size={16} />
              </button>

              <div className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-white/30 bg-white/20 text-xl font-black backdrop-blur-sm">
                {getInitial(viewing.name)}
              </div>

              <h2 className="mt-3 text-lg font-black">
                {viewing.name}
              </h2>

              <p className="mt-0.5 text-xs text-blue-100">
                Faculty Member
              </p>
            </div>

            {/* Profile Body */}
            <div className="-mt-6 px-5 pb-5">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                      <Mail size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Email
                      </p>

                      <p className="truncate text-xs font-semibold text-slate-700">
                        {viewing.email || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Phone size={14} />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Mobile
                      </p>

                      <p className="text-xs font-semibold text-slate-700">
                        {viewing.mobile || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple-50 text-purple-600">
                      <BookOpen size={14} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Assigned Courses
                      </p>

                      {viewing.assignedCourses?.length ? (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {viewing.assignedCourses.map(
                            (course) => (
                              <span
                                key={course._id}
                                className="rounded-md bg-purple-50 px-2 py-1 text-[9px] font-bold text-purple-700"
                              >
                                {course.title ||
                                  course.name}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">
                          No courses assigned
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        viewing.isActive
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />

                    <span
                      className={`text-xs font-bold ${
                        viewing.isActive
                          ? "text-emerald-600"
                          : "text-slate-500"
                      }`}
                    >
                      {viewing.isActive
                        ? "Active Teacher"
                        : "Inactive Teacher"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewing(null)}
                className="mt-3 h-9 w-full rounded-lg bg-slate-100 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// CHECK ICON
// =====================================================

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-blue-600"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export { FranchiseTeachers };
export default FranchiseTeachers;
