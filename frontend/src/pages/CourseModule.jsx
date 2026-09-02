import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { useParams } from "react-router-dom";

export default function CourseModules() {
  // Get courseId from URL
  const { courseId } = useParams();

  // Modules
  const [modules, setModules] = useState([]);

  // Loading
  const [loading, setLoading] = useState(false);

  // Error
  const [error, setError] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Edit mode
  const [editingModule, setEditingModule] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
    durationValue: 0,
    durationUnit: "hours",
    isPublished: false,
  });

  // =====================================================
  // GET MODULES
  // =====================================================

  const getModules = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/modules/course/${courseId}`
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

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = () => {
    setEditingModule(null);

    setFormData({
      title: "",
      description: "",
      order: modules.length + 1,
      durationValue: 0,
      durationUnit: "hours",
      isPublished: false,
    });

    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (module) => {
    setEditingModule(module);

    setFormData({
      title: module.title || "",
      description: module.description || "",
      order: module.order || 1,
      durationValue: module.duration?.value || 0,
      durationUnit: module.duration?.unit || "hours",
      isPublished: module.isPublished || false,
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingModule(null);
  };

  // =====================================================
  // ADD / UPDATE MODULE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter module title");
      return;
    }

    try {
      const moduleData = {
        courseId: courseId,
        title: formData.title,
        description: formData.description,
        order: Number(formData.order),
        duration: {
          value: Number(formData.durationValue),
          unit: formData.durationUnit,
        },
        isPublished: formData.isPublished,
      };

      let url = "http://localhost:5000/api/modules";
      let method = "POST";

      // Edit
      if (editingModule) {
        url = `http://localhost:5000/api/modules/${editingModule._id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(moduleData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(
        editingModule
          ? "Module updated successfully"
          : "Module created successfully"
      );

      closeModal();

      // Refresh modules
      getModules();
    } catch (error) {
      console.log("Save Module Error:", error);
      alert(error.message);
    }
  };

  // =====================================================
  // DELETE MODULE
  // =====================================================

  const deleteModule = async (moduleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this module?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/modules/${moduleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete module");
      }

      alert("Module deleted successfully");

      // Remove from UI
      setModules((prevModules) =>
        prevModules.filter((item) => item._id !== moduleId)
      );
    } catch (error) {
      console.log("Delete Module Error:", error);
      alert(error.message);
    }
  };

  // =====================================================
  // GET MODULES ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    if (courseId) {
      getModules();
    }
  }, [courseId]);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
            Courses / Modules
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight">
            Course Modules Manager
          </h2>

          <p className="mt-1 text-xs text-slate-600">
            Manage your course modules and learning topics.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />

          Add New Module
        </button>
      </div>

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

            <h3 className="text-base font-bold text-slate-900">
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
        <div className="flex items-center justify-center py-16">

          <div className="flex items-center gap-2 text-slate-500 text-sm">

            <Loader2 className="w-5 h-5 animate-spin" />

            Loading modules...

          </div>
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!loading && modules.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <BookOpen className="mx-auto w-10 h-10 text-slate-300" />

          <h3 className="mt-4 text-sm font-bold text-slate-800">
            No Modules Found
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Start by adding your first course module.
          </p>

          <button
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-900"
          >
            <Plus className="w-4 h-4" />

            Add Module
          </button>

        </div>
      )}

      {/* ================= MODULE LIST ================= */}

      {!loading && modules.length > 0 && (
        <div className="space-y-4">

          {modules.map((item, index) => (

            <div
              key={item._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-amber-400/50 transition-all"
            >

              {/* MODULE HEADER */}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </span>

                  <div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-slate-400">
                      {item._id}
                      {" • "}
                      {item.duration?.value || 0}
                      {" "}
                      {item.duration?.unit || "hours"}
                    </p>

                  </div>
                </div>

                {/* BUTTONS */}

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    <Pencil className="w-3.5 h-3.5" />

                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteModule(item._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />

                    Delete
                  </button>

                </div>

              </div>

              {/* DESCRIPTION */}

              {item.description && (
                <p className="mt-4 text-xs text-slate-600">
                  {item.description}
                </p>
              )}

              {/* TOPICS */}

              <div className="mt-4">

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Included Topics
                </span>

                {item.topics && item.topics.length > 0 ? (

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                    {item.topics.map((topic, topicIndex) => (

                      <div
                        key={topic._id || topicIndex}
                        className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg"
                      >

                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />

                        <span className="truncate">
                          {topic.title || topic.name || topic}
                        </span>

                      </div>

                    ))}

                  </div>

                ) : (

                  <p className="text-xs text-slate-400">
                    No topics added yet.
                  </p>

                )}

              </div>

            </div>

          ))}

        </div>
      )}

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h3 className="text-base font-bold text-slate-900">
                  {editingModule ? "Edit Module" : "Add New Module"}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {editingModule
                    ? "Update module information."
                    : "Create a new module for this course."}
                </p>

              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-5"
            >

              {/* TITLE */}

              <div>

                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Module Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter module title"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter module description"
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 resize-none"
                />

              </div>

              {/* ORDER + DURATION */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Order
                  </label>

                  <input
                    type="number"
                    name="order"
                    min="1"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Duration
                  </label>

                  <input
                    type="number"
                    name="durationValue"
                    min="0"
                    value={formData.durationValue}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500"
                  />

                </div>

              </div>

              {/* DURATION UNIT */}

              <div>

                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Duration Unit
                </label>

                <select
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500"
                >
                  <option value="hours">Hours</option>
                  <option value="minutes">Minutes</option>
                  <option value="days">Days</option>
                </select>

              </div>

              {/* PUBLISHED */}

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-500"
                />

                <span className="text-xs font-semibold text-slate-700">
                  Publish this module
                </span>

              </label>

              {/* ACTIONS */}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold"
                >
                  <Save className="w-4 h-4" />

                  {editingModule ? "Update Module" : "Create Module"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}