import { useState } from "react";
import bgImage from "../assets/authbg.jpeg";
import Button from "../component/ui/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp({ onUserLoggedIn }) {
  const [role, setRole] = useState("CLIENT");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    clientName: "",
    company: "",
    email: "",
    phone: "",
    name: "",
    skills: "",
    hourlyRate: "",
    bio: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (newRole) => setRole(newRole);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let payload = {
      username: form.username,
      password: form.password,
      role,
    };

    if (role === "CLIENT") {
      payload = {
        ...payload,
        clientName: form.clientName,
        company: form.company,
        email: form.email,
        phone: form.phone,
      };
    } else {
      payload = {
        ...payload,
        name: form.name,
        email: form.email,
        skills: form.skills,
        hourlyRate: parseFloat(form.hourlyRate),
        bio: form.bio,
        phone: form.phone,
      };
    }

    try {
      const res = await axios.post("http://localhost:8080/auth/signup", payload);
      console.log("Signup success:", res.data);

      navigate("/login"); 
    } catch (err) {
      console.error("Signup error:", err);
      alert("Failed to sign up. Please try again.");
    }finally{
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
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Left Side: Welcome Text */}
      <div className="w-1/2 flex flex-col justify-center items-center text-white relative z-10 p-12">
        <h1 className="text-4xl font-bold mb-4">Join FreelanceHub Today</h1>
        <p className="text-lg text-center max-w-md">
          Whether you're a client looking to post jobs or a freelancer ready to
          showcase your skills, FreelanceHub connects talent and opportunity.
        </p>

        <div className="mt-10 w-full max-w-md bg-gray-800 bg-opacity-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Choose Account Type
          </h3>
          <div className="flex justify-center gap-6">
            {["CLIENT", "FREELANCER"].map((type) => (
              <button
                key={type}
                onClick={() => handleRoleChange(type)}
                className={`cursor-pointer px-6 py-3 rounded-lg border-2 font-semibold transition
                  ${
                    role === type
                      ? "border-blue-500 bg-blue-600 text-white scale-105"
                      : "border-gray-400 text-gray-300 hover:border-blue-400 hover:text-white"
                  }
                `}
              >
                {type === "CLIENT" ? "Client" : "Freelancer"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center relative z-10 p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md overflow-auto max-h-[90vh]"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          {/* Role-specific fields */}
          {role === "CLIENT" ? (
            <>
              <div className="mb-4">
                <label
                  className="block mb-1 font-medium"
                  htmlFor="clientName"
                >
                  Name
                </label>
                <input
                  id="clientName"
                  name="clientName"
                  className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                  value={form.clientName}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="company">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                  value={form.company}
                  onChange={handleChange}
                  required
                  placeholder="Company name"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone number"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="skills">
                    Skills
                  </label>
                  <input
                    id="skills"
                    name="skills"
                    className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={form.skills}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Java, Spring Boot"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block mb-1 font-medium"
                    htmlFor="hourlyRate"
                  >
                    Hourly Rate
                  </label>
                  <input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={form.hourlyRate}
                    onChange={handleChange}
                    required
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                  value={form.bio}
                  onChange={handleChange}
                  required
                  placeholder="Short bio"
                />
              </div>
            </>
          )}

        <Button
          type="submit"
          disabled={loading} // Prevent double clicks
          className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg py-2 mt-4 flex items-center justify-center"
        >
          {loading ? (
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
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            "Sign Up"
          )}
        </Button>

        </form>
      </div>
    </div>
  );
}

export default SignUp;
