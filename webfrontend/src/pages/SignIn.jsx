import axios from "axios";
import { useState } from "react";
import { FiLoader, FiLock, FiMail } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/authbg.jpeg";
import Button from "../component/ui/Button";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Brand / Visual Panel */}
      <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden">
        <img
          src={bgImage}
          alt="Auth visual"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#232c3b]/95 via-[#232c3b]/85 to-[#324155]/80" />
        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-300 via-white to-indigo-200 bg-clip-text text-transparent">
              Build. Collaborate. Grow.
            </span>
          </h1>
          <p className="mt-5 text-sm md:text-base text-gray-200 max-w-md leading-relaxed font-medium">
            A focused space where clients launch ideas and freelancers turn them
            into quality results.
          </p>

          <div className="mt-10 grid gap-4 max-w-sm">
            <div className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 flex items-start gap-3 border border-white/10 shadow-sm">
              <div className="h-2 w-2 mt-2 rounded-full bg-emerald-400"></div>
              <p className="text-sm leading-snug">
                Post projects and track progress effortlessly.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 flex items-start gap-3 border border-white/10 shadow-sm">
              <div className="h-2 w-2 mt-2 rounded-full bg-indigo-400"></div>
              <p className="text-sm leading-snug">
                Discover skilled talent ready to deliver.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 flex items-start gap-3 border border-white/10 shadow-sm">
              <div className="h-2 w-2 mt-2 rounded-full bg-blue-400"></div>
              <p className="text-sm leading-snug">
                Collaborate in a clean, distraction‑free workflow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="md:w-1/2 flex items-center justify-center py-12 px-6 bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-50/95 rounded-2xl shadow-xl border border-gray-200 p-8"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              Sign In
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Access your workspace and continue where you left off
            </p>
          </div>
          {/* Username / Email */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email or Username
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>
          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>
          <div className="flex items-center justify-end mb-6 text-xs">
            <div className="text-indigo-600 font-medium hover:underline cursor-pointer">
              Forgot password?
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg flex items-center justify-center gap-2 font-medium text-sm py-3 transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-center text-sm mt-6 text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
