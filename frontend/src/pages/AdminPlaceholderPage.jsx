import React from 'react';

export const AdminPlaceholderPage = ({ title = 'Section' }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-2xl font-black text-white">
        {title.slice(0, 1)}
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">This admin section is ready for the next module and remains connected to the dashboard shell.</p>
    </div>
  );
};
