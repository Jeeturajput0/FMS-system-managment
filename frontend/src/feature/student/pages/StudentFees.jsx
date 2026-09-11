import React from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock3,
  IndianRupee,
  ReceiptText,
  WalletCards,
} from "lucide-react";
import { useStudentData } from "../context/StudentDataContext";

const StudentFees = () => {
  const { fees, loading, error } = useStudentData();

  const fee = fees?.[0];

  const currency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="space-y-3">
        <div>
          <div className="h-7 w-36 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-1 h-3 w-56 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </section>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <section className="space-y-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            My Fees
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review your fee details and payments.
          </p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      </section>
    );
  }

  const total = Number(fee?.totalAmount || 0);
  const paid = Number(fee?.totalPaid || 0);
  const pending = Number(fee?.totalPending || 0);

  const paidPercentage =
    total > 0
      ? Math.min(100, Math.round((paid / total) * 100))
      : 0;

  const isFullyPaid = pending <= 0;

  return (
    <section className="mx-auto w-full max-w-6xl space-y-3">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 px-5 py-4 text-white shadow-md">

        <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-white/10" />

        <div className="absolute -bottom-16 right-20 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <WalletCards className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-black sm:text-2xl">
                My Fees
              </h1>

              <p className="text-xs font-medium text-orange-50 sm:text-sm">
                Review your fee details and payments.
              </p>
            </div>

          </div>

          <div
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black backdrop-blur-sm ${
              isFullyPaid
                ? "bg-emerald-400/20"
                : "bg-white/15"
            }`}
          >
            {isFullyPaid ? (
              <CheckCircle2 size={13} />
            ) : (
              <Clock3 size={13} />
            )}

            <span className="hidden sm:inline">
              {isFullyPaid ? "Fees Paid" : "Payment Pending"}
            </span>
          </div>

        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

        <FeeCard
          title="Total Fees"
          amount={currency(total)}
          icon={ReceiptText}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          description="Total course fees"
        />

        <FeeCard
          title="Paid Amount"
          amount={currency(paid)}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          description={`${paidPercentage}% fees paid`}
        />

        <FeeCard
          title="Pending Amount"
          amount={currency(pending)}
          icon={Clock3}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
          description={
            pending > 0
              ? "Amount remaining"
              : "No pending amount"
          }
        />

      </div>

      {/* =====================================================
          PAYMENT OVERVIEW
      ===================================================== */}

      <div className="grid gap-3 lg:grid-cols-3">

        {/* Payment Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">

          <div className="flex items-center justify-between gap-3">

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Payment Overview
              </p>

              <h2 className="mt-0.5 text-lg font-black text-slate-900">
                Fee Payment Progress
              </h2>

              <p className="text-xs text-slate-500">
                Track your fee payment.
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50">
              <CreditCard className="h-4 w-4 text-orange-500" />
            </div>

          </div>

          {/* Percentage */}
          <div className="mt-4 flex items-end justify-between gap-3">

            <div>
              <p className="text-3xl font-black text-slate-900">
                {paidPercentage}%
              </p>

              <p className="text-[10px] font-semibold text-slate-400">
                Paid so far
              </p>
            </div>

            <p className="text-right text-xs font-bold text-slate-500">
              {currency(paid)}{" "}
              <span className="font-medium text-slate-400">
                / {currency(total)}
              </span>
            </p>

          </div>

          {/* Progress */}
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
              style={{
                width: `${paidPercentage}%`,
              }}
            />

          </div>

          <div className="mt-2 flex justify-between text-[10px] font-bold">

            <span className="text-emerald-600">
              Paid: {currency(paid)}
            </span>

            <span className="text-orange-500">
              Pending: {currency(pending)}
            </span>

          </div>

        </div>

        {/* Payment Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Payment Status
            </p>

            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                isFullyPaid
                  ? "bg-emerald-50"
                  : "bg-orange-50"
              }`}
            >
              {isFullyPaid ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <Clock3 className="h-4 w-4 text-orange-500" />
              )}
            </div>

          </div>

          <h2 className="mt-3 text-lg font-black text-slate-900">
            {isFullyPaid ? "All Paid!" : "Payment Due"}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {isFullyPaid
              ? "Your complete course fee has been paid."
              : `You have ${currency(
                  pending
                )} remaining.`}
          </p>

          {/* Amount */}
          <div
            className={`mt-3 rounded-xl px-3 py-2.5 ${
              isFullyPaid
                ? "bg-emerald-50"
                : "bg-orange-50"
            }`}
          >
            <p className="text-[10px] font-bold text-slate-500">
              {isFullyPaid
                ? "Payment Complete"
                : "Amount Due"}
            </p>

            <p
              className={`mt-0.5 text-lg font-black ${
                isFullyPaid
                  ? "text-emerald-600"
                  : "text-orange-600"
              }`}
            >
              {currency(isFullyPaid ? paid : pending)}
            </p>
          </div>

        </div>
      </div>

      {/* =====================================================
          FEE BREAKDOWN
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex items-center gap-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
            <IndianRupee className="h-4 w-4 text-orange-500" />
          </div>

          <div>
            <h2 className="text-sm font-black text-slate-900">
              Fee Breakdown
            </h2>

            <p className="text-[10px] text-slate-500">
              Your current fee summary
            </p>
          </div>

        </div>

        <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">

          <BreakdownRow
            label="Total Course Fees"
            value={currency(total)}
            icon={ReceiptText}
          />

          <BreakdownRow
            label="Total Paid"
            value={currency(paid)}
            icon={CheckCircle2}
            valueClass="text-emerald-600"
          />

          <BreakdownRow
            label="Total Pending"
            value={currency(pending)}
            icon={Clock3}
            valueClass={
              pending > 0
                ? "text-orange-600"
                : "text-emerald-600"
            }
          />

        </div>

      </div>

    </section>
  );
};

/* =========================================================
   COMPACT FEE CARD
========================================================= */

const FeeCard = ({
  title,
  amount,
  icon: Icon,
  iconBg,
  iconColor,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>

        <span className="text-[10px] font-bold text-slate-400">
          Fees
        </span>

      </div>

      <p className="mt-3 text-[10px] font-black uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-0.5 break-words text-xl font-black text-slate-900 sm:text-2xl">
        {amount}
      </p>

      <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
        {description}
      </p>

    </div>
  );
};

/* =========================================================
   BREAKDOWN ROW
========================================================= */

const BreakdownRow = ({
  label,
  value,
  icon: Icon,
  valueClass = "text-slate-900",
}) => {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5">

      <div className="flex min-w-0 items-center gap-2">

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50">
          <Icon className="h-3.5 w-3.5 text-slate-500" />
        </div>

        <p className="truncate text-xs font-bold text-slate-700">
          {label}
        </p>

      </div>

      <p
        className={`shrink-0 text-xs font-black sm:text-sm ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
};

export default StudentFees;