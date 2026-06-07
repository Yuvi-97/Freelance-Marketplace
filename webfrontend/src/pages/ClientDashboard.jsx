import axios from "axios";
import { useEffect, useState } from "react";
import {
    FiArrowRight, FiBriefcase, FiCheckCircle, FiClock,
    FiMessageSquare, FiPlusCircle, FiTrendingUp, FiUsers
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

function StatCard({ icon, label, value, sub, color = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  OPEN: "bg-blue-100 text-blue-700",
  ASSIGNED: "bg-purple-100 text-purple-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const APP_STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

function ClientDashboard() {
  const [client, setClient] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!userId || !token) return;

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch client profile
        const profileRes = await axios.get(`${API_BASE}/api/clients/user/${userId}`, { headers });
        const data = profileRes.data;
        setClient(data);

        // Store clientId for other pages
        if (data.id) localStorage.setItem("clientId", String(data.id));

        // Check profile completeness
        const isIncomplete = !data.clientName || !data.companyName || !data.phone;
        if (isIncomplete) setShowProfilePopup(true);

        // Fetch dashboard stats
        const dashRes = await axios.get(`${API_BASE}/api/clients/${data.id}/dashboard`, { headers });
        setDashboard(dashRes.data);
      } catch (err) {
        console.error("Failed to load client dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const userId = localStorage.getItem("userId");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Completion Popup */}
      {showProfilePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-gray-100">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mt-2">Complete Your Profile</h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Add your company details and contact information to build trust with freelancers.
              </p>
              <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-indigo-700 mb-3 uppercase tracking-wide">Missing Information</h3>
                <div className="flex flex-wrap gap-2">
                  {!client?.clientName && (
                    <span className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-sm text-gray-700">Full Name</span>
                  )}
                  {!client?.companyName && (
                    <span className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-sm text-gray-700">Company Name</span>
                  )}
                  {!client?.phone && (
                    <span className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-sm text-gray-700">Phone Number</span>
                  )}
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => navigate(`/client/${userId}`)}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-2xl font-semibold shadow-lg transition-all"
                >
                  Complete Profile
                </button>
                <button
                  onClick={() => setShowProfilePopup(false)}
                  className="px-5 py-3 rounded-2xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {client?.clientName || localStorage.getItem("username")} 👋
              </h1>
              <p className="mt-1 text-indigo-200">
                {client?.companyName ? `${client.companyName}` : "Client Dashboard"}
                {client?.industry ? ` · ${client.industry}` : ""}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/post-project"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition"
              >
                <FiPlusCircle size={16} /> Post Project
              </Link>
              <Link
                to="/my-projects"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 border border-indigo-400 text-white font-semibold rounded-xl hover:bg-indigo-500 transition"
              >
                My Projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={<FiBriefcase size={22} />}
            label="Total Projects Posted"
            value={dashboard?.totalProjectsPosted ?? 0}
            sub={`${dashboard?.openProjectsCount ?? 0} currently open`}
            color="indigo"
          />
          <StatCard
            icon={<FiTrendingUp size={22} />}
            label="Active / Assigned"
            value={dashboard?.assignedProjectsCount ?? 0}
            sub="Freelancer assigned"
            color="purple"
          />
          <StatCard
            icon={<FiCheckCircle size={22} />}
            label="Completed Projects"
            value={dashboard?.completedProjectsCount ?? 0}
            sub="Successfully delivered"
            color="green"
          />
          <StatCard
            icon={<FiUsers size={22} />}
            label="Total Applicants"
            value={dashboard?.totalApplicantsCount ?? 0}
            sub="Across all projects"
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Projects</h2>
              <Link to="/my-projects" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                View all <FiArrowRight size={14} />
              </Link>
            </div>
            {dashboard?.recentProjects?.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      <span className="text-sm font-semibold text-indigo-600">${project.budget}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[project.status] || "bg-gray-100 text-gray-600"}`}>
                        {project.status}
                      </span>
                      {project.deadline && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FiClock size={12} /> Due: {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {project.assignedFreelancer && (
                      <p className="text-xs text-gray-500 mt-2">
                        Assigned to:{" "}
                        <Link
                          to={`/freelancer/${project.assignedFreelancer.user?.id || project.assignedFreelancer.id}`}
                          className="font-medium text-indigo-600 hover:underline"
                        >
                          {project.assignedFreelancer.name}
                        </Link>
                      </p>
                    )}
                    {(project.status === "ASSIGNED" || project.status === "IN_PROGRESS") && (
                      <button
                        onClick={() => navigate(`/chat/${project.id}`)}
                        className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition"
                      >
                        <FiMessageSquare size={12} /> Open Chat
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <FiBriefcase className="mx-auto text-gray-300 mb-3" size={36} />
                <p className="text-gray-500 font-medium">No projects posted yet</p>
                <Link
                  to="/post-project"
                  className="inline-block mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Post Your First Project
                </Link>
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
              <Link to="/my-projects" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                Manage <FiArrowRight size={14} />
              </Link>
            </div>
            {dashboard?.recentApplications?.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recentApplications.map((app) => (
                  <div key={app.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">{app.freelancer?.name || "Freelancer"}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Applied to: <span className="font-medium">{app.project?.title}</span>
                        </p>
                        {app.freelancer?.skills && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                            Skills: {app.freelancer.skills}
                          </p>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${APP_STATUS_STYLES[app.status] || "bg-gray-100 text-gray-600"}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <FiUsers className="mx-auto text-gray-300 mb-3" size={36} />
                <p className="text-gray-500 font-medium">No applications yet</p>
                <p className="text-sm text-gray-400 mt-1">Post a project to start receiving applications</p>
              </div>
            )}
          </div>
        </div>

        {/* Company Info Summary */}
        {client && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Company Overview</h2>
              <Link
                to={`/client/${userId}`}
                className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
              >
                Edit Profile <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Company</p>
                <p className="text-gray-900 font-semibold mt-1">{client.companyName || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Industry</p>
                <p className="text-gray-900 font-semibold mt-1">{client.industry || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Company Size</p>
                <p className="text-gray-900 font-semibold mt-1">{client.companySize || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Location</p>
                <p className="text-gray-900 font-semibold mt-1">{client.location || "Not set"}</p>
              </div>
            </div>
            {client.companyDescription && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">About</p>
                <p className="text-sm text-gray-600 line-clamp-3">{client.companyDescription}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
