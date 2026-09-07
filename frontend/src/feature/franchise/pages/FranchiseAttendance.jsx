import { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";

const today = new Date().toISOString().slice(0, 10);

const FranchiseAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiFetch("/api/batches/franchise/batches")
      .then((response) => setBatches(response.batches || []))
      .catch((error) => setMessage(error.message));
  }, []);
  useEffect(() => {
    if (!batchId) {
      setRecords([]);
      return;
    }
    apiFetch(`/api/portal/attendance?batchId=${batchId}&date=${date}`)
      .then((response) => {
        const students = response.data.batch.students || [];
        const saved = new Map(
          (response.data.attendance?.records || []).map((record) => [
            String(record.studentId),
            record.status,
          ]),
        );
        setRecords(
          students.map((student) => ({
            studentId: student._id,
            name: student.name,
            status: saved.get(String(student._id)) || "PRESENT",
          })),
        );
      })
      .catch((error) => setMessage(error.message));
  }, [batchId, date]);

  const save = async () => {
    try {
      const response = await apiFetch("/api/portal/attendance", {
        method: "PUT",
        body: JSON.stringify({
          batchId,
          date,
          records: records.map(({ studentId, status }) => ({
            studentId,
            status,
          })),
        }),
      });
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Attendance</h1>
        <p className="mt-2 text-sm text-slate-500">
          Record present, absent, or late attendance by batch.
        </p>
      </div>
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <select
          value={batchId}
          onChange={(event) => setBatchId(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-3"
        >
          <option value="">Select batch</option>
          {batches.map((batch) => (
            <option key={batch._id} value={batch._id}>
              {batch.name} ({batch.code})
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-3"
        />
      </div>
      {message && (
        <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
          {message}
        </p>
      )}
      {records.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((record, index) => (
                <tr key={record.studentId}>
                  <td className="px-5 py-4 font-semibold">{record.name}</td>
                  <td className="px-5 py-4">
                    <select
                      value={record.status}
                      onChange={(event) =>
                        setRecords(
                          records.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, status: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2"
                    >
                      <option>PRESENT</option>
                      <option>ABSENT</option>
                      <option>LATE</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={save}
            className="m-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
          >
            Save attendance
          </button>
        </div>
      )}
      {batchId && !records.length && (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No students assigned to this batch.
        </p>
      )}
    </div>
  );
};

export default FranchiseAttendance;
