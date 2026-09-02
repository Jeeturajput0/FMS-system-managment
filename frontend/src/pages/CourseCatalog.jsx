import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Users,
  Eye,
  Edit,
  X,
  Sparkles,
  Award,
  Layers,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch, apiUpload, assetUrl } from "../utils/api";

export const CourseCatalog = () => {
  const { courses, addCourse, replaceCourses } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "AI & Software Engineering",
    duration: "4 Months (16 Weeks)",
    feePrice: "₹30,000",
    feePriceNum: 30000,
    description: "",
    level: "Intermediate",
    thumbnail: null,
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/api/courses');
        if (Array.isArray(response.data) && response.data.length) {
          const normalized = response.data.map((course) => ({
            id: course.id || course._id,
            title: course.title,
            category: course.category || 'General',
            duration: `${course.duration?.value || 1} ${course.duration?.unit || 'months'}`,
            feePrice: `₹${Number(course.courseFee || 0).toLocaleString('en-IN')}`,
            feePriceNum: Number(course.courseFee || 0),
            description: course.description,
            level: course.level || 'Beginner',
            status: course.status || 'Published',
            enrolledStudents: course.enrolledStudents || 0,
            image: course.images?.[0] || course.thumbnail || '',
          }));

          if (normalized.length) {
            replaceCourses(normalized);
            localStorage.setItem('ai_scholars_courses', JSON.stringify(normalized));
          }
        }
      } catch (err) {
        console.warn('Course API unavailable, using local mock data.', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      const body = new FormData();
      body.append('title', formData.title);
      body.append('category', formData.category);
      body.append('description', formData.description);
      body.append('shortDescription', formData.description);
      body.append('level', formData.level);
      body.append('courseFee', String(formData.feePriceNum || 0));
      body.append('registrationFee', String(1000));
      body.append('certificateFee', String(3000));
      body.append('duration', JSON.stringify({ value: 4, unit: 'months' }));
      if (formData.thumbnail) body.append('thumbnail', formData.thumbnail);

      const response = await apiUpload('/api/courses', body);
      addCourse({
        id: response.data?.id || `CRS-${Date.now()}`,
        title: response.data?.title || formData.title,
        category: response.data?.category || formData.category,
        duration: response.data?.duration ? `${response.data.duration.value} ${response.data.duration.unit}` : formData.duration,
        feePrice: `₹${Number(response.data?.courseFee || formData.feePriceNum).toLocaleString('en-IN')}`,
        feePriceNum: Number(response.data?.courseFee || formData.feePriceNum),
        description: response.data?.description || formData.description,
        level: response.data?.level || formData.level,
        status: 'Published',
        enrolledStudents: 0,
      });

      setFormData({
        title: "",
        category: "AI & Software Engineering",
        duration: "4 Months (16 Weeks)",
        feePrice: "₹30,000",
        feePriceNum: 30000,
        description: "",
        level: "Intermediate",
        thumbnail: null,
      });
      setShowAddModal(false);
    } catch (err) {
      console.error('Course create failed', err);
      addCourse({
        id: `CRS-${Date.now()}`,
        title: formData.title,
        category: formData.category,
        duration: formData.duration,
        feePrice: formData.feePrice,
        feePriceNum: formData.feePriceNum,
        description: formData.description,
        level: formData.level,
        status: 'Published',
        enrolledStudents: 0,
      });
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Subtitle matching visual prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Curriculum & Master Course Catalog
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Manage master learning tracks, AI certifications, and course
            syllabus across franchises.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/course-add')}
          className="px-4 py-2.5 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Course</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search catalog by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-3 text-xs font-semibold text-orange-700">
          Syncing course data from backend...
        </div>
      )}

      {/* Course Catalog Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-4 px-4">Course Title</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Duration</th>
                <th className="py-4 px-4">Enrolled Students</th>
                <th className="py-4 px-4">Fee Price</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="py-8 text-center text-slate-600 text-xs"
                  >
                    No courses found matching filter.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 overflow-hidden rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0">
                          {c.image ? <img src={assetUrl(c.image)} alt={c.title} className="h-full w-full object-cover" /> : <BookOpen className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {c.title}
                          </p>
                          <p className="text-[10px] text-slate-600">
                            {c.level}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-700 text-[11px]">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {c.duration}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span>{c.enrolledStudents}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-900">
                      {c.feePrice}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : c.status === "Draft"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/courses/${c.id}`}
                          className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors font-bold text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                        <Link
                          to={`/admin/courses/${c.id}/edit`}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-bold text-xs flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!window.confirm(`Delete ${c.title}?`)) return;
                            await apiFetch(`/api/courses/${c.id}`, { method: 'DELETE' });
                            replaceCourses(courses.filter((course) => course.id !== c.id));
                          }}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-bold text-xs flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Course Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Create Master Learning Track
                    </h3>
                    <p className="text-xs text-slate-600">
                      Add course syllabus & certification track
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Web & AI Development"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white"
                    >
                      <option value="AI & Software Engineering">
                        AI & Software Engineering
                      </option>
                      <option value="Artificial Intelligence">
                        Artificial Intelligence
                      </option>
                      <option value="Data Science">Data Science</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Web Development">Web Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Fee Price *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="₹35,000"
                      value={formData.feePrice}
                      onChange={(e) =>
                        setFormData({ ...formData, feePrice: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="6 Months (24 Weeks)"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Comprehensive learning goals and syllabus summary..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20"
                  >
                    Publish Course
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
