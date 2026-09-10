import React, { useEffect, useState } from "react";
import { Edit, Plus, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { sanitizeNameInput } from "../../../utils/name";

const emptyForm = { name: "", email: "", password: "", role: "ADMIN" };

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/admin/users");
      setAdmins(response.data || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdmins(); }, []);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.name === "name" ? sanitizeNameInput(event.target.value) : event.target.value }));
  const reset = () => { setForm(emptyForm); setEditingId(""); };

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const response = await apiFetch(editingId ? `/api/admin/users/${editingId}` : "/api/admin/users", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      if (editingId) setAdmins((current) => current.map((admin) => admin.id === editingId ? response.data : admin));
      else setAdmins((current) => [response.data, ...current]);
      reset();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const edit = (admin) => {
    setForm({ name: admin.name || "", email: admin.email || "", password: "", role: admin.role || "ADMIN" });
    setEditingId(admin.id);
  };
  const remove = async (admin) => {
    if (!window.confirm(`Permanently delete ${admin.name}?`)) return;
    try {
      await apiFetch(`/api/admin/users/${admin.id}`, { method: "DELETE" });
      setAdmins((current) => current.filter((item) => item.id !== admin.id));
    } catch (deleteError) { setError(deleteError.message); }
  };

  return <div className="space-y-6 pb-12">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">Administration</p><h1 className="mt-2 text-2xl font-extrabold text-slate-900">Admin Accounts</h1><p className="mt-1 text-sm text-slate-500">View and manage administrator access.</p></div><button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"><Plus className="h-4 w-4" /> New Admin</button></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Admin</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan="4" className="px-4 py-10 text-center text-slate-500">Loading admins...</td></tr> : admins.map((admin) => <tr key={admin.id}><td className="px-4 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><UserRound className="h-4 w-4" /></span><div><p className="font-bold text-slate-900">{admin.name}</p><p className="text-xs text-slate-500">{admin.email}</p></div></div></td><td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700">{admin.role}</span></td><td className="px-4 py-4"><span className={admin.isActive ? "text-emerald-600" : "text-red-600"}>{admin.isActive ? "Active" : "Inactive"}</span></td><td className="px-4 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => edit(admin)} title="Edit admin" className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100"><Edit className="h-3.5 w-3.5" /> Edit</button><button type="button" onClick={() => remove(admin)} title="Delete admin" className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-100"><Trash2 className="h-3.5 w-3.5" /> Delete</button></div></td></tr>)}</tbody></table></div></section>
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold text-slate-900">{editingId ? "Edit Admin" : "Create Admin"}</h2><p className="mt-1 text-xs text-slate-500">Keep administrator access up to date.</p></div>{editingId && <button type="button" onClick={reset} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>}</div><div className="space-y-3"><input required name="name" value={form.name} onChange={update} placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500" /><input required name="email" type="email" value={form.email} onChange={update} placeholder="Email address" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500" /><select name="role" value={form.role} onChange={update} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="ADMIN">ADMIN</option><option value="SUPER_ADMIN">SUPER_ADMIN</option></select><input required={!editingId} name="password" type="password" minLength="6" value={form.password} onChange={update} placeholder={editingId ? "New password (optional)" : "Password (6+ characters)"} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500" /><button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"><ShieldCheck className="h-4 w-4" />{saving ? "Saving..." : editingId ? "Update Admin" : "Create Admin"}</button></div></form>
    </div>
  </div>;
}
