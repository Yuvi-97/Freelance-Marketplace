import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Freeverse</h2>
          <p className="text-sm">
            Connecting talented freelancers with clients worldwide.  
            Find work, post jobs, and grow your career.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/find-work" className="hover:text-white transition">Find Work</Link></li>
            <li><Link to="/post-job" className="hover:text-white transition">Post a Job</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-2">
            <li>Email: support@freelancehub.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: Coimbatore, India</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Freeverse. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
