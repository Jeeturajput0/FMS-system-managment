import { useEffect, useMemo, useState } from "react";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { apiFetch } from "../../../utils/api";

const empty = { name: "", email: "", password: "", courseIds: [] };
export const FranchiseTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const load = () =>
    Promise.all([apiFetch("/api/portal/teachers"), apiFetch("/api/courses")])
      .then(([a, b]) => {
        setTeachers(a.data || []);
        setCourses(b.data || []);
      })
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);
  const filtered = useMemo(
    () =>
      teachers.filter((t) =>
        `${t.name} ${t.email}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [teachers, search],
  );
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await apiFetch(
        editing
          ? `/api/portal/teachers/${editing._id}`
          : "/api/portal/teachers",
        { method: editing ? "PUT" : "POST", body: JSON.stringify(form) },
      );
      setShowForm(false);
      setEditing(null);
      setForm(empty);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };
  const remove = async (teacher) => {
    if (!window.confirm(`Deactivate ${teacher.name}?`)) return;
    try {
      await apiFetch(`/api/portal/teachers/${teacher._id}`, {
        method: "DELETE",
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const toggle = (id) =>
    setForm({
      ...form,
      courseIds: form.courseIds.includes(id)
        ? form.courseIds.filter((x) => x !== id)
        : [...form.courseIds, id],
    });
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Faculty management
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Teachers</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create, view, edit and deactivate franchise teachers.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm(empty);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
        >
          <Plus size={17} /> Add teacher
        </button>
      </div>
      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}
      {showForm && (
        <form
          onSubmit={submit}
          className="grid gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:grid-cols-2"
        >
          <input
            required
            placeholder="Teacher name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border px-3 py-2"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl border px-3 py-2"
          />
          {!editing && (
            <input
              required
              minLength={6}
              type="password"
              placeholder="Temporary password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="rounded-xl border px-3 py-2"
            />
          )}
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-bold">Assigned courses</p>
            <div className="flex flex-wrap gap-2">
              {courses.map((c) => (
                <button
                  type="button"
                  key={c._id}
                  onClick={() => toggle(c._id)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold ${form.courseIds.includes(c._id) ? "bg-blue-600 text-white" : "bg-white text-slate-600"}`}
                >
                  {c.title || c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white">
              {editing ? "Save changes" : "Create teacher"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl bg-white px-4 py-2 font-bold text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search teachers..."
        className="w-full rounded-xl border bg-white px-4 py-3 text-sm"
      />
      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Teacher</th>
                <th className="px-5 py-4">Assigned courses</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((t) => (
                <tr key={t._id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    {t.assignedCourses
                      ?.map((c) => c.title || c.name)
                      .join(", ") || "Not assigned"}
                  </td>
                  <td className="px-5 py-4 text-emerald-600">
                    {t.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setViewing(t)}
                        className="rounded-lg bg-slate-100 p-2 text-slate-600"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(t);
                          setForm({
                            name: t.name,
                            email: t.email,
                            password: "",
                            courseIds: (t.assignedCourses || []).map(
                              (c) => c._id,
                            ),
                          });
                          setShowForm(true);
                        }}
                        className="rounded-lg bg-blue-50 p-2 text-blue-600"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => remove(t)}
                        className="rounded-lg bg-red-50 p-2 text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <p className="p-8 text-center text-sm text-slate-500">
              No teachers found.
            </p>
          )}
        </div>
      </div>
      {viewing && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
          onClick={() => setViewing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6"
          >
            <h2 className="text-xl font-black">{viewing.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{viewing.email}</p>
            <p className="mt-5 text-sm">
              <b>Courses:</b>{" "}
              {viewing.assignedCourses
                ?.map((c) => c.title || c.name)
                .join(", ") || "None"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
