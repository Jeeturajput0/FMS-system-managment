import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, Mail, Phone, UserRound } from 'lucide-react';
import { useData } from '../context/DataContext';

export const StudentDetail = () => {
  const { id } = useParams();
  const { students } = useData();

  const student = students.find((item) => item.id === id) || students[0];

  if (!student) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        Student not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <Link
        to="/admin/students"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Student Directory
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={student.avatar} alt={student.name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-orange-200" />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-extrabold text-slate-900">{student.name}</h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">{student.status}</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">{student.id} • {student.batch}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-orange-50 px-4 py-3 text-right">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Fee Status</p>
            <p className="text-sm font-extrabold text-slate-900">{student.feesPaid} / {student.feesTotal}</p>
            <p className="text-[10px] font-bold text-orange-600">{student.feesStatus}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-600">Profile Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-500"><Mail className="h-4 w-4" /> Email</div>
              <p className="font-semibold text-slate-900">{student.email}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-500"><Phone className="h-4 w-4" /> Phone</div>
              <p className="font-semibold text-slate-900">{student.phone}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-500"><UserRound className="h-4 w-4" /> Course</div>
              <p className="font-semibold text-slate-900">{student.course}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-500"><BookOpen className="h-4 w-4" /> Franchise</div>
              <p className="font-semibold text-slate-900">{student.franchise}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-600">Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs text-slate-600"><span>Attendance</span><span>{student.attendance}</span></div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500" style={{ width: '92%' }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-slate-600"><span>Course Completion</span><span>84%</span></div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: '84%' }} />
              </div>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> On-track enrollment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
