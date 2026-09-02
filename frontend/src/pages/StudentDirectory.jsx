import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  X,
  Sparkles,
  BookOpen,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const StudentDirectory = () => {
  const { students, courses, franchises, addStudent } = useData();
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [franchiseFilter, setFranchiseFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'Full Stack Web & AI Development',
    franchise: 'AI Scholar Agra',
    batch: 'Batch AI-2026A',
    feesTotal: '₹35,000',
    feesPaid: '₹35,000'
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === 'All' || s.course === courseFilter;
    const matchesFranchise = franchiseFilter === 'All' || s.franchise === franchiseFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesCourse && matchesFranchise && matchesStatus;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      addStudent(formData);
      setFormData({ name: '', email: '', phone: '', course: 'Full Stack Web & AI Development', franchise: 'AI Scholar Agra', batch: 'Batch AI-2026A', feesTotal: '₹35,000', feesPaid: '₹35,000' });
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Directory</h2>
          <p className="text-xs text-slate-600 mt-1">
            Comprehensive LMS candidate profiles, fee balances, and academic progress
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by student name, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white"
            />
          </div>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="All">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Franchise Filter */}
          <select
            value={franchiseFilter}
            onChange={(e) => setFranchiseFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="All">All Franchises</option>
            {franchises.map((f) => (
              <option key={f.id} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-4 px-4">Student ID</th>
                <th className="py-4 px-4">Student Name</th>
                <th className="py-4 px-4">Course</th>
                <th className="py-4 px-4">Franchise</th>
                <th className="py-4 px-4">Batch</th>
                <th className="py-4 px-4">Fees Status</th>
                <th className="py-4 px-4">Attendance</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-600 text-xs">
                    No students match your filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-orange-600">{s.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                          <p className="text-[10px] text-slate-600">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-700 max-w-xs truncate">{s.course}</td>
                    <td className="py-4 px-4 text-slate-700">{s.franchise}</td>
                    <td className="py-4 px-4 font-mono">{s.batch}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-slate-900">{s.feesPaid} / {s.feesTotal}</p>
                        <span className={`text-[10px] font-bold ${
                          s.feesStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {s.feesStatus}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{s.attendance}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : s.status === 'Completed'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/admin/students/${s.id}`}
                        className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors font-bold text-xs inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
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
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Enroll New Candidate</h3>
                    <p className="text-xs text-slate-600">Register student into AI Scholar LMS</p>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Student Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Batch Code</label>
                    <input
                      type="text"
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assign Course</label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assign Franchise</label>
                    <select
                      value={formData.franchise}
                      onChange={(e) => setFormData({ ...formData, franchise: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    >
                      {franchises.map((f) => (
                        <option key={f.id} value={f.name}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    Complete Enrollment
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
