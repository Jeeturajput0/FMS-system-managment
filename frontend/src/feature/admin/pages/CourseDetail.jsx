import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../../context/DataContext';
import {
  BookOpen,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  ClipboardList,
  HelpCircle,
  CheckCircle2,
  Clock,
  Award,
  Users,
  Layers,
  Plus
} from 'lucide-react';
import { apiFetch } from '../../../utils/api';

export const CourseDetail = () => {
  const { id } = useParams();
  const { students } = useData();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Curriculum');
  const [expandedModules, setExpandedModules] = useState(['MOD-1', 'MOD-2', 'MOD-201']);

  useEffect(() => {
    apiFetch(`/api/courses/${id}`).then((response) => setCourse(response.data)).catch(() => setCourse(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-slate-600">Loading course...</p>;
  if (!course) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Course not found.</div>;

  const enrolledList = students.filter((s) => s.courseId === (course.id || course._id) || s.course === course.title);

  const toggleModule = (modId) => {
    setExpandedModules((prev) =>
      prev.includes(modId) ? prev.filter((m) => m !== modId) : [...prev, modId]
    );
  };

  const tabs = [
    'Overview',
    'Curriculum',
    'Modules',
    'Topics',
    'Study Material',
    'Assignments',
    'Tests',
    'Students'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <Link
        to="/admin/courses"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Master Catalog
      </Link>

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center shadow-lg text-2xl shrink-0">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900">{course.title}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800">
                {course.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {course.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-medium">{course.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-600">Fee Price</p>
            <p className="text-xl font-extrabold text-slate-900">{course.feePrice}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-600">Duration</p>
            <p className="text-sm font-bold text-slate-900">
              {course.duration && typeof course.duration === 'object'
                ? `${course.duration.value || 1} ${course.duration.unit || 'months'}`
                : course.duration || '1 month'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content: Curriculum Structure */}
      {activeTab === 'Curriculum' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">Course Hierarchy Syllabus</h3>
            <span className="text-xs text-slate-600 font-medium">Course → Module → Topic → (Video / PDF / Assignment / Test)</span>
          </div>

          {course.modules && course.modules.length > 0 ? (
            <div className="space-y-4">
              {course.modules.map((module) => {
                const isExpanded = expandedModules.includes(module.id);
                return (
                  <div key={module.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-4 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                          <Layers className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{module.title}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-600 font-medium">{module.topics?.length || 0} Topics</span>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 divide-y divide-slate-100">
                        {module.topics?.map((topic) => (
                          <div key={topic.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-3 rounded-xl transition-colors">
                            <div className="flex items-center gap-3">
                              {topic.type === 'Video' && <Video className="w-4 h-4 text-sky-500 shrink-0" />}
                              {topic.type === 'PDF' && <FileText className="w-4 h-4 text-amber-500 shrink-0" />}
                              {topic.type === 'Assignment' && <ClipboardList className="w-4 h-4 text-purple-500 shrink-0" />}
                              {topic.type === 'Test' && <HelpCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                              <div>
                                <p className="text-xs font-bold text-slate-900">{topic.title}</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-medium mt-0.5">
                                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 font-semibold">{topic.type}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {topic.duration}</span>
                                </div>
                              </div>
                            </div>

                            {topic.isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-600">Pending</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-600 space-y-3">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Demo Syllabus Modules for this course are currently being mapped to AI Scholar LMS.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Overview' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Track Specifications</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-600 font-semibold">Master Category</p>
              <p className="font-bold text-slate-900 mt-0.5">{course.category}</p>
            </div>
            <div>
              <p className="text-slate-600 font-semibold">Recommended Level</p>
              <p className="font-bold text-slate-900 mt-0.5">{course.level}</p>
            </div>
            <div>
              <p className="text-slate-600 font-semibold">Syllabus Modules</p>
              <p className="font-bold text-slate-900 mt-0.5">{course.modulesCount || 4} Core Modules</p>
            </div>
            <div>
              <p className="text-slate-600 font-semibold">Active Enrolment</p>
              <p className="font-bold text-slate-900 mt-0.5">{course.enrolledStudents} Students Nationwide</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Students' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Enrolled Candidates ({enrolledList.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Franchise</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {enrolledList.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 px-3 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-3 text-slate-700">{s.franchise}</td>
                    <td className="py-3 px-3 font-mono">{s.batch}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
