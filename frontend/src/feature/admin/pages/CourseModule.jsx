import React, { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Trash2,
  Loader2,
  Pencil,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

export default function CourseModules() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadModules = async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint = courseId
        ? `/api/modules/course/${courseId}`
        : "/api/modules";

      const data = await apiFetch(endpoint);
      setModules(data.data || []);

      if (courseId) {
        try {
          const courseData = await apiFetch(`/api/courses/${courseId}`);
          setCourse(courseData.data);
        } catch {
          setCourse(null);
        }
      } else {
        setCourse(null);
      }
    } catch (loadError) {
      console.error("LOAD MODULES:", loadError);
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, [courseId]);

  const handleDelete = async (moduleId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this module?",
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/api/modules/${moduleId}`, {
        method: "DELETE",
      });

      setModules((prev) => prev.filter((item) => item._id !== moduleId));
      alert("Module deleted successfully");
    } catch (deleteError) {
      alert(deleteError.message);
    }
  };

  const handlePublish = async (moduleId) => {
    try {
      const data = await apiFetch(`/api/modules/${moduleId}/publish`, {
        method: "PATCH",
      });

      setModules((prev) =>
        prev.map((item) => (item._id === moduleId ? data.data : item)),
      );
    } catch (publishError) {
      alert(publishError.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading modules...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
            Courses / Modules
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
            {courseId ? "Course Modules" : "All Modules"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage modules, topics and learning structure.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              courseId
                ? `/admin/courses/${courseId}/modules/add`
                : "/admin/courses",
            )
          }
          disabled={!courseId}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Plus className="h-4 w-4" />
          Add Module
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <BookOpen className="h-6 w-6" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {courseId ? "Selected Course" : "Module Inventory"}
            </p>
            <h2 className="text-base font-bold text-slate-900">
              {course?.title || "All Courses"}
            </h2>
            <p className="text-xs text-slate-400">
              {modules.length} {modules.length === 1 ? "Module" : "Modules"}
            </p>
          </div>
        </div>
      </div>

      {modules.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-800">
            No Modules Found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {courseId
              ? "Start building this course by adding your first module."
              : "Create a module from a course to start managing it here."}
          </p>

          {courseId && (
            <button
              onClick={() => navigate(`/admin/courses/${courseId}/modules/add`)}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
            >
              Create First Module
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {modules.map((module, index) => (
          <div
            key={module._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-200"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-extrabold text-amber-700">
                  {index + 1}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {module.title}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    {!courseId && module.courseId?.title && (
                      <span className="font-semibold text-slate-500">
                        {module.courseId.title}
                      </span>
                    )}
                    <span>Order: {module.order}</span>
                    <span>|</span>
                    <span>
                      {module.duration?.value || 0} {module.duration?.unit || "hours"}
                    </span>
                    <span>|</span>
                    <span
                      className={
                        module.isPublished
                          ? "font-semibold text-emerald-600"
                          : "font-semibold text-amber-600"
                      }
                    >
                      {module.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/admin/modules/${module._id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>

                <button
                  onClick={() => navigate(`/admin/modules/${module._id}/edit`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>

                <button
                  onClick={() => handlePublish(module._id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {module.isPublished ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      Publish
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(module._id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>

            {module.description && (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {module.description}
              </p>
            )}

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Topics
                </span>
                <span className="text-[11px] text-slate-400">
                  {module.topics?.length || 0} topics
                </span>
              </div>

              {module.topics?.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {module.topics.map((topic, topicIndex) => (
                    <div
                      key={topic._id || topicIndex}
                      className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="truncate">
                        {topic.title || topic.name || topic}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-400">
                  No topics added yet.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
