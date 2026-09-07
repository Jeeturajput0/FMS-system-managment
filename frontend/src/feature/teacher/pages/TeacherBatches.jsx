import { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";

const TeacherBatches = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { apiFetch("/api/portal/teacher-batches").then((response) => setBatches(response.data || [])).catch((requestError) => setError(requestError.message)); }, []);
  return <div className="space-y-6"><div><h1 className="text-3xl font-black text-slate-900">My Batches</h1><p className="mt-2 text-sm text-slate-500">Only batches assigned to you are shown.</p></div>{error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<div className="grid gap-4 md:grid-cols-2">{batches.map((batch) => <div key={batch._id} className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-black">{batch.name}</h2><p className="mt-1 text-sm text-slate-500">{batch.code} · {batch.course?.title || batch.course?.name || "Course"}</p><p className="mt-4 text-sm text-slate-600">{batch.students?.length || 0} students</p><p className="mt-1 text-xs text-slate-500">{batch.days?.join(", ") || "Schedule not set"} · {batch.room || "Room not set"}</p></div>)}{!batches.length && !error && <p className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">No batches assigned yet.</p>}</div></div>;
};
export default TeacherBatches;
