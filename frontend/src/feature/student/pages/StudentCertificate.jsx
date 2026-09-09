import React, { useEffect, useState } from "react";
import { Award, Download, Loader2, XCircle } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const StudentCertificate = () => {
	const { id } = useParams();
	const location = useLocation();
	const [data, setData] = useState(null);
	const [error, setError] = useState("");
	const isStudent = location.pathname.startsWith("/student/");

	useEffect(() => {
		apiFetch(isStudent ? "/api/certificates/me" : `/api/certificates/student/${id}`)
			.then((response) => setData(response.data))
			.catch((requestError) => setError(requestError.message || "Unable to load certificate"));
	}, [id, isStudent]);

	if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>;
	if (!data) return <div className="flex min-h-48 items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

	const { eligibility, certificate, student } = data;
	return (
		<section className="mx-auto max-w-4xl space-y-6">
			<div className="flex items-center gap-3"><Award className="text-orange-500" /><div><h1 className="text-2xl font-black text-slate-900">{certificate ? "Certificate Ready" : "Certificate"}</h1><p className="text-sm text-slate-500">{student?.courseId?.title || certificate?.courseTitle || "Course certificate"}</p></div></div>
			{certificate ? <div className="certificate-print rounded-3xl border-2 border-orange-200 bg-white p-6 shadow-sm sm:p-10"><div className="border border-orange-100 p-6 text-center sm:p-10"><Award className="mx-auto h-14 w-14 text-orange-500" /><p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">AI Scholars Certification</p><h2 className="mt-4 text-3xl font-black text-slate-900">Certificate of Completion</h2><p className="mt-8 text-sm text-slate-500">This is proudly presented to</p><p className="mt-2 text-3xl font-black text-slate-900">{student?.name || certificate.studentName}</p><p className="mx-auto mt-4 max-w-xl text-sm text-slate-600">for successfully completing <strong>{certificate.courseTitle}</strong>.</p><div className="mt-8 grid gap-4 text-left sm:grid-cols-3"><Metric label="Certificate No." value={certificate.certificateNumber} /><Metric label="Issue Date" value={new Date(certificate.issueDate).toLocaleDateString("en-IN")} /><Metric label="Attendance" value={`${certificate.attendance}%`} /></div></div><button onClick={() => window.print()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white"><Download size={16} /> Download Certificate</button></div> : <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3"><XCircle className="text-amber-500" /><h2 className="text-xl font-black text-slate-900">Certificate not available yet</h2></div><p className="mt-2 text-sm text-slate-500">Complete your course requirements to become eligible.</p><div className="mt-6 grid gap-4 sm:grid-cols-3"><Metric label="Course Progress" value={`${eligibility.progress}%`} /><Metric label="Attendance" value={`${eligibility.attendance}%`} /><Metric label="Pending Fees" value={`₹${eligibility.pendingFees.toLocaleString("en-IN")}`} /></div><div className="mt-6 space-y-2">{eligibility.reasons.map((reason) => <p key={reason} className="flex items-center gap-2 text-sm font-semibold text-slate-700"><XCircle size={16} className="text-amber-500" />{reason}</p>)}</div></div>}
		</section>
	);
};

const Metric = ({ label, value }) => <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 break-words text-lg font-black text-slate-900">{value}</p></div>;

export default StudentCertificate;
