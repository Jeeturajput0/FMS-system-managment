import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";
import { useStudentData } from "../context/StudentDataContext";

const StudentCourseDetail = () => {
	const { id } = useParams();
	const { courses, dashboard } = useStudentData();
	const [modules, setModules] = useState([]);
	const [state, setState] = useState({ loading: true, error: "" });
	const course = courses.find((item) => item._id === id);
	const student = dashboard?.recent?.[0];

	useEffect(() => {
		let cancelled = false;
		apiFetch(`/api/modules/course/${id}`)
			.then((response) => {
				if (!cancelled) {
					setModules(response.data || []);
					setState({ loading: false, error: "" });
				}
			})
			.catch((error) => !cancelled && setState({ loading: false, error: error.message }));
		return () => { cancelled = true; };
	}, [id]);

	if (state.loading) return <p className="text-sm text-slate-500">Loading course modules...</p>;
	if (state.error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{state.error}</p>;

	return (
		<section className="space-y-6">
			<div className="rounded-3xl bg-slate-900 p-6 text-white">
				<p className="text-xs font-bold uppercase tracking-wider text-orange-300">Assigned course</p>
				<h1 className="mt-2 text-2xl font-black">{course?.title || student?.courseId?.title || "My Course"}</h1>
				<p className="mt-2 max-w-2xl text-sm text-slate-300">{course?.description || "Open a module to view its topics."}</p>
				<p className="mt-4 text-xs font-semibold text-orange-200">Batch: {student?.batchId?.name || student?.batchId?.code || "Not assigned"}</p>
			</div>

			<div>
				<h2 className="text-xl font-black text-slate-900">Course Modules</h2>
				<p className="mt-1 text-sm text-slate-500">Select a module to see its topics.</p>
			</div>

			<div className="space-y-3">
				{modules.map((module, index) => (
					<Link key={module._id} to={`/student/courses/${id}/modules/${module._id}/topics`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm">
						<div className="flex items-center gap-4">
							<span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100 font-black text-orange-700">{module.order || index + 1}</span>
							<div><h3 className="font-bold text-slate-900">{module.title}</h3><p className="mt-1 text-xs text-slate-500">{module.topics?.length || 0} topics</p></div>
						</div>
						<span className="text-sm font-bold text-orange-600">View topics</span>
					</Link>
				))}
				{!modules.length && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No modules have been published for this course yet.</p>}
			</div>
		</section>
	);
};

export default StudentCourseDetail;
