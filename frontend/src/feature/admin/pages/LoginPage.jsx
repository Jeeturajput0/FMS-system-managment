import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, AlertCircle, ArrowRight, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "../../../utils/api";
import logo from "../../../../assist/logo.png";

export const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const path = isRegister ? "/api/auth/register" : "/api/auth/login";

      const payload = isRegister
        ? {
            name,
            email,
            password,
            role: "SUPER_ADMIN",
          }
        : {
            email,
            password,
          };

      const result = await apiFetch(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!isRegister && !["SUPER_ADMIN", "ADMIN"].includes(result.user.role)) {
        throw new Error("This account belongs to a portal role. Use the normal login page.");
      }

      localStorage.setItem("ai_scholars_token", result.token);

      localStorage.setItem("ai_scholars_user", JSON.stringify(result.user));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Unable to authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#0F172A]
        px-4
        py-8
        font-sans
        text-slate-100
        sm:px-6
      "
    >
      {/* ================= BACKGROUND ================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-96
          w-96
          rounded-full
          bg-orange-500/15
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-40
          h-96
          w-96
          rounded-full
          bg-amber-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-orange-500/5
          blur-3xl
        "
      />

      {/* ================= LOGIN CARD ================= */}

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.45,
          }}
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-slate-800
            bg-slate-900/95
            p-5
            shadow-2xl
            shadow-black/40
            backdrop-blur-xl
            sm:p-8
          "
        >
          {/* ================= LOGO ================= */}

          <div className="mb-8 flex justify-center">
            <div
              className="
                flex
                h-20
                w-full
                items-center
                justify-center
                overflow-hidden
                sm:h-24
              "
            >
              <img
                src={logo}
                alt="AI Scholars"
                className="
                  h-14
                  w-auto
                  max-w-[230px]
                  object-contain
                  sm:h-16
                  sm:max-w-[260px]
                "
              />
            </div>
          </div>

          {/* ================= TITLE ================= */}

          <div className="mb-7 text-center">
            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-white
                sm:text-3xl
              "
            >
              {isRegister ? "Create Admin Account" : "Super Admin Login"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isRegister
                ? "Register a new admin user"
                : "Sign in to access LMS & Franchise OS dashboard"}
            </p>
          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                mb-6
                flex
                items-start
                gap-3
                rounded-xl
                border
                border-red-500/30
                bg-red-500/10
                p-3.5
                text-xs
                font-medium
                text-red-300
              "
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

              <span className="leading-5">{error}</span>
            </motion.div>
          )}

          {/* ================= FORM ================= */}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Name */}
            {isRegister && (
              <div>
                <label
                  htmlFor="name"
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-300
                  "
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserPlus
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                      text-slate-500
                    "
                  />

                  <input
                    id="name"
                    type="text"
                    required={isRegister}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter admin name"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-700
                      bg-slate-800/80
                      pl-10
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-slate-500
                      transition
                      focus:border-orange-500
                      focus:ring-2
                      focus:ring-orange-500/20
                      hover:border-slate-600
                    "
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-300
                "
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  className="
                    absolute
                    left-3.5
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-slate-500
                  "
                />

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aischolar.com"
                  autoComplete="email"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-800/80
                    pl-10
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-500
                    transition
                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-500/20
                    hover:border-slate-600
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-300
                "
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  className="
                    absolute
                    left-3.5
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-slate-500
                  "
                />

                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-800/80
                    pl-10
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-500
                    transition
                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-500/20
                    hover:border-slate-600
                  "
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                mt-2
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-orange-500
                to-amber-600
                px-4
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-orange-500/20
                transition-all
                hover:from-orange-600
                hover:to-amber-600
                hover:shadow-orange-500/30
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLoading ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />

                  <span>
                    {isRegister ? "Creating account..." : "Authenticating..."}
                  </span>
                </>
              ) : (
                <>
                  <span>{isRegister ? "Register Admin" : "Sign In"}</span>

                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* ================= DIVIDER ================= */}

          <div className="relative my-7 flex items-center">
            <div className="w-full border-t border-slate-800" />

            <span
              className="
                absolute
                left-1/2
                -translate-x-1/2
                bg-slate-900
                px-3
                text-xs
                font-medium
                text-slate-500
              "
            >
              OR
            </span>
          </div>

          {/* ================= REGISTER / LOGIN ================= */}

          <button
            type="button"
            onClick={() => setIsRegister((prev) => !prev)}
            className="
              flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              px-4
              text-xs
              font-bold
              text-slate-200
              transition
              hover:border-slate-600
              hover:bg-slate-700
            "
          >
            <UserPlus className="h-4 w-4 text-orange-400" />

            <span>{isRegister ? "Switch to Login" : "Register New Admin"}</span>
          </button>

          {/* ================= FOOTER ================= */}

          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-500">
              AI Scholars • LMS & Franchise OS
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
