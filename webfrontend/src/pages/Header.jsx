import { useEffect, useRef, useState } from "react";
import {
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiSettings,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);

  const profileUrl = localStorage.getItem("profileUrl");
  const userId = localStorage.getItem("userId"); // ensure you store this at login

  // Dynamic profile path based on role
  const profilePath =
    role === "FREELANCER"
      ? `/freelancer/${userId}`
      : role === "CLIENT"
      ? `/client/${userId}`
      : "/admin-dashboard"; // fallback for admin or unknown

  useEffect(() => {
    const handleLogin = () => {
      setUsername(localStorage.getItem("username"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("login", handleLogin);
    return () => window.removeEventListener("login", handleLogin);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !avatarButtonRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("profileUrl");
    localStorage.removeItem("userId");
    setUsername(null);
    setRole(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const avatarContent = profileUrl ? (
    <img
      src={profileUrl}
      alt="Profile"
      className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500"
    />
  ) : (
    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold border-2 border-indigo-400">
      {username ? username.charAt(0).toUpperCase() : "U"}
    </div>
  );

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          FreeVerse
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white md:hidden focus:outline-none"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } md:flex absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent p-4 md:p-0 z-40`}
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center">
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
                  className="text-gray-200 hover:text-amber-400 transition pt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/manage-users"
                  className="text-gray-200 hover:text-amber-400 transition pt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Users
                </Link>
                <Link
                  to="/manage-projects"
                  className="text-gray-200 hover:text-amber-400 transition pt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Projects
                </Link>
              </>
            )}

            <div className="flex flex-col md:flex-row gap-3 md:items-center relative">
              {username ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="hidden md:inline text-sm font-medium text-gray-200">
                      Welcome, <span className="text-white font-semibold">{username}</span>
                    </span>
                    <button
                      ref={avatarButtonRef}
                      type="button"
                      onClick={() => setDropdownOpen((o) => !o)}
                      className="flex items-center gap-2 focus:outline-none group"
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                    >
                      {avatarContent}
                      <FiChevronDown
                        className={`text-gray-300 text-sm transition ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {dropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute md:right-0 top-14 md:top-12 w-60 bg-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-white truncate">
                          {username}
                        </p>
                        {role && (
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-indigo-600 text-white">
                            {role}
                          </span>
                        )}
                      </div>
                      <ul className="py-1 text-sm text-gray-200">
                        <li>
                          <Link
                            to={profilePath}
                            onClick={() => {
                              setDropdownOpen(false);
                              setMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition"
                          >
                            <FiUser className="text-indigo-400" />
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/settings"
                            onClick={() => {
                              setDropdownOpen(false);
                              setMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition"
                          >
                            <FiSettings className="text-indigo-400" />
                            Settings
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/notifications"
                            onClick={() => {
                              setDropdownOpen(false);
                              setMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition"
                          >
                            <FiBell className="text-indigo-400" />
                            Notifications
                          </Link>
                        </li>
                      </ul>
                      <button
                        onClick={logoutHandler}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition flex items-center gap-3"
                      >
                        <FiLogOut />
                        Logout
                      </button>
                    </div>
                  )}
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