import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PortalSectionPage } from "../../portal/components/PortalSectionPage";
import { apiFetch } from "../../../utils/api";

const AddStudentForm = () => {
	const navigate = useNavigate();
	const [courses, setCourses] = useState([]);
	const [form, setForm] = useState({ name: "", mobile: "", email: "", courseId: "" });
	const [message, setMessage] = useState("");
	useEffect(() => { apiFetch("/api/portal/courses").then((response) => setCourses(response.data || [])).catch((error) => setMessage(error.message)); }, []);
	const submit = async (event) => {
		event.preventDefault();
		try {
			const user = JSON.parse(localStorage.getItem("ai_scholars_user") || "null");
			await apiFetch("/api/students", { method: "POST", body: JSON.stringify({ ...form, coachingId: user?.coachingId }) });
			navigate("/franchise/students");
		} catch (error) { setMessage(error.message || "Unable to create student"); }
	};
	return <div className="mx-auto max-w-3xl space-y-6"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">Franchise operations</p><h1 className="mt-2 text-3xl font-black text-slate-900">Add Student</h1><p className="mt-2 text-sm text-slate-500">Create an enrolment that will appear in your centre records.</p></div>{message && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{message}</div>}<form onSubmit={submit} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Student name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4" /></label><label className="text-sm font-bold text-slate-700">Mobile<input required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4" /></label><label className="text-sm font-bold text-slate-700">Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4" /></label><label className="text-sm font-bold text-slate-700">Course<select required value={form.courseId} onChange={(event) => setForm({ ...form, courseId: event.target.value })} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4"><option value="">Select course</option>{courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}</select></label><div className="flex gap-3 sm:col-span-2"><button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Save Student</button><button type="button" onClick={() => navigate("/franchise/students")} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600">Cancel</button></div></form></div>;
};

export const FranchiseStudents = () => useLocation().pathname.endsWith("add-student") ? <AddStudentForm /> : <PortalSectionPage title="All Students" description="Manage enrolments and monitor student progress at your centre." type="students" actionLabel="Add Student" actionPath="/franchise/students/add-student" />;
export const FranchiseCourses = () => <PortalSectionPage title="Course Catalog" description="Browse the courses available to your franchise." type="courses" />;
export const FranchiseFees = () => <PortalSectionPage title="Fee Management" description="Track pending fees and payment records for your centre." type="fees" />;
export const FranchisePlaceholder = ({ title }) => <PortalSectionPage title={title} description="Manage this franchise operation from your workspace." type="students" actionLabel={title.includes("Add") || title.includes("Create") ? title : undefined} />;
