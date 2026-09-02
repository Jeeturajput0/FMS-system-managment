import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Save } from 'lucide-react';
import { apiFetch, apiUpload } from '../utils/api';

const emptyForm = { title: '', description: '', category: 'AI & Software Engineering', level: 'Beginner', duration: 4, durationUnit: 'months', courseFee: 30000, registrationFee: 1000, certificateFee: 3000, thumbnail: null };

export const CourseAdd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    apiFetch(`/api/courses/${id}`).then(({ data }) => setForm({ ...emptyForm, ...data, duration: data.duration?.value || 4, durationUnit: data.duration?.unit || 'months', thumbnail: null })).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body = new FormData();
      body.append('title', form.title);
      body.append('description', form.description);
      body.append('shortDescription', form.description.slice(0, 300));
      body.append('category', form.category);
      body.append('level', form.level);
      body.append('duration', JSON.stringify({ value: Number(form.duration), unit: form.durationUnit }));
      body.append('courseFee', String(form.courseFee));
      body.append('registrationFee', String(form.registrationFee));
      body.append('certificateFee', String(form.certificateFee));
      if (form.thumbnail) body.append('thumbnail', form.thumbnail);
      await apiUpload(id ? `/api/courses/${id}` : '/api/courses', body, id ? 'PUT' : 'POST');
      navigate('/admin/courses');
    } catch (err) {
      setError(err.message || 'Unable to save course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Loading course...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <Link to="/admin/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600"><ArrowLeft className="h-4 w-4" /> Back to courses</Link>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-5"><div className="rounded-2xl bg-orange-100 p-3 text-orange-600"><BookOpen /></div><div><h1 className="text-2xl font-extrabold text-slate-900">{id ? 'Edit Course' : 'Add New Course'}</h1><p className="text-sm text-slate-500">Course details are stored directly in MongoDB.</p></div></div>
        {error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-semibold text-slate-700">Course title<input required value={form.title} onChange={(e) => update('title', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-orange-500" /></label>
          <label className="sm:col-span-2 text-sm font-semibold text-slate-700">Description<textarea required rows="5" value={form.description} onChange={(e) => update('description', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-orange-500" /></label>
          <label className="text-sm font-semibold text-slate-700">Category<input value={form.category} onChange={(e) => update('category', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-orange-500" /></label>
          <label className="text-sm font-semibold text-slate-700">Level<select value={form.level} onChange={(e) => update('level', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-orange-500"><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>All Levels</option></select></label>
          <label className="text-sm font-semibold text-slate-700">Duration<input type="number" min="1" required value={form.duration} onChange={(e) => update('duration', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-orange-500" /></label>
          <label className="text-sm font-semibold text-slate-700">Duration unit<select value={form.durationUnit} onChange={(e) => update('durationUnit', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-orange-500"><option>days</option><option>weeks</option><option>months</option><option>years</option></select></label>
          <label className="text-sm font-semibold text-slate-700">Course fee<input type="number" min="0" required value={form.courseFee} onChange={(e) => update('courseFee', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-orange-500" /></label>
          <label className="text-sm font-semibold text-slate-700">Registration fee<input type="number" min="0" value={form.registrationFee} onChange={(e) => update('registrationFee', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-orange-500" /></label>
          <label className="text-sm font-semibold text-slate-700">Certificate fee<input type="number" min="0" value={form.certificateFee} onChange={(e) => update('certificateFee', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-orange-500" /></label>
          <label className="sm:col-span-2 text-sm font-semibold text-slate-700">Course thumbnail<input type="file" accept="image/*" onChange={(e) => update('thumbnail', e.target.files?.[0] || null)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal" /></label>
          <button disabled={saving} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving...' : id ? 'Update Course' : 'Save Course'}</button>
        </form>
      </div>
    </div>
  );
};
