import React, { useState } from "react";

const StudentSettings = () => {
  const [saved, setSaved] = useState(false);
  return <section className="mx-auto max-w-3xl space-y-6"><div><h1 className="text-2xl font-black text-slate-900">Settings</h1><p className="mt-1 text-sm text-slate-500">Manage your portal preferences.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><label className="flex items-center justify-between gap-4 text-sm font-bold text-slate-700"><span>Email notifications</span><input type="checkbox" defaultChecked className="h-5 w-5 accent-blue-600" /></label><label className="mt-5 flex items-center justify-between gap-4 text-sm font-bold text-slate-700"><span>Assignment reminders</span><input type="checkbox" defaultChecked className="h-5 w-5 accent-blue-600" /></label><button onClick={() => setSaved(true)} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Save settings</button>{saved && <p className="mt-3 text-sm font-semibold text-emerald-600">Settings saved.</p>}</div></section>;
};

export default StudentSettings;
