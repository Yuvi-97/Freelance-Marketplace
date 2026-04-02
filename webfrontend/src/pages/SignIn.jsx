import axios from "axios";
import { useState } from "react";
import { FiLoader, FiLock, FiMail, FiCheck } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/authbg.jpeg";
import Button from "../component/ui/Button";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        username,
        password,
      });
      const { token, userId } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // fetch role
      const userRes = await axios.get(`${API_BASE}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { username: fetchedUsername, role } = userRes.data;
      localStorage.setItem("username", fetchedUsername);
      localStorage.setItem("role", role);

      // fetch and store profile ids (use JWT). try freelancer then client.
      const headers = { Authorization: `Bearer ${token}` };

      // FREELANCER ID (uses /api/freelancers/user/{userId})
      try {
        const fr = await axios.get(
          `${API_BASE}/api/freelancers/user/${userId}`,
          { headers }
        );
        console.log("Freelancer lookup:", fr.status, fr.data);
        const fid = fr?.data?.id;
        if (Number.isFinite(Number(fid))) {
          localStorage.setItem("freelancerId", String(fid));
        } else {
          console.warn("No freelancer id in response");
          localStorage.removeItem("freelancerId");
        }
      } catch (err) {
        console.error(
          "Freelancer lookup failed:",
          err?.response?.status,
          err?.response?.data || err.message
        );
        localStorage.removeItem("freelancerId");
      }

      // CLIENT ID (still /api/clients/user/{userId})
      try {
        const cl = await axios.get(`${API_BASE}/api/clients/user/${userId}`, {
          headers,
        });
        console.log("Client lookup:", cl.status, cl.data);
        const cid = cl?.data?.id;
        if (Number.isFinite(Number(cid))) {
          localStorage.setItem("clientId", String(cid));
        } else {
          console.warn("No client id in response");
          localStorage.removeItem("clientId");
        }
      } catch (err) {
        console.error(
          "Client lookup failed:",
          err?.response?.status,
          err?.response?.data || err.message
        );
        localStorage.removeItem("clientId");
      }

      console.log("SignIn stored IDs:", {
        userId,
        role,
        freelancerId: localStorage.getItem("freelancerId"),
        clientId: localStorage.getItem("clientId"),
      });

      if (role === "CLIENT") navigate("/client-dashboard");
      else if (role === "FREELANCER") navigate("/freelancer-dashboard");
      else navigate("/");

      window.dispatchEvent(new Event("login"));
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.response?.data || "Login failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Brand / Visual Panel */}
      <div className="relative hidden md:flex md:w-1/2 overflow-hidden bg-indigo-900">
        <img
          src={bgImage}
          alt="Auth visual"
          className="w-full h-full object-cover mix-blend-overlay opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 flex flex-col justify-center p-12 lg:p-20 text-white">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="text-indigo-200">Build.</span>{" "}
            <span className="text-indigo-100">Collaborate.</span>{" "}
            <span className="text-white">Grow.</span>
          </h1>
          <p className="text-lg text-indigo-200/90 max-w-md leading-relaxed font-light mb-12">
            The premier marketplace for top-tier freelancers and visionary clients to build the future together.
          </p>

          <div className="flex flex-col gap-5 max-w-md">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-400/20 flex items-center justify-center border border-emerald-400/30">
                <FiCheck className="text-emerald-300 text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Post & Track</h3>
                <p className="text-indigo-200 text-sm mt-0.5">Manage projects effortlessly.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ml-6">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-400/20 flex items-center justify-center border border-blue-400/30">
                <FiCheck className="text-blue-300 text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Discover Talent</h3>
                <p className="text-indigo-200 text-sm mt-0.5">Find people ready to deliver.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-6 sm:px-12 lg:px-24 bg-white min-h-screen border-l border-gray-100 shadow-[-20px_0_40px_rgb(0,0,0,0.02)] relative z-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Please enter your details to sign in.
            </p>
          </div>

          {/* Social Login */}
          <button
            type="button"
            onClick={() => console.log("Google Login Clicked")}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm mb-6"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          <div className="flex items-center mb-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-500 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Username / Email */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email or Username
            </label>
            <div className="relative group">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your email or username"
                className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative group">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-8">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded border border-gray-300 bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                <FiCheck className="absolute text-white text-[10px] opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl flex items-center justify-center gap-2 font-semibold text-sm py-3 transition-all shadow-md hover:shadow-lg ${
              loading
                ? "bg-indigo-400 cursor-not-allowed shadow-none hover:shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin text-lg" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center text-sm mt-8 text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
