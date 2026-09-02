import React, { useState } from "react";
import { BookOpen, Plus, CheckCircle2 } from "lucide-react";

export default function CourseModules() {
  const [selectedCourse] = useState("AI & Deep Learning Pro");

  const course = {
    name: selectedCourse,
    modules: [
      {
        id: "MOD-101",
        title: "Module 1: Foundations of Artificial Intelligence & Math",
        lessons: 8,
        duration: "12 Hours",
        topics: [
          "Linear Algebra & Matrix Operations",
          "Probability & Statistics for ML",
          "Python for Scientific Computing (NumPy/Pandas)",
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">Courses / Modules</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight">Course Modules Manager</h2>
          <p className="mt-1 text-xs text-slate-600">Configure structured syllabus breakdown, units, and learning milestones.</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Module</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Selected Course</p>
            <h3 className="text-base font-bold text-slate-900">{course.name}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {course.modules.map((item, index) => (
          <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-amber-400/50 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{item.id} • {item.lessons} Lessons • {item.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50">
                  Edit Module
                </button>
                <button type="button" className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800">
                  Manage Lessons
                </button>
              </div>
            </div>

            <div className="mt-3 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Included Topics:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.topics.map((topic, topicIndex) => (
                  <div key={`${item.id}-${topicIndex}`} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}