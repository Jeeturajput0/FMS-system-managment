import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const StudentTopics = () => {
	const { courseId, moduleId } = useParams();
	const [topics, setTopics] = useState([]);
	const [state, setState] = useState({ loading: true, error: "" });

	useEffect(() => {
		let cancelled = false;
		apiFetch(`/api/topics?moduleId=${moduleId}`)
			.then((response) => !cancelled && (setTopics(response.data || []), setState({ loading: false, error: "" })))
			.catch((error) => !cancelled && setState({ loading: false, error: error.message }));
		return () => { cancelled = true; };
	}, [moduleId]);

	if (state.loading) return <p className="text-sm text-slate-500">Loading topics...</p>;
	if (state.error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{state.error}</p>;

	return <section className="space-y-6"><div><Link to={`/student/courses/${courseId}`} className="text-sm font-bold text-orange-600">Back to modules</Link><h1 className="mt-3 text-2xl font-black text-slate-900">Module Topics</h1><p className="mt-1 text-sm text-slate-500">Study the topics assigned in this module.</p></div><div className="grid gap-3 sm:grid-cols-2">{topics.map((topic) => <article key={topic._id} className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-900">{topic.title}</h2><p className="mt-2 text-xs text-slate-500">{topic.type} · {topic.duration?.value || 0} {topic.duration?.unit || "minutes"}</p>{topic.description && <p className="mt-3 text-sm text-slate-600">{topic.description}</p>}</article>)}{!topics.length && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No topics have been added to this module yet.</p>}</div></section>;
};

export default StudentTopics;
