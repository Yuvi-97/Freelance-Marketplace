import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiBriefcase,
  FiUserCheck,
  FiLoader,
} from "react-icons/fi";
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
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return;
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Visual / Brand Panel */}
      <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden">
        <img src={bgImage} alt="Brand" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#232c3b]/95 via-[#232c3b]/85 to-[#324155]/80" />
        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-200 via-white to-indigo-300 bg-clip-text text-transparent">
              Join. Create. Elevate.
            </span>
          </h1>
          <p className="mt-5 text-sm md:text-base text-gray-200 max-w-md leading-relaxed font-medium">
            A modern space where ideas meet the talent that powers them.
          </p>
          <div className="mt-10 grid gap-4 max-w-sm">
            {[
              { dot: "bg-emerald-400", text: "Connect with the right people fast." },
              { dot: "bg-indigo-400", text: "Grow your network and opportunities." },
              { dot: "bg-blue-400", text: "Manage work in a focused interface." },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 flex items-start gap-3 border border-white/10 shadow-sm"
              >
                <div className={`h-2 w-2 mt-2 rounded-full ${f.dot}`}></div>
                <p className="text-sm leading-snug">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="md:w-1/2 flex items-center justify-center py-12 px-6 bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-50/95 rounded-2xl shadow-xl border border-gray-200 p-8"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              Create Your Account
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Just the basics to get started
            </p>
          </div>

          {/* Role Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setRole("CLIENT")}
                className={`group flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${
                  role === "CLIENT"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : "border-gray-300 bg-white hover:border-indigo-400"
                }`}
              >
                <FiBriefcase
                  className={`text-xl ${
                    role === "CLIENT"
                      ? "text-white"
                      : "text-indigo-500 group-hover:text-indigo-600"
                  }`}
                />
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole("FREELANCER")}
                className={`group flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${
                  role === "FREELANCER"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : "border-gray-300 bg-white hover:border-indigo-400"
                }`}
              >
                <FiUserCheck
                  className={`text-xl ${
                    role === "FREELANCER"
                      ? "text-white"
                      : "text-indigo-500 group-hover:text-indigo-600"
                  }`}
                />
                Freelancer
              </button>
            </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="uniquehandle"
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 rounded-lg flex items-center justify-center gap-2 font-medium text-sm py-3 transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;