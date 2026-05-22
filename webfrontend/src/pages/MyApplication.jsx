import axios from "axios";
import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiDollarSign } from "react-icons/fi";
import { Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  ACCEPTED: "bg-green-100 text-green-700 border border-green-200",
  REJECTED: "bg-red-100 text-red-700 border border-red-200",
  WITHDRAWN: "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        let freelancerId = localStorage.getItem("freelancerId");

        if (!freelancerId) {
          const userId = localStorage.getItem("userId");
          if (!userId) { setLoading(false); return; }
          const res = await axios.get(`${API_BASE}/api/freelancers/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          freelancerId = res.data?.id;
          if (freelancerId) localStorage.setItem("freelancerId", String(freelancerId));
        }

        if (!freelancerId) { setLoading(false); return; }

        const res = await axios.get(`${API_BASE}/api/applications/freelancer/${freelancerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filtered = filter === "ALL" ? applications : applications.filter(a => a.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-500 text-sm mt-1">{applications.length} total application{applications.length !== 1 ? "s" : ""}</p>
          </div>
          <Link to="/job-listings" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition">
            Browse More Jobs
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === status ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"}`}
            >
              {status}
              {status !== "ALL" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({applications.filter(a => a.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 font-medium">No applications found</p>
            {filter !== "ALL" && (
              <button onClick={() => setFilter("ALL")} className="mt-3 text-sm text-emerald-600 hover:underline">
                Show all applications
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">{app.project?.title}</h2>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{app.project?.description}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiDollarSign size={14} /> ${app.project?.budget}
                      </span>
                      {app.project?.deadline && (
                        <span className="flex items-center gap-1">
                          <FiCalendar size={14} /> Due: {new Date(app.project.deadline).toLocaleDateString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiClock size={14} /> Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {app.project?.categories?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {app.project.categories.map(cat => (
                          <span key={cat} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{cat}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${STATUS_STYLES[app.status] || "bg-gray-100 text-gray-600"}`}>
                    {app.status}
                  </span>
                </div>
                {app.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Your Cover Letter</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{app.coverLetter}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
