import axios from "axios";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FiBriefcase,
  FiCheck,
  FiLoader,
  FiLock,
  FiMail,
  FiUser,
  FiUserCheck,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/authbg.jpeg";
import Button from "../component/ui/Button";

function SignUp() {
  const [role, setRole] = useState("CLIENT");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(score, 4); // Max score 4
  };

  const strength = calculateStrength(form.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-600"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return;

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/auth/signup`, {
        username: form.username,
        email: form.email,
        password: form.password,
        role,
      });
      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.response?.data || err.message;
      alert(msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Visual / Brand Panel */}
      <div className="relative hidden md:flex md:w-1/2 overflow-hidden bg-indigo-900 border-r border-indigo-800/30 shadow-[20px_0_40px_rgb(0,0,0,0.1)] z-20">
        <img src={bgImage} alt="Brand" className="w-full h-full object-cover mix-blend-overlay opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 flex flex-col justify-center p-12 lg:p-20 text-white">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="text-indigo-200">Join.</span>{" "}
            <span className="text-indigo-100">Create.</span>{" "}
            <span className="text-white">Elevate.</span>
          </h1>
          <p className="text-lg text-indigo-200/90 max-w-md leading-relaxed font-light mb-10">
            A modern space where brilliant ideas seamlessly meet the extraordinary talent needed to bring them to life.
          </p>

          <div className="flex flex-col gap-4 max-w-md">
            {[
              { color: "text-emerald-300", bg: "bg-emerald-400/20", border: "border-emerald-400/30", text: "Connect with the right people fast.", title: "Networking" },
              { color: "text-blue-300", bg: "bg-blue-400/20", border: "border-blue-400/30", text: "Grow your network and opportunities.", title: "Growth", margin: "ml-4" },
              { color: "text-indigo-300", bg: "bg-indigo-400/20", border: "border-indigo-400/30", text: "Manage work in a focused interface.", title: "Productivity", margin: "ml-8" },
            ].map((f, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${f.margin || ""}`}
              >
                <div className={`flex-shrink-0 h-10 w-10 rounded-full ${f.bg} flex items-center justify-center border ${f.border}`}>
                  <FiCheck className={`${f.color} text-lg`} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{f.title}</h3>
                  <p className="text-indigo-200 text-sm mt-0.5">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-24 bg-white min-h-screen relative z-10 overflow-y-auto overflow-x-hidden">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white pt-4 pb-4 px-6 sm:px-8"
        >
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Create your account
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Join thousands of professionals and clients today.
            </p>
          </div>

          {/* Social Sign Up */}
          <button
            type="button"
            onClick={() => console.log("Google Signup Clicked")}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm mb-5"
          >
            <FcGoogle className="text-lg" />
            Sign up with Google
          </button>

          <div className="flex items-center mb-5">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-500 font-medium">OR REGISTER WITH EMAIL</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => setRole("CLIENT")}
              className={`group flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 text-sm font-semibold transition-all ${role === "CLIENT"
                ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-gray-50"
                }`}
            >
              <FiBriefcase className={`text-xl ${role === "CLIENT" ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-400"}`} />
              I'm a Client
            </button>
            <button
              type="button"
              onClick={() => setRole("FREELANCER")}
              className={`group flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 text-sm font-semibold transition-all ${role === "FREELANCER"
                ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-gray-50"
                }`}
            >
              <FiUserCheck className={`text-xl ${role === "FREELANCER" ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-400"}`} />
              I'm a Freelancer
            </button>
          </div>

          <div className="space-y-4 mb-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative group">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="e.g. johndoe123"
                  className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative group">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 h-1.5 w-full">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 rounded-full transition-colors duration-300 ${strength >= level ? strengthColors[strength - 1] : "bg-gray-200"
                          }`}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      {strength > 0 ? strengthLabels[strength - 1] : ""}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative group">
                <FiLock className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errorMsg ? 'text-red-400' : 'text-gray-400 group-focus-within:text-indigo-500'} transition-colors`} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-white pl-10 pr-4 py-2 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 ${errorMsg
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    }`}
                />
              </div>
              {errorMsg && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errorMsg}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl flex items-center justify-center gap-2 font-semibold text-sm py-3 mt-4 transition-all shadow-md hover:shadow-lg ${loading
              ? "bg-indigo-400 cursor-not-allowed shadow-none hover:shadow-none"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin text-lg" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm mt-2 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Sign in Instead
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;