
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  IndianRupee,
  Users,
  CheckCircle2,
  Clock3,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
  CreditCard,
  X,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const FranchiseFees = () => {
  const [fees, setFees] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD FEES
  // =====================================================

  const loadFees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/api/portal/fees");

      setFees(response?.data || []);
    } catch (requestError) {
      console.error("Fees loading error:", requestError);
      setError(requestError?.message || "Unable to load fee records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  const getStatus = (fee) => {
    const status = String(fee?.status || "").toLowerCase();

    if (
      status === "paid" ||
      status === "completed" ||
      Number(fee?.totalPending || 0) <= 0
    ) {
      return "Paid";
    }

    if (
      status === "partial" ||
      status === "partially paid" ||
      (Number(fee?.totalPaid || 0) > 0 &&
        Number(fee?.totalPending || 0) > 0)
    ) {
      return "Partial";
    }

    return "Pending";
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Paid":
        return {
          icon: CheckCircle2,
          wrapper:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
          dot: "bg-emerald-500",
        };

      case "Partial":
        return {
          icon: Clock3,
          wrapper:
            "border-amber-200 bg-amber-50 text-amber-700",
          dot: "bg-amber-500",
        };

      default:
        return {
          icon: AlertCircle,
          wrapper:
            "border-red-200 bg-red-50 text-red-700",
          dot: "bg-red-500",
        };
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredFees = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return fees;

    return fees.filter((fee) =>
      [
        fee?.studentId?.name,
        fee?.studentId?.studentId,
        fee?.studentId?.mobile,
        fee?.studentId?.email,
        fee?.courseId?.title,
        fee?.courseId?.name,
        fee?.status,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [fees, search]);

  // =====================================================
  // STATS
  // =====================================================

  const stats = useMemo(() => {
    let totalFee = 0;
    let totalPaid = 0;
    let totalPending = 0;

    let paidCount = 0;
    let partialCount = 0;
    let pendingCount = 0;

    fees.forEach((fee) => {
      totalFee += Number(fee?.totalAmount || 0);
      totalPaid += Number(fee?.totalPaid || 0);
      totalPending += Number(fee?.totalPending || 0);

      const status = getStatus(fee);

      if (status === "Paid") paidCount++;
      else if (status === "Partial") partialCount++;
      else pendingCount++;
    });

    return {
      totalFee,
      totalPaid,
      totalPending,
      paidCount,
      partialCount,
      pendingCount,
      totalRecords: fees.length,
    };
  }, [fees]);

  return (
    <div className="min-h-full space-y-5 bg-slate-50/40">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-100">
            <CreditCard size={21} />
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-blue-600">
              Finance Management
            </p>

            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Fees
            </h1>

            <p className="mt-0.5 text-xs text-slate-500">
              Track student payments, collections and pending fees.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadFees}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-red-100 text-red-600">
              <AlertCircle size={15} />
            </div>

            <p className="text-xs font-semibold text-red-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      {!loading && (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
          {/* Total Fee */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Total Fee
                </p>

                <p className="mt-2 text-xl font-black text-slate-900">
                  ₹{formatAmount(stats.totalFee)}
                </p>

                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  {stats.totalRecords} fee records
                </p>
              </div>

              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <IndianRupee size={17} />
              </div>
            </div>
          </div>

          {/* Collected */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Collected
                </p>

                <p className="mt-2 text-xl font-black text-emerald-600">
                  ₹{formatAmount(stats.totalPaid)}
                </p>

                <p className="mt-1 text-[10px] font-medium text-emerald-500">
                  {stats.paidCount} fully paid
                </p>
              </div>

              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={17} />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Pending
                </p>

                <p className="mt-2 text-xl font-black text-amber-600">
                  ₹{formatAmount(stats.totalPending)}
                </p>

                <p className="mt-1 text-[10px] font-medium text-amber-500">
                  {stats.partialCount + stats.pendingCount} outstanding
                </p>
              </div>

              <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 size={17} />
              </div>
            </div>
          </div>

          {/* Paid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Paid Records
                </p>

                <p className="mt-2 text-xl font-black text-slate-900">
                  {stats.paidCount}
                </p>

                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  Completed payments
                </p>
              </div>

              <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-50 text-purple-600">
                <Users size={17} />
              </div>
            </div>
          </div>

          {/* Pending Records */}
          <div className="col-span-2 rounded-2xl border border-red-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md xl:col-span-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Pending Records
                </p>

                <p className="mt-2 text-xl font-black text-red-600">
                  {stats.pendingCount + stats.partialCount}
                </p>

                <p className="mt-1 text-[10px] font-medium text-red-400">
                  Need follow-up
                </p>
              </div>

              <div className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600">
                <AlertCircle size={17} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">
              Fee Records
            </h2>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Search and review student payment information.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, ID, mobile or course..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {!loading && (
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <p className="text-[10px] font-medium text-slate-400">
              Showing{" "}
              <span className="font-black text-slate-700">
                {filteredFees.length}
              </span>{" "}
              of{" "}
              <span className="font-black text-slate-700">
                {fees.length}
              </span>{" "}
              records
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <RefreshCw size={21} className="animate-spin" />
          </div>

          <p className="mt-3 text-sm font-bold text-slate-700">
            Loading fee records...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please wait while we fetch the latest payments.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr>
                  <th className="px-5 py-3.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Student
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Course
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Total Fee
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Paid
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Pending
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredFees.map((fee) => {
                  const status = getStatus(fee);
                  const statusConfig = getStatusConfig(status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr
                      key={fee._id}
                      className="group transition hover:bg-blue-50/30"
                    >
                      {/* Student */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-black text-white shadow-sm">
                            {fee?.studentId?.name
                              ?.trim()
                              ?.charAt(0)
                              ?.toUpperCase() || "S"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-black text-slate-800">
                              {fee?.studentId?.name || "Student"}
                            </p>

                            <p className="mt-1 text-[10px] font-semibold text-blue-600">
                              {fee?.studentId?.studentId || "No Student ID"}
                            </p>

                            <div className="mt-1 flex items-center gap-2 text-[9px] text-slate-400">
                              {fee?.studentId?.mobile && (
                                <span className="flex items-center gap-1">
                                  <Phone size={9} />
                                  {fee.studentId.mobile}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="px-5 py-4">
                        <div className="max-w-[180px]">
                          <p className="truncate text-xs font-bold text-slate-700">
                            {fee?.courseId?.title ||
                              fee?.courseId?.name ||
                              "Course"}
                          </p>

                          <p className="mt-1 text-[9px] text-slate-400">
                            Course fee record
                          </p>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4">
                        <p className="text-xs font-black text-slate-800">
                          ₹{formatAmount(fee?.totalAmount)}
                        </p>
                      </td>

                      {/* Paid */}
                      <td className="px-5 py-4">
                        <p className="text-xs font-black text-emerald-600">
                          ₹{formatAmount(fee?.totalPaid)}
                        </p>
                      </td>

                      {/* Pending */}
                      <td className="px-5 py-4">
                        <p
                          className={`text-xs font-black ${
                            Number(fee?.totalPending || 0) > 0
                              ? "text-amber-600"
                              : "text-slate-400"
                          }`}
                        >
                          ₹{formatAmount(fee?.totalPending)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-black ${statusConfig.wrapper}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}
                          />

                          <StatusIcon size={11} />

                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty */}
          {!filteredFees.length && (
            <div className="border-t border-slate-100 p-12 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <Search size={22} />
              </div>

              <h3 className="mt-4 text-sm font-black text-slate-800">
                No fee records found
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
                {search
                  ? "No records match your search. Try another student name, ID, mobile number or course."
                  : "There are currently no fee records available for your franchise."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 rounded-lg bg-blue-50 px-4 py-2 text-[10px] font-black text-blue-600 transition hover:bg-blue-100"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          FOOTER SUMMARY
      ===================================================== */}

      {!loading && fees.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black text-slate-800">
              Payment Summary
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Total collection versus outstanding amount.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-black text-emerald-700">
              Collected ₹{formatAmount(stats.totalPaid)}
            </span>

            <span className="rounded-lg bg-amber-50 px-3 py-2 text-[10px] font-black text-amber-700">
              Pending ₹{formatAmount(stats.totalPending)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseFees;

