import { useState } from "react";
import bgImage from "../assets/authbg.jpeg";
import Button from "../component/ui/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });

      const { token, userId } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      const userRes = await axios.get(
        `http://localhost:8080/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem("username", userRes.data.username);
      window.dispatchEvent(new Event("login"));

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="w-1/2 flex flex-col justify-center items-center text-white relative z-10 p-12">
        <h1 className="text-4xl font-bold mb-4">
          Sign In & Start Your Journey
        </h1>
        <p className="text-lg text-center max-w-md">
          Join Freeverse today and experience the freedom to create, share, and
          explore. Your ideas, your community, your way.
        </p>
      </div>

      <div className="w-1/2 flex items-center justify-center relative z-10 p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back</h2>
          <p className="text-center mb-6">Sign in to your Freeverse Account</p>

          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="text-right mb-6">
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className={`w-full flex justify-center items-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center text-sm mt-4">
            Don't have an Account?{" "}
            <a
              href="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
