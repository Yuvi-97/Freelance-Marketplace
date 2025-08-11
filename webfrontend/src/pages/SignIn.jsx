import { useState } from "react";
import bgImage from "../assets/authbg.jpeg";
import Button from "../component/ui/Button";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with your login logic (API call)
    alert(`Email: ${email}\nPassword: ${password}`);
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
        <h1 className="text-4xl font-bold mb-4">Sign In & Start Your Journey</h1>
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
            <label className="block mb-1 font-medium" htmlFor="email">
              Username
            </label>
            <input
              id="email"
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
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

          {/* Forgot Password */}
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
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign In
          </Button>

          {/* Sign Up Link */}
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
