import React, { useEffect, useState } from "react";
import { Edit, Eye, Loader2, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const courseName = (course) => course?.title || course?.name || "Not assigned";

export const FranchiseStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiFetch("/api/students?limit=1000");
      setStudents(response.data || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  const removeStudent = async (student) => {
    if (!window.confirm(`Deactivate ${student.name}?`)) return;
    try {
      await apiFetch(`/api/students/${student._id}`, { method: "DELETE" });
      await loadStudents();
    } catch (requestError) {
      setError(requestError.message || "Unable to deactivate student");
    }
  };

  const filteredStudents = students.filter((student) => {
    const value = search.trim().toLowerCase();
    return !value || [student.name, student.email, student.mobile, student.studentId]
      .some((field) => String(field || "").toLowerCase().includes(value));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-3xl font-black text-slate-900">Students</h1><p className="mt-2 text-sm text-slate-500">Only students enrolled at your franchise are shown.</p></div>
        <Link to="/franchise/students/add" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"><Plus size={17} /> Add Student</Link>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, email or student ID" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500" />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Student</th><th className="p-4">Phone</th><th className="p-4">Email</th><th className="p-4">Course</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan="6" className="p-10 text-center"><Loader2 className="mx-auto animate-spin text-blue-600" /></td></tr> : filteredStudents.length === 0 ? <tr><td colSpan="6" className="p-10 text-center text-slate-500">No students found.</td></tr> : filteredStudents.map((student) => <tr key={student._id} className="border-t border-slate-100 hover:bg-slate-50">
          <td className="p-4"><p className="font-bold text-slate-900">{student.name}</p><p className="text-xs text-slate-500">{student.studentId || student._id}</p></td><td className="p-4">{student.mobile}</td><td className="p-4">{student.email || "-"}</td><td className="p-4">{courseName(student.courseId)}</td><td className="p-4"><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">{student.status}</span></td>
          <td className="p-4"><div className="flex justify-end gap-2"><Link title="View" to={`/franchise/students/${student._id}`} className="rounded-lg bg-slate-100 p-2 text-slate-600"><Eye size={15} /></Link><Link title="Edit" to={`/franchise/students/${student._id}/edit`} className="rounded-lg bg-blue-50 p-2 text-blue-600"><Edit size={15} /></Link><button title="Deactivate" onClick={() => removeStudent(student)} className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 size={15} /></button></div></td>
        </tr>)}</tbody>
      </table></div></div>
    </div>
  );
};
