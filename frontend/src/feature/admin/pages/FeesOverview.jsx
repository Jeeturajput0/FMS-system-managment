import React from 'react';
import { ArrowUpRight, CreditCard, IndianRupee, TrendingUp } from 'lucide-react';
import { useData } from '../../../context/DataContext';

export const FeesOverview = () => {
  const { students, payments, fees } = useData();

  const totalCollected = payments.reduce((sum, item) => sum + Number(String(item.amount).replace(/[^0-9]/g, '')) || 0, 0);
  const pending = students.reduce((sum, student) => {
    const pendingValue = Number(String(student.feesPending || '₹0').replace(/[^0-9]/g, '')) || 0;
    return sum + pendingValue;
  }, 0);

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
              {payments.slice(0, 6).map((payment) => (
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
              <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Paid</th><th className="px-4 py-3">Pending</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fees.map((fee) => <tr key={fee._id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{fee.studentId?.name}</td>
                <td className="px-4 py-3 text-slate-700">{fee.courseId?.title}</td>
                <td className="px-4 py-3">₹{fee.totalAmount?.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 font-bold text-emerald-700">₹{fee.totalPaid?.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 font-bold text-amber-700">₹{fee.totalPending?.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 font-bold">{fee.status}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
