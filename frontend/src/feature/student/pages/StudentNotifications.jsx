import React from "react";

const StudentNotifications = () => <section className="space-y-6"><div><h1 className="text-2xl font-black text-slate-900">Notifications</h1><p className="mt-1 text-sm text-slate-500">Stay updated with your learning activity.</p></div><div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">{[["New assignment available", "React Todo Application is ready to submit."], ["Fee reminder", "Your pending fee balance is ₹12,000."]].map(([title, text]) => <div key={title} className="p-5"><p className="font-bold text-slate-900">{title}</p><p className="mt-1 text-sm text-slate-500">{text}</p></div>)}</div></section>;

export default StudentNotifications;
