import { useEffect, useState } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { Link } from "react-router-dom";

export const FranchiseBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [studentId, setStudentId] = useState("");

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError("");

      // The backend scopes this request using coachingId from the JWT.
      const data = await apiFetch("/api/batches/franchise/batches");

      setBatches(data.batches || []);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
    apiFetch("/api/students?limit=100")
      .then((response) => setStudents(response.data || []))
      .catch(() => {});
  }, []);

  const addStudent = async (event) => {
    event.preventDefault();
    try {
      await apiFetch(`/api/batches/${selectedBatch._id}/students`, {
        method: "POST",
        body: JSON.stringify({ studentId }),
      });
      setSelectedBatch(null);
      setStudentId("");
      fetchBatches();
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  const removeBatch = async (batch) => {
    if (!window.confirm(`Delete ${batch.name}?`)) return;
    try {
      await apiFetch(`/api/batches/${batch._id}`, { method: "DELETE" });
      await fetchBatches();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches</h1>

          <p className="text-gray-500 mt-1">
            Manage batches assigned to your franchise
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/franchise/batches/add"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Create batch
          </Link>
          <button
            onClick={fetchBatches}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-gray-500">Loading batches...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && batches.length === 0 && (
        <div className="bg-white rounded-xl border p-10 text-center">
          <div className="text-5xl mb-4">📚</div>

          <h2 className="text-lg font-semibold text-gray-800">
            No batches found
          </h2>

          <p className="text-gray-500 mt-2">
            There are no batches available for this franchise.
          </p>
        </div>
      )}

      {/* Batches Table */}
      {!loading && !error && batches.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Batch
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Course
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Teacher
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Students
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {batches.map((batch) => (
                  <tr key={batch._id || batch.id} className="hover:bg-gray-50">
                    {/* Batch */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {batch.name || batch.batchName || "Unnamed Batch"}
                      </div>

                      {batch.code && (
                        <div className="text-sm text-gray-500">
                          {batch.code}
                        </div>
                      )}
                    </td>

                    {/* Course */}
                    <td className="px-6 py-4 text-gray-700">
                      {batch.course?.name ||
                        batch.course?.title ||
                        batch.courseName ||
                        "-"}
                    </td>

                    {/* Teacher */}
                    <td className="px-6 py-4 text-gray-700">
                      {batch.teacher?.name || batch.teacherName || "-"}
                    </td>

                    {/* Students */}
                    <td className="px-6 py-4 text-gray-700">
                      {batch.studentCount ?? batch.students?.length ?? 0}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          batch.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : batch.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : batch.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {batch.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/franchise/batches/${batch._id}`}
                          title="View batch"
                          aria-label="View batch"
                          className="rounded-lg bg-slate-100 p-2 text-slate-600"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/franchise/batches/${batch._id}/edit`}
                          title="Edit batch"
                          aria-label="Edit batch"
                          className="rounded-lg bg-blue-50 p-2 text-blue-600"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => setSelectedBatch(batch)}
                          className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700"
                        >
                          Add student
                        </button>
                        <button
                          onClick={() => removeBatch(batch)}
                          title="Delete batch"
                          aria-label="Delete batch"
                          className="rounded-lg bg-red-50 p-2 text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form
            onSubmit={addStudent}
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Add student to {selectedBatch.name}
              </h2>
              <button type="button" onClick={() => setSelectedBatch(null)}>
                ✕
              </button>
            </div>
            <select
              required
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-3"
            >
              <option value="">Select student</option>
              {students
                .filter(
                  (student) =>
                    !selectedBatch.students?.some(
                      (assigned) =>
                        String(assigned?._id || assigned) ===
                        String(student._id),
                    ),
                )
                .map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.studentId || student.email})
                  </option>
                ))}
            </select>
            <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white">
              Add student
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
