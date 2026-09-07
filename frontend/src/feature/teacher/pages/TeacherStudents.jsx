import { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { apiFetch("/api/portal/students").then((response) => setStudents(response.data || [])).catch((requestError) => setError(requestError.message)); }, []);
  return <div className="space-y-6"><div><h1 className="text-3xl font-black text-slate-900">My Students</h1><p className="mt-2 text-sm text-slate-500">Students enrolled in your assigned batches.</p></div>{error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Student</th><th className="p-4">Course</th><th className="p-4">Batch</th><th className="p-4">Attendance</th><th className="p-4">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{students.map((student) => <tr key={student._id}><td className="p-4 font-semibold">{student.name}</td><td className="p-4">{student.courseId?.title || "-"}</td><td className="p-4">{student.batchId?.name || "-"}</td><td className="p-4">{student.attendancePercentage || 0}%</td><td className="p-4 capitalize">{student.status || "active"}</td></tr>)}</tbody></table>{!students.length && !error && <p className="p-8 text-center text-sm text-slate-500">No students found.</p>}</div></div>;
};
export default TeacherStudents;
