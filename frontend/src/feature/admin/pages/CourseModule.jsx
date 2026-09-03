import React, { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";


export default function CourseModules() {
  const { courseId } = useParams();
const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // GET MODULES
  // =========================
  const getModules = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/modules/course/${courseId}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch modules");
      }

      setModules(data.data || []);
    } catch (error) {
      console.log("Get Modules Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE MODULE
  // =========================
  const deleteModule = async (moduleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this module?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/modules/${moduleId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete module");
      }

      // UI se remove
      setModules((prev) => prev.filter((item) => item._id !== moduleId));

      alert("Module deleted successfully");
    } catch (error) {
      console.log("Delete Module Error:", error);
      alert(error.message);
    }
  };

  // =========================
  // PAGE LOAD
  // =========================
  useEffect(() => {
    if (courseId) {
      getModules();
    }
  }, [courseId]);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
          Courses / Modules
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
          Course Modules
        </h2>

        <p className="mt-1 text-xs text-slate-600">
          Manage course modules and learning topics.
        </p>
      </div>
<div><button
  onClick={() =>
    navigate(`/admin/courses/${courseId}/modules/add`)
  }
  className="px-4 py-2 bg-orange-500 text-white rounded-lg"
>
  + Add Module
</button></div>
      {/* ================= COURSE INFO ================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Selected Course
            </p>

            <h3 className="text-sm font-bold text-slate-900">
              Course ID: {courseId}
            </h3>
          </div>
        </div>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading modules...
          </div>
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!loading && modules.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-4 text-sm font-bold text-slate-800">
            No Modules Found
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            This course doesn't have any modules yet.
          </p>
        </div>
      )}

      {/* ================= MODULE LIST ================= */}

      {!loading && modules.length > 0 && (
        <div className="space-y-4">
          {modules.map((item, index) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-amber-400/50"
            >
              {/* MODULE HEADER */}

              <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800">
                    {index + 1}
                  </span>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-slate-400">
                      {item.duration?.value || 0}{" "}
                      {item.duration?.unit || "hours"}
                    </p>
                  </div>
                </div>

                {/* DELETE */}

                <button
                  type="button"
                  onClick={() => deleteModule(item._id)}
                  className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>

              {/* DESCRIPTION */}

              {item.description && (
                <p className="mt-4 text-xs text-slate-600">
                  {item.description}
                </p>
              )}

              {/* TOPICS */}

              <div className="mt-4">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Included Topics
                </span>

                {item.topics && item.topics.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {item.topics.map((topic, topicIndex) => (
                      <div
                        key={topic._id || topicIndex}
                        className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />

                        <span className="truncate">
                          {topic.title || topic.name || topic}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No topics added yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
