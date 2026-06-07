import axios from "axios";
import { useEffect, useState } from "react";
import {
    FiAlertCircle,
    FiArrowRight,
    FiBriefcase, FiCheckCircle, FiClock,
    FiStar,
    FiMessageSquare,
    FiTrendingUp
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

function StatCard({ icon, label, value, sub, color = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
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
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  WITHDRAWN: "bg-gray-100 text-gray-600",
};

function FreelancerDashboard() {
  const [freelancer, setFreelancer] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [reviewModal, setReviewModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!userId || !token) return;

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch freelancer profile
        const profileRes = await axios.get(`${API_BASE}/api/freelancers/user/${userId}`, { headers });
        const data = profileRes.data;
        setFreelancer(data);

        // Store freelancerId for other pages
        if (data.id) localStorage.setItem("freelancerId", String(data.id));

        // Check profile completeness
        const isIncomplete = !data.name || !data.skills || !data.bio || !data.hourlyRate;
        if (isIncomplete) setShowProfilePopup(true);

        // Fetch dashboard stats
        const dashRes = await axios.get(`${API_BASE}/api/freelancers/${data.id}/dashboard`, { headers });
        setDashboard(dashRes.data);
      } catch (err) {
        console.error("Failed to load freelancer dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const userId = localStorage.getItem("userId");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Completion Popup */}
      {showProfilePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 to-teal-500"></div>
            <div className="px-8 pt-8 pb-6 border-b border-gray-100">
              <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 border border-emerald-100">
                Profile Completion Required
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
                Complete Your Freelancer Profile
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600 max-w-lg">
                A complete profile helps clients find you, builds trust, and increases your chances of getting hired.
              </p>
            </div>
            <div className="px-8 py-7">
              <div className="space-y-3">
                {!freelancer?.name && (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <FiAlertCircle className="text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Add your full name</span>
                  </div>
                )}
                {!freelancer?.skills && (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <FiAlertCircle className="text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Add your skills</span>
                  </div>
                )}
                {!freelancer?.bio && (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <FiAlertCircle className="text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Write a professional bio</span>
                  </div>
                )}
                {!freelancer?.hourlyRate && (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <FiAlertCircle className="text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Set your hourly rate</span>
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => navigate(`/freelancer/${userId}`)}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all"
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
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {freelancer?.name || localStorage.getItem("username")} 👋
              </h1>
              <p className="mt-1 text-emerald-100">
                {freelancer?.professionalHeadline || "Freelancer Dashboard"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/job-listings"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition"
              >
                <FiBriefcase size={16} /> Find Jobs
              </Link>
              <Link
                to="/my-applications"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 border border-emerald-400 text-white font-semibold rounded-xl hover:bg-emerald-500 transition"
              >
                My Applications
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
            label="Total Applications"
            value={dashboard?.appliedProjectsCount ?? 0}
            sub={`${dashboard?.pendingApplicationsCount ?? 0} pending`}
            color="indigo"
          />
          <StatCard
            icon={<FiTrendingUp size={22} />}
            label="Active Projects"
            value={dashboard?.assignedProjectsCount ?? 0}
            sub="Currently assigned"
            color="blue"
          />
          <StatCard
            icon={<FiCheckCircle size={22} />}
            label="Completed Projects"
            value={dashboard?.completedProjectsCount ?? 0}
            sub="Successfully delivered"
            color="green"
          />
          <StatCard
            icon={<FiStar size={22} />}
            label="Average Rating"
            value={dashboard?.averageRating ? `${dashboard.averageRating} ★` : "No ratings yet"}
            sub={dashboard?.totalReviews ? `${dashboard.totalReviews} review${dashboard.totalReviews !== 1 ? "s" : ""}` : "Be the first to get reviewed"}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assigned / Active Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Active Projects</h2>
              <Link to="/my-applications" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                View all <FiArrowRight size={14} />
              </Link>
            </div>
            {dashboard?.assignedProjects?.length > 0 ? (
              <div className="space-y-4">
                {dashboard.assignedProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      <span className="text-sm font-semibold text-emerald-600">${project.budget}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        ASSIGNED
                      </span>
                      {project.deadline && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FiClock size={12} /> Due: {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      )}
                      {/* Chat button */}
                      <button
                        onClick={() => navigate(`/chat/${project.id}`)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full hover:bg-emerald-200 transition ml-auto"
                      >
                        <FiMessageSquare size={12} /> Chat with Client
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <FiBriefcase className="mx-auto text-gray-300 mb-3" size={36} />
                <p className="text-gray-500 font-medium">No active projects yet</p>
                <p className="text-sm text-gray-400 mt-1">Apply to projects to get started</p>
                <Link
                  to="/job-listings"
                  className="inline-block mt-4 px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
              <Link to="/my-applications" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                View all <FiArrowRight size={14} />
              </Link>
            </div>
            {dashboard?.recentApplications?.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recentApplications.map((app) => (
                  <div key={app.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{app.project?.title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Budget: ${app.project?.budget}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[app.status] || "bg-gray-100 text-gray-600"}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <FiClock className="mx-auto text-gray-300 mb-3" size={36} />
                <p className="text-gray-500 font-medium">No applications yet</p>
                <p className="text-sm text-gray-400 mt-1">Start applying to projects to see them here</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Projects with Review Prompts */}
        {dashboard?.completedProjects?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Completed Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dashboard.completedProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">COMPLETED</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">${project.budget}</p>
                  {/* Prompt to review the client */}
                  <button
                    onClick={() => setReviewModal({ project })}
                    className="mt-3 flex items-center gap-1.5 text-xs text-yellow-600 hover:text-yellow-700 font-medium transition"
                  >
                    <FiStar size={12} /> Rate this client
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Summary */}
        {freelancer && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Profile Summary</h2>
              <Link
                to={`/freelancer/${userId}`}
                className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
              >
                Edit Profile <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Hourly Rate</p>
                <p className="text-gray-900 font-semibold mt-1">
                  {freelancer.hourlyRate ? `$${freelancer.hourlyRate}/hr` : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Experience</p>
                <p className="text-gray-900 font-semibold mt-1">
                  {freelancer.experienceLevel || "Not set"}
                  {freelancer.yearsOfExperience ? ` · ${freelancer.yearsOfExperience} yrs` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Availability</p>
                <p className={`font-semibold mt-1 ${freelancer.availableForWork ? "text-green-600" : "text-red-500"}`}>
                  {freelancer.availableForWork ? "Available for work" : "Not available"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Location</p>
                <p className="text-gray-900 font-semibold mt-1">{freelancer.location || "Not set"}</p>
              </div>
            </div>
            {freelancer.skills && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.split(",").slice(0, 8).map((s, i) => s.trim() && (
                    <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                      {s.trim()}
                    </span>
                  ))}
                  {freelancer.skills.split(",").length > 8 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                      +{freelancer.skills.split(",").length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Modal — freelancer reviews the client after project completion */}
      {reviewModal && reviewModal.project.client && (
        <ReviewModal
          projectId={reviewModal.project.id}
          projectTitle={reviewModal.project.title}
          reviewerId={Number(localStorage.getItem("userId"))}
          clientId={reviewModal.project.client.id}
          targetName={reviewModal.project.client.clientName || reviewModal.project.client.user?.username || "the client"}
          onClose={() => setReviewModal(null)}
          onSubmitted={() => setReviewModal(null)}
        />
      )}
    </div>
  );
}

export default FreelancerDashboard;
