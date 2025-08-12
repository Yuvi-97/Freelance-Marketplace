import React from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function Header() {
  const username = localStorage.getItem("username");
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          FreeVerse
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-200 hover:text-blue-300 transition">
            Home
          </Link>
          <Link to="/find-work" className="text-gray-200 hover:text-blue-300 transition">
            Find Work
          </Link>
          <Link to="/post-job" className="text-gray-200 hover:text-blue-300 transition">
            Post a Job
          </Link>
          <Link to="/about" className="text-gray-200 hover:text-blue-300 transition">
            About
          </Link>
        </nav>

       <div className="flex gap-3">
          {username ? (
            <>
              <span className="text-white pt-1.5">Welcome, {username}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  window.location.reload(); 
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded hover:bg-blue-700 transition"
              >
                <FiLogOut size={18}/>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium border border-blue-400 text-blue-400 rounded hover:bg-blue-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-400 transition"
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
