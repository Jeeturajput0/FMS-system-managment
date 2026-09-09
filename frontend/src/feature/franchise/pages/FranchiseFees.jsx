import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { apiFetch } from "../../../utils/api";

const FranchiseFees = () => {
  const [fees, setFees] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiFetch("/api/portal/fees")
      .then((response) => setFees(response.data || []))
      .catch((requestError) => setError(requestError.message));
  }, []);

  const filteredFees = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return fees;
    return fees.filter((fee) => [
      fee.studentId?.name, fee.studentId?.studentId, fee.studentId?.mobile,
      fee.studentId?.email, fee.courseId?.title, fee.status,
    ].some((value) => String(value || "").toLowerCase().includes(query)));
  }, [fees, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Fees</h1>
        <p className="mt-2 text-sm text-slate-500">
          Student fee records and payment status.
        </p>
      </div>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <label className="relative block">
        <Search className="absolute left-3 top-3 text-slate-400" size={17} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, ID, mobile or course..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500" />
      </label>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4">Student</th>
              <th className="px-5 py-4">Total fee</th>
              <th className="px-5 py-4">Paid</th>
              <th className="px-5 py-4">Pending</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredFees.map((fee) => (
              <tr key={fee._id}>
                <td className="px-5 py-4 font-semibold">
                  {fee.studentId?.name || "Student"}
                </td>
                <td className="px-5 py-4">
                  ₹{Number(fee.totalAmount || 0).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-4 text-emerald-600">
                  ₹{Number(fee.totalPaid || 0).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-4 text-amber-600">
                  ₹{Number(fee.totalPending || 0).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-4">{fee.status || "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filteredFees.length && !error && (
          <p className="p-8 text-center text-sm text-slate-500">
            No fee records found.
          </p>
        )}
      </div>
    </div>
  );
};

export default FranchiseFees;
