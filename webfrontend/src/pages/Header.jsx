import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function Header() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleLogin = () => {
      setUsername(localStorage.getItem("username"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("login", handleLogin);
    return () => window.removeEventListener("login", handleLogin);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.reload();
  };

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          FreeVerse
        </Link>

        {/* Role-based Navigation */}
        <nav className="flex items-center gap-6">
          {role === "CLIENT" && (
            <>
              <Link to="/client-dashboard" className="text-gray-200 hover:text-indigo-400 transition">
                Dashboard
              </Link>
              <Link to="/post-project" className="text-gray-200 hover:text-indigo-400 transition">
                Post Project
              </Link>
              <Link to="/my-projects" className="text-gray-200 hover:text-indigo-400 transition">
                My Projects
              </Link>
            </>
          )}

          {role === "FREELANCER" && (
            <>
              <Link to="/freelancer-dashboard" className="text-gray-200 hover:text-emerald-400 transition">
                Dashboard
              </Link>
              <Link to="/job-listings" className="text-gray-200 hover:text-emerald-400 transition">
                Find Jobs
              </Link>
              <Link to="/my-applications" className="text-gray-200 hover:text-emerald-400 transition">
                My Applications
              </Link>
            </>
          )}

          {role === "ADMIN" && (
            <>
              <Link to="/admin-dashboard" className="text-gray-200 hover:text-amber-400 transition">
                Dashboard
              </Link>
              <Link to="/manage-users" className="text-gray-200 hover:text-amber-400 transition">
                Users
              </Link>
              <Link to="/manage-projects" className="text-gray-200 hover:text-amber-400 transition">
                Projects
              </Link>
            </>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex gap-3">
          {username ? (
            <>
              <span className="text-white pt-1.5">Welcome, {username}</span>
              <button
                onClick={logoutHandler}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded hover:bg-red-600 transition"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium border border-indigo-400 text-indigo-400 rounded hover:bg-indigo-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded hover:bg-indigo-400 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
