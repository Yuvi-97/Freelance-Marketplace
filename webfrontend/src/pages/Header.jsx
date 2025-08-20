import { useEffect, useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [menuOpen, setMenuOpen] = useState(false);

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
    setUsername(null); // Update state to reflect logout
    setRole(null);
    navigate("/"); // Redirect to landing page
  };

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          FreeVerse
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white md:hidden focus:outline-none"
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Nav Links */}
        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } md:flex absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent p-4 md:p-0 z-50`}
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 pd-t">
            {role === "CLIENT" && (
              <>
                <Link
                  to="/client-dashboard"
                  className="text-gray-200 hover:text-indigo-400 transition pt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/post-project"
                  className="text-gray-200 hover:text-indigo-400 transition pt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Post Project
                </Link>
                <Link
                  to="/my-projects"
                  className="text-gray-200 hover:text-indigo-400 transition pt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  My Projects
                </Link>
              </>
            )}

            {role === "FREELANCER" && (
              <>
                <Link
                  to="/freelancer-dashboard"
                  className="text-gray-200 hover:text-emerald-400 transition pt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/job-listings"
                  className="text-gray-200 hover:text-emerald-400 transition pt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  to="/my-applications"
                  className="text-gray-200 hover:text-emerald-400 transition pt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  My Applications
                </Link>
              </>
            )}

            {role === "ADMIN" && (
              <>
                <Link
                  to="/admin-dashboard"
                  className="text-gray-200 hover:text-amber-400 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/manage-users"
                  className="text-gray-200 hover:text-amber-400 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Users
                </Link>
                <Link
                  to="/manage-projects"
                  className="text-gray-200 hover:text-amber-400 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Projects
                </Link>
              </>
            )}

            {/* Auth Section (Mobile inside nav / Desktop outside) */}
            <div className="flex flex-col md:flex-row gap-3">
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
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 text-sm font-medium border border-indigo-400 text-indigo-400 rounded hover:bg-indigo-800 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded hover:bg-indigo-400 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
