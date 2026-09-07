import { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";

const TeacherAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    apiFetch("/api/portal/teacher-batches")
      .then((response) => setBatches(response.data || []))
      .catch((error) => setMessage(error.message));
  }, []);
  const load = async () => {
    if (!batchId) return;
    try {
      const response = await apiFetch(
        `/api/portal/attendance?batchId=${batchId}&date=${date}`,
      );
      const saved = new Map(
        (response.data.attendance?.records || []).map((item) => [
          String(item.studentId),
          item.status,
        ]),
      );
      setRecords(
        (response.data.batch.students || []).map((student) => ({
          studentId: student._id,
          name: student.name,
          status: saved.get(String(student._id)) || "PRESENT",
        })),
      );
    } catch (error) {
      setMessage(error.message);
    }
  };
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
          Mark attendance for your own batches.
        </p>
      </div>
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3">
        <select
          value={batchId}
          onChange={(event) => setBatchId(event.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="">Select batch</option>
          {batches.map((batch) => (
            <option key={batch._id} value={batch._id}>
              {batch.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-xl border p-3"
        />
        <button
          onClick={load}
          className="rounded-xl bg-blue-600 p-3 font-bold text-white"
        >
          Load students
        </button>
      </div>
      {message && (
        <p className="rounded-xl bg-slate-100 p-4 text-sm">{message}</p>
      )}
      {records.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((record, index) => (
                <tr key={record.studentId}>
                  <td className="p-4 font-semibold">{record.name}</td>
                  <td className="p-4">
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
                      className="rounded-lg border p-2"
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
            className="m-4 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white"
          >
            Save attendance
          </button>
        </div>
      )}
    </div>
  );
};
export default TeacherAttendance;
