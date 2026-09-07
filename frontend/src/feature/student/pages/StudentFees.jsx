import React from "react";
import { useStudentData } from "../context/StudentDataContext";

const StudentFees = () => {
  const { fees, loading, error } = useStudentData();
  const fee = fees[0];
  if (loading) return <p className="text-sm text-slate-500">Loading fee details...</p>;
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;
  const currency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold">
          My Fees
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Review your fee details and payments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <FeeCard
          title="Total Fees"
          amount={currency(fee?.totalAmount)}
        />

        <FeeCard
          title="Paid"
          amount={currency(fee?.totalPaid)}
        />

        <FeeCard
          title="Pending"
          amount={currency(fee?.totalPending)}
        />

      </div>

    </div>
  );
};

const FeeCard = ({
  title,
  amount,
}) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200">

    <p className="text-xs text-slate-500">
      {title}
    </p>

    <p className="text-2xl font-extrabold mt-2">
      {amount}
    </p>

  </div>
);

export default StudentFees;