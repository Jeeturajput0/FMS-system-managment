import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center z-10 flex flex-col items-center"
      >
        {/* AI Scholar Logo & Brand */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-2xl shadow-orange-500/30 mb-8 border border-orange-400/30">
          <Sparkles className="w-10 h-10" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          AI Scholars
        </h1>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-10">
          <ShieldCheck className="w-3.5 h-3.5" /> LMS & Franchise OS
        </div>

        {/* Primary Dashboard Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/login')}
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center gap-3 group transition-all cursor-pointer"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <p className="mt-8 text-xs text-slate-400 font-medium">
          Production Frontend Prototype • Enterprise Ready
        </p>
      </motion.div>
    </div>
  );
};
