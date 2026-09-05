import React from "react";

const StudentFees = () => {
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
          amount="₹50,000"
        />

        <FeeCard
          title="Paid"
          amount="₹38,000"
        />

        <FeeCard
          title="Pending"
          amount="₹12,000"
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