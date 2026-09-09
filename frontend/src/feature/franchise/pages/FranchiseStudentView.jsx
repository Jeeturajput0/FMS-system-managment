import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const FranchiseStudentView = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/api/students/${id}`)
      .then((response) => setStudent(response.student))
      .catch((requestError) => setError(requestError.message || "Unable to load student"));
  }, [id]);

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>;
  }

  if (!student) {
    return <div className="flex min-h-[350px] items-center justify-center gap-2 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /> Loading student...</div>;
  }

  const courseName = student.courseId?.title || student.courseId?.name || "Not assigned";
  const batchName = student.batchId?.name || "Not assigned";

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link to="/franchise/students" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"><ArrowLeft size={16} /> Back to students</Link>

      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">Student profile</p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><h1 className="text-2xl font-black">{student.name}</h1><p className="mt-1 font-mono text-sm text-blue-100">{student.studentId || "No student ID"}</p></div>
          <Link to={`/franchise/students/${student._id}/edit`} className="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-bold text-blue-700">Edit student</Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[["Mobile", student.mobile], ["Email", student.email || "-"], ["Course", courseName], ["Batch", batchName], ["Status", student.status || "registered"], ["Franchise", student.coachingId?.name || "-"], ["Father name", student.fatherName || "-"], ["Joining date", student.joiningDate ? new Date(student.joiningDate).toLocaleDateString() : "-"]].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-bold text-slate-900">{value}</p></div>
        ))}
      </div>
    </div>
  );
};

export default FranchiseStudentView;
