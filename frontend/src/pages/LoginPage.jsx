import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@aischolar.com');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const path = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister
        ? { name, email, password, role: 'SUPER_ADMIN' }
        : { email, password };

      const result = await apiFetch(path, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      localStorage.setItem('ai_scholars_token', result.token);
      localStorage.setItem('ai_scholars_user', JSON.stringify(result.user));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to authenticate.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectAccess = () => {
    setEmail('admin@aischolar.com');
    setPassword('admin123');
    localStorage.setItem('ai_scholars_token', 'demo-admin-token');
    localStorage.setItem('ai_scholars_user', JSON.stringify({ name: 'Super Admin', email: 'admin@aischolar.com', role: 'SUPER_ADMIN' }));
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-950 z-10"
      >
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Scholars</h2>
            <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Admin Portal OS</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white">{isRegister ? 'Create Admin Account' : 'Super Admin Login'}</h3>
          <p className="text-xs text-slate-400 mt-1">{isRegister ? 'Register a new admin user' : 'Sign in to access LMS & Franchise OS dashboard'}</p>
        </div>

        {/* Demo Credentials Alert Box */}
        <div className="mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs flex flex-col gap-1.5">
          <div className="flex items-center gap-2 font-bold text-orange-400">
            <CheckCircle2 className="w-4 h-4" /> Demo Access Credentials:
          </div>
          <div className="flex justify-between items-center text-slate-300 font-mono text-[11px] pt-1">
            <span>Email: <strong className="text-white">admin@aischolar.com</strong></span>
          </div>
          <div className="flex justify-between items-center text-slate-300 font-mono text-[11px]">
            <span>Password: <strong className="text-white">admin123</strong></span>
          </div>
        </div>

        {/* Inline Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <UserPlus className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required={isRegister}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter admin name"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aischolar.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>{isRegister ? 'Creating account...' : 'Authenticating...'}</span>
            ) : (
              <>
                <span>{isRegister ? 'Register Admin' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <span className="relative px-3 bg-slate-900 text-xs font-medium text-slate-500">OR</span>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setIsRegister((prev) => !prev)}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-orange-400" />
            <span>{isRegister ? 'Switch to Login' : 'Register New Admin'}</span>
          </button>

          <button
            onClick={handleDirectAccess}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Direct Access (1-Click Instant Demo)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
