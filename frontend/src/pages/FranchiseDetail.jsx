import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  User,
  Users,
  IndianRupee,
  BookOpen,
  Award,
  Calendar,
  Star,
  ChevronLeft,
  GraduationCap,
  Layers,
  CreditCard
} from 'lucide-react';

export const FranchiseDetail = () => {
  const { id } = useParams();
  const { franchises, students, payments } = useData();

  const franchise = franchises.find((f) => f.id === id) || franchises[0];
  const franchiseStudents = students.filter(
    (s) => s.franchise.toLowerCase().includes(franchise.name.toLowerCase()) || s.franchiseId === franchise.id
  );
  const franchisePayments = payments.filter(
    (p) => p.franchise.toLowerCase().includes(franchise.name.toLowerCase())
  );

  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Students', 'Courses', 'Batches', 'Payments'];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <Link
        to="/admin/franchises"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Franchise Network
      </Link>

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center shadow-lg shadow-orange-500/20 text-2xl shrink-0">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900">{franchise.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 text-orange-800">
                {franchise.code}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                franchise.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {franchise.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {franchise.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-600">Total Revenue</p>
            <p className="text-xl font-extrabold text-slate-900">{franchise.revenue}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-600">Rating</p>
            <p className="text-xl font-extrabold text-amber-600 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {franchise.rating}
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

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic & Owner Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-600 font-semibold">Franchise ID</p>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{franchise.id}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Established Date</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{franchise.established}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Location Region</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{franchise.location}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Active Batches</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{franchise.activeBatches} Batches</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Owner & Contact Info</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-600 font-semibold">Owner Name</p>
                  <p className="font-bold text-slate-900 mt-0.5">{franchise.owner}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Email Address</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{franchise.email}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Phone Contact</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{franchise.phone}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Teaching Staff</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{franchise.teachersCount} Certified Instructors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Courses Offered</h3>
              <div className="space-y-2">
                {franchise.coursesOffered?.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-orange-50/50 border border-orange-100 text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Students' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Enrolled Students ({franchiseStudents.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Course</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Fees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {franchiseStudents.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 px-3 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-3 text-slate-700">{s.course}</td>
                    <td className="py-3 px-3 font-mono">{s.batch}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{s.feesPaid} / {s.feesTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Payments' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Franchise Payments ({franchisePayments.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-3">Receipt</th>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {franchisePayments.map((p) => (
                  <tr key={p.receiptNo}>
                    <td className="py-3 px-3 font-mono font-bold text-orange-600">{p.receiptNo}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{p.studentName}</td>
                    <td className="py-3 px-3">{p.feeType}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{p.amount}</td>
                    <td className="py-3 px-3">{p.date}</td>
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
