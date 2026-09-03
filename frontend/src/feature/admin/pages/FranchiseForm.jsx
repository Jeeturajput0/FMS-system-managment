import React, { useEffect, useState } from "react";
import { ArrowLeft, Building2, Loader2, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import { apiFetch } from "../../../utils/api";

const emptyForm = {
  name: "", code: "", ownerName: "", email: "", phone: "", address: "",
  city: "", state: "", pincode: "", status: "pending",
};

export default function FranchiseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createFranchise, updateFranchise } = useData();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const loadFranchise = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/api/coaching/${id}`);
        const franchise = response.coaching;
        setForm({
          name: franchise.name || "", code: franchise.code || "", ownerName: franchise.ownerName || "",
          email: franchise.email || "", phone: franchise.phone || "", address: franchise.address || "",
          city: franchise.city || "", state: franchise.state || "", pincode: franchise.pincode || "",
          status: franchise.status || "pending",
        });
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };
    loadFranchise();
  }, [id]);

  const change = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      setSaving(true);
      const franchise = isEdit
        ? await updateFranchise(id, form)
        : await createFranchise(form);
      navigate(`/admin/franchises/${franchise.id}`);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex min-h-[400px] items-center justify-center gap-2 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /> Loading franchise...</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <button type="button" onClick={() => navigate('/admin/franchises')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-500"><ArrowLeft className="h-4 w-4" /> Back to Franchises</button>
      <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">Franchise Network</p><h1 className="mt-2 text-2xl font-extrabold text-slate-900">{isEdit ? 'Edit Franchise' : 'Add New Franchise'}</h1><p className="mt-1 text-sm text-slate-500">{isEdit ? 'Update the franchise center information.' : 'Register a new authorized learning center.'}</p></div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}
      <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 p-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Building2 className="h-5 w-5" /></div><div><h2 className="font-bold text-slate-900">Franchise Information</h2><p className="text-xs text-slate-500">All required contact and center details.</p></div></div>
        <div className="grid gap-5 p-6 md:grid-cols-2">
          <Field label="Franchise Name *" name="name" value={form.name} onChange={change} required />
          <Field label="Center Code" name="code" value={form.code} onChange={change} placeholder="AIS-AGR" />
          <Field label="Owner Name *" name="ownerName" value={form.ownerName} onChange={change} required />
          <Field label="Email *" name="email" value={form.email} onChange={change} type="email" required />
          <Field label="Phone *" name="phone" value={form.phone} onChange={change} required />
          <Field label="City *" name="city" value={form.city} onChange={change} required />
          <Field label="State" name="state" value={form.state} onChange={change} />
          <Field label="Pincode" name="pincode" value={form.pincode} onChange={change} />
          <label className="md:col-span-2"><span className="mb-2 block text-sm font-bold text-slate-700">Full Address</span><textarea name="address" value={form.address} onChange={change} rows="3" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>
          <label><span className="mb-2 block text-sm font-bold text-slate-700">Status</span><select name="status" value={form.status} onChange={change} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"><option value="pending">Pending</option><option value="active">Active</option><option value="suspended">Suspended</option><option value="inactive">Inactive</option></select></label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 p-5"><button type="button" onClick={() => navigate('/admin/franchises')} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Franchise'}</button></div>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  return <label><span className="mb-2 block text-sm font-bold text-slate-700">{label}</span><input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>;
}
