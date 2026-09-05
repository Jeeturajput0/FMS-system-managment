import React, { useEffect, useState } from "react";
import { KeyRound, Loader2, Save, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", email: "", role: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    apiFetch("/api/auth/profile")
      .then((response) => setProfile(response.user))
      .catch((error) => setMessage({ type: "error", text: error.message }))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updatePassword = (event) => setPasswords((current) => ({ ...current, [event.target.name]: event.target.value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await apiFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ ...profile, ...passwords }),
      });
      localStorage.setItem("ai_scholars_user", JSON.stringify(response.user));
      setProfile(response.user);
      setPasswords({ currentPassword: "", newPassword: "" });
      setMessage({ type: "success", text: response.message });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async () => {
    if (!window.confirm("Deactivate your admin profile? You will be signed out.")) return;
    try {
      await apiFetch("/api/auth/profile", { method: "DELETE" });
      localStorage.removeItem("ai_scholars_token");
      localStorage.removeItem("ai_scholars_user");
      navigate("/login/admin", { replace: true });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  if (loading) return <div className="flex min-h-64 items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

  return <div className="mx-auto max-w-4xl space-y-6 pb-12"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">Admin Account</p><h1 className="mt-2 text-3xl font-black text-slate-900">My Profile</h1><p className="mt-2 text-sm text-slate-500">Manage your admin identity, login email and password.</p></div>
    {message.text && <div className={`rounded-xl border p-4 text-sm font-semibold ${message.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{message.text}</div>}
    <form onSubmit={save} className="space-y-6"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><UserRound className="text-orange-500" /><div><h2 className="font-bold text-slate-900">Personal information</h2><p className="text-xs text-slate-500">These details appear in the admin header.</p></div></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Name<input name="name" value={profile.name} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label><label className="text-sm font-bold text-slate-700">Email<input name="email" type="email" value={profile.email} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><KeyRound className="text-orange-500" /><div><h2 className="font-bold text-slate-900">Change password</h2><p className="text-xs text-slate-500">Leave both fields blank to keep your current password.</p></div></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Current password<input name="currentPassword" type="password" value={passwords.currentPassword} onChange={updatePassword} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label><label className="text-sm font-bold text-slate-700">New password<input name="newPassword" type="password" minLength="6" value={passwords.newPassword} onChange={updatePassword} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label></div></section>
      <div className="flex flex-wrap justify-between gap-3"><button type="button" onClick={deactivate} className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50">Deactivate account</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"><Save size={16} />{saving ? "Saving..." : "Save profile"}</button></div>
    </form><div className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} className="text-emerald-600" /> Role: {profile.role}</div></div>;
};

export default AdminProfilePage;