import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Building2,
  Users,
  BookOpen,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const DashboardOverview = () => {
  const { franchises, courses, students, payments, enrollmentChartData } = useData();

  // Calculate high level metrics
  const totalFranchisesCount = franchises.length;
  const totalStudentsCount = students.length * 240; // Scaled for realistic prototype view
  const activeCoursesCount = courses.filter((c) => c.status === 'Published').length;

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> AI Scholar Admin OS v3.4
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good Morning, Arjun 👋
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Here's what's happening across AI Scholar's nationwide franchise network & LMS platform today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/courses"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-orange-400" /> Catalog
            </Link>
            <Link
              to="/admin/franchises"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Franchise
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Franchises */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Franchises</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{totalFranchisesCount}</h3>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">Active centers in 4 major cities</p>
        </div>

        {/* Card 2: Total Students */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Students</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">1,427</h3>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">Enrolled across all master tracks</p>
        </div>

        {/* Card 3: Active Courses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Active Courses</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{activeCoursesCount}</h3>
            <span className="inline-flex items-center text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              5 Total Catalog
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">AI & Full Stack curriculum</p>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">₹83,70,000</h3>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +24.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-medium">YTD Franchise & Course Collections</p>
        </div>
      </div>

      {/* Analytics Chart & Franchise Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Enrollment Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Enrollment Analytics</h3>
              <p className="text-xs text-slate-600">Monthly student registration growth across franchises</p>
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              2026 Trend Data
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="students" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Franchise Performance Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Franchise Performance</h3>
              <Link to="/admin/franchises" className="text-xs font-bold text-orange-600 hover:underline flex items-center">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-xs text-slate-600 mb-4">Leading regional training centers</p>

            <div className="space-y-4">
              {franchises.map((f) => (
                <div key={f.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                      {f.code.slice(-3)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{f.name}</h4>
                      <p className="text-[11px] text-slate-600 font-medium">{f.studentsCount} Students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-slate-900">{f.revenue}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      f.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section: Recent Registrations & Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Student Registrations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Student Registrations</h3>
              <p className="text-xs text-slate-600">Latest candidate enrollments</p>
            </div>
            <Link to="/admin/students" className="text-xs font-bold text-orange-600 hover:underline">
              View Directory →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] border-y border-slate-100">
                <tr>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Franchise</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.slice(0, 4).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-[10px] text-slate-600">{s.course.slice(0, 22)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{s.franchise}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link to={`/admin/students/${s.id}`} className="text-orange-600 hover:text-orange-700 font-bold">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Fee Payments</h3>
              <p className="text-xs text-slate-600">Financial receipt updates</p>
            </div>
            <Link to="/admin/fees" className="text-xs font-bold text-orange-600 hover:underline">
              Fee Management →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] border-y border-slate-100">
                <tr>
                  <th className="py-3 px-3">Receipt</th>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payments.slice(0, 4).map((p) => (
                  <tr key={p.receiptNo} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-orange-600">{p.receiptNo}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{p.studentName}</p>
                      <p className="text-[10px] text-slate-600">{p.feeType}</p>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">{p.amount}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
