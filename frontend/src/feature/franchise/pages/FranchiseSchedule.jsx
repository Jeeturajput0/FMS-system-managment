import { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";

const FranchiseSchedule = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { apiFetch("/api/batches/franchise/batches?limit=100").then((response) => setBatches(response.batches || [])).catch((requestError) => setError(requestError.message)); }, []);
  return <div className="space-y-6"><div><h1 className="text-3xl font-black text-slate-900">Schedule</h1><p className="mt-2 text-sm text-slate-500">Weekly timetable for your franchise batches.</p></div>{error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{batches.map((batch) => <div key={batch._id} className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-900">{batch.name}</h2><p className="mt-1 text-sm text-slate-500">{batch.course?.title || batch.course?.name || "Course not assigned"}</p><p className="mt-4 text-sm font-semibold text-blue-700">{batch.days?.join(", ") || "Days not set"}</p><p className="mt-1 text-sm text-slate-600">{batch.startTime || "--:--"} - {batch.endTime || "--:--"}</p><p className="mt-1 text-sm text-slate-500">Room: {batch.room || "Not assigned"}</p></div>)}{!batches.length && !error && <p className="text-sm text-slate-500">No scheduled batches.</p>}</div></div>;
};
export default FranchiseSchedule;
