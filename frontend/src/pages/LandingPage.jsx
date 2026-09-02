import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import logo from '../../assist/logo.png';
import { apiFetch } from '../utils/api';
const stats = [
  { label: 'Franchises', value: '42+', icon: Building2 },
  { label: 'Active Students', value: '14.2K', icon: Users },
  { label: 'Course Tracks', value: '120+', icon: BookOpen },
];

const features = [
  {
    title: 'Smart course operations',
    description: 'Manage learning programs, enrollment flow, and trainer performance from one workspace.',
    icon: GraduationCap,
  },
  {
    title: 'Real-time business insight',
    description: 'Track growth, revenue, and operational health with dashboards built for scale.',
    icon: BarChart3,
  },
  {
    title: 'Secure franchise control',
    description: 'Monitor each region, branch, and team with consistent control and visibility.',
    icon: ShieldCheck,
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    apiFetch('/api/courses').then((response) => setCourses(response.data || [])).catch(() => setCourses([]));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.35)] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div>
              <img src={logo} alt="" className='h-20 w-70' />
            </div>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-orange-400/60 hover:text-white"
          >
            Admin Login
          </button>
        </header>

        <main className="grid items-center gap-14 pb-16 pt-16 lg:grid-cols-[1.25fr_0.75fr] lg:pt-20">
          <motion.section
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Enterprise-ready platform
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build smarter education growth with AI-powered operations.
            </h1>

            <p className="mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
              Manage franchise expansion, course performance, and student journeys from a single modern dashboard made for high-growth academic brands.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/dashboard')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-orange-500/30 transition hover:shadow-orange-500/40"
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <button
                onClick={() => navigate('/courses')}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Explore Courses
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-5 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                99.9% uptime
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Multi-branch visibility
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                Real-time analytics
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="relative"
          >
            <div className="rounded-4xl border border-white/10 bg-white/5 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Performance</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">Q3 Growth</h2>
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 px-2.5 py-1.5 text-sm font-semibold text-emerald-400">
                    +24.6%
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {stats.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-2xl font-black text-white">{value}</p>
                      <p className="mt-1 text-xs text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-800 bg-linear-to-r from-slate-950 to-slate-900 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-200">Operations Snapshot</p>
                    <span className="text-xs text-emerald-400">healthy</span>
                  </div>
                  <div className="space-y-3">
                    {[85, 72, 96].map((value, index) => (
                      <div key={value}>
                        <div className="mb-1 flex justify-between text-[11px] text-slate-400">
                          <span>{['Admissions', 'Retention', 'Revenue'][index]}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-orange-500 to-amber-400"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        <section className="pb-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Live catalog</p><h2 className="mt-2 text-3xl font-black text-white">Explore current courses</h2></div>
            <button onClick={() => navigate('/courses')} className="text-sm font-bold text-orange-300 hover:text-white">View all</button>
          </div>
          {courses.length === 0 ? <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">No published courses are available yet.</p> : <div className="grid gap-5 md:grid-cols-3">{courses.slice(0, 3).map((course) => <article key={course._id || course.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5"><div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300"><BookOpen className="h-10 w-10" /></div><h3 className="text-lg font-bold text-white">{course.title}</h3><p className="mt-2 line-clamp-2 text-sm text-slate-400">{course.shortDescription || course.description}</p><div className="mt-4 flex items-center justify-between text-xs text-slate-300"><span>{course.duration?.value} {course.duration?.unit}</span><span className="font-bold text-orange-300">₹{Number(course.courseFee || 0).toLocaleString('en-IN')}</span></div></article>)}</div>}
        </section>

        <section className="grid gap-6 pb-20 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + index * 0.1 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/30"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500/20 to-amber-500/10 text-orange-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
            </motion.article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
