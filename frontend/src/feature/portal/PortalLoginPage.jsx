import React, { useState } from "react";
import { ArrowRight, Lock, Mail, UserPlus, Building2, GraduationCap, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { sanitizePhoneInput } from "../../utils/phone";
import { sanitizeNameInput } from "../../utils/name";
import logo from "../../../assist/logo.png";

const roleOptions = [
  { value: "FRANCHISE", label: "Franchise", icon: Building2 },
  { value: "TEACHER", label: "Teacher", icon: GraduationCap },
  { value: "STUDENT", label: "Student", icon: UserRound },
];

const routeFor = (role) =>
  ({
    FRANCHISE: "/franchise",
    TEACHER: "/teacher",
    STUDENT: "/student/dashboard",
  })[role] || "/log";

export const PortalLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    franchiseName: "",
    phone: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.name === "phone"
        ? sanitizePhoneInput(event.target.value)
        : event.target.name === "name" || event.target.name === "franchiseName"
          ? sanitizeNameInput(event.target.value)
          : event.target.value,
    }));
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiFetch(
        `/api/auth/${register ? "register" : "login"}`,
        {
          method: "POST",
          body: JSON.stringify(
            register ? form : { email: form.email, password: form.password },
          ),
        },
      );
      if (!register && result.user.role !== form.role)
        throw new Error(
          `This account is registered as ${result.user.role.toLowerCase()}, not ${form.role.toLowerCase()}.`,
        );
      localStorage.setItem("ai_scholars_token", result.token);
      localStorage.setItem("ai_scholars_user", JSON.stringify(result.user));
      navigate(routeFor(result.user.role));
    } catch (requestError) {
      setError(requestError.message || "Unable to authenticate");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef4ff] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[.9fr_1.1fr]">
        <section className="hidden bg-blue-600 p-10 text-white lg:block">
          <div className="grid h-30 w-80 place-items-center rounded-2xl  text-xl font-black">
           <img src={logo} alt="ghj" />
          </div>
          <h1 className=" text-4xl font-black leading-tight">
            Learn, teach and grow in one place.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-blue-100">
            Use your role account to access the right workspace for your daily
            work.
          </p>
          <div className="mt-14 space-y-3 text-sm text-blue-50">
            <p>01 &nbsp; Personal dashboard</p>
            <p>02 &nbsp; Role-based tools</p>
            <p>03 &nbsp; Connected learning data</p>
          </div>
        </section>
        <section className="p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-black tracking-[.18em] text-blue-600">
              AI SCHOLAR
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900">
              {register ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {register
                ? "Choose a role and start your workspace."
                : "Sign in to continue to your portal."}
            </p>
          </div>
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            {register && (
              <>
                <label className="block text-sm font-bold text-slate-700">Full name<input name="name" value={form.name} onChange={update} required className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500" placeholder="Your full name" /></label>
                {form.role === "FRANCHISE" && <><label className="block text-sm font-bold text-slate-700">Franchise name<input name="franchiseName" value={form.franchiseName} onChange={update} required className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500" placeholder="Your centre name" /></label><label className="block text-sm font-bold text-slate-700">Phone number<input name="phone" type="tel" inputMode="numeric" maxLength={10} pattern="[0-9]{10}" value={form.phone} onChange={update} required className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500" placeholder="10 digit phone number" /></label></>}
              </>
            )}
            <div>
              <p className="text-sm font-bold text-slate-700">Choose workspace</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {roleOptions.map((option) => { const Icon = option.icon; return <button key={option.value} type="button" onClick={() => setForm((current) => ({ ...current, role: option.value }))} className={`flex h-16 flex-col items-center justify-center gap-1 rounded-xl border text-xs font-bold transition ${form.role === option.value ? "border-blue-600 bg-blue-600 text-white shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}><Icon size={18} />{option.label}</button>; })}
              </div>
            </div>
            <label className="block text-sm font-bold text-slate-700">
              <span className="flex items-center gap-2">
                <Mail size={15} />
                Email
              </span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                required
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500"
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              <span className="flex items-center gap-2">
                <Lock size={15} />
                Password
              </span>
              <input
                name="password"
                type="password"
                minLength="6"
                value={form.password}
                onChange={update}
                required
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500"
                placeholder="Minimum 6 characters"
              />
            </label>
            <button
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : register
                  ? "Create account"
                  : "Sign in"}
              <ArrowRight size={17} />
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setRegister((value) => !value);
              setError("");
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
          >
            <UserPlus size={16} />
            {register
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/login/admin")}
            className="mt-5 block w-full text-center text-xs font-bold text-slate-400 hover:text-blue-600"
          >
            Super admin login
          </button>
        </section>
      </div>
    </div>
  );
};
