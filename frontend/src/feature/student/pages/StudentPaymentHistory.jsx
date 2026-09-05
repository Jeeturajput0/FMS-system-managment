import React from "react";

const StudentPaymentHistory = () => <section className="space-y-6"><div><h1 className="text-2xl font-black text-slate-900">Payment History</h1><p className="mt-1 text-sm text-slate-500">Review your completed fee payments.</p></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Receipt</th><th className="p-4">Date</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr></thead><tbody><tr><td className="p-4 text-slate-500" colSpan="4">No payment records available.</td></tr></tbody></table></div></section>;

export default StudentPaymentHistory;
