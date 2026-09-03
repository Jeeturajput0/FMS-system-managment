import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Loader2, Pencil, Save } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const defaultFormData = {
  courseId: "",
  title: "",
  description: "",
  order: 1,
  durationValue: 0,
  durationUnit: "hours",
  isPublished: false,
};

const ModuleAdd = () => {
  const { courseId: urlCourseId, id: moduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isEditMode = Boolean(moduleId) && location.pathname.endsWith("/edit");
  const isViewMode = Boolean(moduleId) && !isEditMode;
  const isCreateMode = !moduleId;

  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    ...defaultFormData,
    courseId: urlCourseId || "",
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(Boolean(moduleId));
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState("");

  const pageMeta = useMemo(() => {
    if (isViewMode) {
      return {
        crumb: "Courses / Modules / View",
        title: "View Module",
        subtitle: "Review module details, structure and publish status.",
        submitLabel: "Save Changes",
      };
    }

    if (isEditMode) {
      return {
        crumb: "Courses / Modules / Edit",
        title: "Edit Module",
        subtitle: "Update the module details and keep your syllabus current.",
        submitLabel: "Save Changes",
      };
    }

    return {
      crumb: "Courses / Modules / Create",
      title: "Add New Module",
      subtitle: "Create a learning module for an AI Scholar course.",
      submitLabel: "Create Module",
    };
  }, [isEditMode, isViewMode]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setCoursesLoading(true);
        const data = await apiFetch("/api/courses");
        setCourses(data.data || []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, []);

  useEffect(() => {
    if (!moduleId) return;

    const loadModule = async () => {
      try {
        setPageLoading(true);
        setError("");

        const data = await apiFetch(`/api/modules/${moduleId}`);
        const module = data.data;

        setFormData({
          courseId: module.courseId?._id || module.courseId || urlCourseId || "",
          title: module.title || "",
          description: module.description || "",
          order: module.order || 1,
          durationValue: module.duration?.value || 0,
          durationUnit: module.duration?.unit || "hours",
          isPublished: Boolean(module.isPublished),
        });
      } catch (loadError) {
        console.error("LOAD MODULE:", loadError);
        setError(loadError.message);
      } finally {
        setPageLoading(false);
      }
    };

    loadModule();
  }, [moduleId, urlCourseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isViewMode) return;

    setError("");

    if (!formData.courseId) {
      setError("Please select a course.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Module title is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        courseId: formData.courseId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        order: Number(formData.order),
        duration: {
          value: Number(formData.durationValue),
          unit: formData.durationUnit,
        },
        isPublished: Boolean(formData.isPublished),
      };

      const data = await apiFetch(
        isEditMode ? `/api/modules/${moduleId}` : "/api/modules",
        {
          method: isEditMode ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );

      alert(
        data.message ||
          (isEditMode
            ? "Module updated successfully"
            : "Module created successfully"),
      );

      navigate(`/admin/courses/${formData.courseId}/modules`);
    } catch (submitError) {
      console.error("SAVE MODULE:", submitError);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading module...
        </div>
      </div>
    );
  }

  const readOnly = isViewMode;
  const backTarget = formData.courseId
    ? `/admin/courses/${formData.courseId}/modules`
    : "/admin/courses/modules";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(backTarget)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Modules
          </button>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
            {pageMeta.crumb}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
            {pageMeta.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{pageMeta.subtitle}</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 bg-slate-50/70 p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Module Information
                  </h2>
                  <p className="text-xs text-slate-500">
                    {readOnly
                      ? "Module data is shown in read-only mode."
                      : "Enter the basic details of your module."}
                  </p>
                </div>
              </div>

              {isViewMode && (
                <button
                  type="button"
                  onClick={() => navigate(`/admin/modules/${moduleId}/edit`)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Module
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Course *
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                disabled={coursesLoading || readOnly}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
              >
                <option value="">
                  {coursesLoading ? "Loading courses..." : "Select Course"}
                </option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-400">
                Select the master course to which this module belongs.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Module Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                readOnly={readOnly}
                placeholder="e.g. JavaScript Fundamentals"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 read-only:bg-slate-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                readOnly={readOnly}
                rows={5}
                placeholder="Describe what students will learn in this module..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 read-only:bg-slate-50"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Duration
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="durationValue"
                    min="0"
                    value={formData.durationValue}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 read-only:bg-slate-50"
                  />

                  <select
                    name="durationUnit"
                    value={formData.durationUnit}
                    onChange={handleChange}
                    disabled={readOnly}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 disabled:bg-slate-100"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Module Order
                </label>

                <input
                  type="number"
                  name="order"
                  min="1"
                  value={formData.order}
                  onChange={handleChange}
                  readOnly={readOnly}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 read-only:bg-slate-50"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Example: 1, 2, 3...
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Publish Module
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Published modules can be made available to students.
                </p>
              </div>

              <label className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-slate-300 peer-checked:bg-orange-500 peer-disabled:opacity-60 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 p-5">
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate(backTarget)}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              {readOnly ? "Back" : "Cancel"}
            </button>

            {!readOnly && (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {loading ? "Saving..." : pageMeta.submitLabel}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleAdd;
