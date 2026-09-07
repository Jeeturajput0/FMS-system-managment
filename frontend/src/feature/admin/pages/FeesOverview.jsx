import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CreditCard, Eye, IndianRupee, TrendingUp, X } from 'lucide-react';
import { useData } from '../../../context/DataContext';

export const FeesOverview = () => {
  const { students, payments, fees, franchises } = useData();
  const [selectedFranchise, setSelectedFranchise] = useState('All');
  const [selectedFee, setSelectedFee] = useState(null);

  const visibleFees = useMemo(() => selectedFranchise === 'All'
    ? fees
    : fees.filter((fee) => fee.coachingId?._id === selectedFranchise), [fees, selectedFranchise]);
  const visiblePayments = selectedFranchise === 'All'
    ? payments
    : payments.filter((payment) => payment.coachingId?._id === selectedFranchise || payment.coachingId === selectedFranchise);

  const totalCollected = visiblePayments.reduce((sum, item) => sum + Number(String(item.amount).replace(/[^0-9]/g, '')) || 0, 0);
  const visibleStudents = selectedFranchise === 'All'
    ? students
    : students.filter((student) => student.coachingId?._id === selectedFranchise || student.coachingId === selectedFranchise);
  const pending = visibleFees.length
    ? visibleFees.reduce((sum, fee) => sum + Number(fee.totalPending || 0), 0)
    : visibleStudents.reduce((sum, student) => sum + (Number(String(student.feesPending || '₹0').replace(/[^0-9]/g, '')) || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Collected</span>
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600"><IndianRupee className="h-4 w-4" /></div>
          </div>
          <h3 className="mt-4 text-3xl font-extrabold text-slate-900">₹{(totalCollected / 1000).toFixed(1)}K</h3>
          <p className="mt-2 text-xs text-slate-600">This month</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending</span>
            <div className="rounded-xl bg-amber-100 p-2 text-amber-600"><CreditCard className="h-4 w-4" /></div>
          </div>
          <h3 className="mt-4 text-3xl font-extrabold text-slate-900">₹{(pending / 1000).toFixed(1)}K</h3>
          <p className="mt-2 text-xs text-slate-600">Follow-ups required</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recovery</span>
            <div className="rounded-xl bg-orange-100 p-2 text-orange-600"><TrendingUp className="h-4 w-4" /></div>
          </div>
          <h3 className="mt-4 text-3xl font-extrabold text-slate-900">93%</h3>
          <p className="mt-2 text-xs text-slate-600">Average collection rate</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Franchise Fee Tracking</h3>
          <p className="text-xs text-slate-500">See students, purchased courses and pending fees.</p>
        </div>
        <select value={selectedFranchise} onChange={(event) => setSelectedFranchise(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-orange-500">
          <option value="All">All Franchises</option>
          {franchises.map((franchise) => <option key={franchise.id} value={franchise.id}>{franchise.name}</option>)}
        </select>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">Recent Payment Receipts</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            <ArrowUpRight className="h-3 w-3" /> Growing
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase">
              <tr>
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visiblePayments.slice(0, 6).map((payment) => (
                <tr key={payment.receiptNo} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-orange-600">{payment.receiptNo}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{payment.studentName}</td>
                  <td className="px-4 py-3 text-slate-700">{payment.feeType}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{payment.amount}</td>
                  <td className="px-4 py-3 text-slate-600">{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-extrabold text-slate-900">Student Fee Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase">
              <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Franchise</th><th className="px-4 py-3">Course Purchased</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Paid</th><th className="px-4 py-3">Pending</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">View</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleFees.map((fee) => <tr key={fee._id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{fee.studentId?.name}</td>
                <td className="px-4 py-3 text-slate-700">{fee.coachingId?.name || '—'}</td>
                <td className="px-4 py-3 text-slate-700">{fee.courseId?.title}</td>
                <td className="px-4 py-3">₹{fee.totalAmount?.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 font-bold text-emerald-700">₹{fee.totalPaid?.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 font-bold text-amber-700">₹{fee.totalPending?.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 font-bold">{fee.status}</td>
                <td className="px-4 py-3 text-right"><button type="button" onClick={() => setSelectedFee(fee)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"><Eye className="h-3.5 w-3.5" /> View</button></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {selectedFee && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={() => setSelectedFee(null)}><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-500">Fee Details</p><h3 className="mt-1 text-xl font-extrabold text-slate-900">{selectedFee.studentId?.name || 'Student'}</h3></div><button type="button" onClick={() => setSelectedFee(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3 text-xs"><span className="text-slate-500">Franchise</span><b className="mt-1 block text-slate-900">{selectedFee.coachingId?.name || '—'}</b></div><div className="rounded-xl bg-slate-50 p-3 text-xs"><span className="text-slate-500">Course</span><b className="mt-1 block text-slate-900">{selectedFee.courseId?.title || '—'}</b></div><div className="rounded-xl bg-slate-50 p-3 text-xs"><span className="text-slate-500">Mobile</span><b className="mt-1 block text-slate-900">{selectedFee.studentId?.mobile || '—'}</b></div><div className="rounded-xl bg-slate-50 p-3 text-xs"><span className="text-slate-500">Email</span><b className="mt-1 block break-all text-slate-900">{selectedFee.studentId?.email || '—'}</b></div></div><div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs"><div><p className="text-slate-500">Total</p><b>₹{Number(selectedFee.totalAmount || 0).toLocaleString('en-IN')}</b></div><div><p className="text-slate-500">Paid</p><b className="text-emerald-700">₹{Number(selectedFee.totalPaid || 0).toLocaleString('en-IN')}</b></div><div><p className="text-slate-500">Pending</p><b className="text-amber-700">₹{Number(selectedFee.totalPending || 0).toLocaleString('en-IN')}</b></div></div></div></div>}
    </div>
  );
};
