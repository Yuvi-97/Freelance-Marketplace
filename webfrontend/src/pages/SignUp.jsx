import { useState } from "react";
import bgImage from "../assets/authbg.jpeg";
import Button from "../component/ui/Button";

function SignUp() {
  const [role, setRole] = useState("CLIENT");
  const [form, setForm] = useState({
    username: "",
    password: "",
    // Client fields
    clientName: "",
    company: "",
    email: "",
    phone: "",
    // Freelancer fields
    name: "",
    skills: "",
    hourlyRate: "",
    bio: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      };
    }
    alert(JSON.stringify(payload, null, 2));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 bg-white rounded-xl shadow-md flex w-full max-w-4xl overflow-hidden mt-8 mb-8">
        {/* Left: Role selection with text cards */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100 p-8">
          <h3 className="text-xl font-bold mb-6 text-center">
            Choose Account Type
          </h3>
          <div className="flex flex-col space-y-8 w-full">
            <div
              className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-lg border-2 transition shadow-sm w-full
                ${
                  role === "CLIENT"
                    ? "border-blue-600 bg-blue-50 text-blue-700 scale-105"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-blue-100"
                }
              `}
              onClick={() => handleRoleChange("CLIENT")}
            >
              <span className="font-bold text-2xl mb-2">Client</span>
              <span className="text-sm text-center">
                Post jobs, manage projects, and hire top freelancers.
              </span>
            </div>
            <div
              className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-lg border-2 transition shadow-sm w-full
                ${
                  role === "FREELANCER"
                    ? "border-blue-600 bg-blue-50 text-blue-700 scale-105"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-blue-100"
                }
              `}
              onClick={() => handleRoleChange("FREELANCER")}
            >
              <span className="font-bold text-2xl mb-2">Freelancer</span>
              <span className="text-sm text-center">
                Find work, showcase your skills, and grow your career.
              </span>
            </div>
          </div>
        </div>
        {/* Spacer between columns */}
        <div className="w-8 bg-transparent" />
        {/* Right: Form */}
        <form onSubmit={handleSubmit} className="w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Join FreelanceHub
          </h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              className="w-full border rounded px-3 py-2"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full border rounded px-3 py-2"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          {role === "CLIENT" ? (
            <>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="clientName">
                  Name
                </label>
                <input
                  id="clientName"
                  name="clientName"
                  className="w-full border rounded px-3 py-2"
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
                  className="w-full border rounded px-3 py-2"
                  value={form.company}
                  onChange={handleChange}
                  required
                  placeholder="Company name"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="w-full border rounded px-3 py-2"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone number"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="w-full border rounded px-3 py-2"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="skills">
                  Skills
                </label>
                <input
                  id="skills"
                  name="skills"
                  className="w-full border rounded px-3 py-2"
                  value={form.skills}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Java, Spring Boot"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="hourlyRate">
                  Hourly Rate
                </label>
                <input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  required
                  placeholder="50"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  className="w-full border rounded px-3 py-2"
                  value={form.bio}
                  onChange={handleChange}
                  required
                  placeholder="Short bio"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="w-full border rounded px-3 py-2"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone number"
                />
              </div>
            </>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
