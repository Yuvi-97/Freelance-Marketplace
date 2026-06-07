import axios from "axios";
import { useEffect, useState } from "react";
import { FiArrowRight, FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

/**
 * MyChats — lists all projects the current user can chat in.
 * For CLIENTS  → projects they own that are ASSIGNED or IN_PROGRESS.
 * For FREELANCERS → projects assigned to them that are ASSIGNED or IN_PROGRESS.
 */
export default function MyChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      try {
        let projects = [];

        if (role === "CLIENT") {
          const clientId = localStorage.getItem("clientId");
          if (!clientId) return;
          const res = await axios.get(`${API_BASE}/api/projects/client/${clientId}`, { headers });
          projects = res.data;
        } else if (role === "FREELANCER") {
          const freelancerId = localStorage.getItem("freelancerId");
          if (!freelancerId) return;
          const res = await axios.get(`${API_BASE}/api/projects/freelancer/${freelancerId}`, { headers });
          projects = res.data;
        }

        // Only keep projects where chat is active
        setChats(projects.filter(p => p.status === "ASSIGNED" || p.status === "IN_PROGRESS"));
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FiMessageSquare size={24} className="text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Active conversations on your projects
            </p>
          </div>
        </div>

        {chats.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <FiMessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-gray-600 font-medium text-lg">No active chats</h3>
            <p className="text-sm text-gray-400 mt-2">
              {role === "CLIENT"
                ? "Assign a freelancer to a project to start chatting."
                : "You'll be able to chat once a client assigns you to a project."}
            </p>
            {role === "CLIENT" && (
              <Link
                to="/my-projects"
                className="inline-block mt-5 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Go to My Projects
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map(project => {
              const other = role === "CLIENT"
                ? project.assignedFreelancer?.name || "Freelancer"
                : project.client?.clientName || project.client?.user?.username || "Client";

              const otherAvatar = role === "CLIENT"
                ? (project.assignedFreelancer?.profileUrl || null)
                : (project.client?.profileUrl || null);

              return (
                <Link
                  key={project.id}
                  to={`/chat/${project.id}`}
                  className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition group"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0 overflow-hidden">
                    {otherAvatar
                      ? <img src={otherAvatar} alt={other} className="w-full h-full object-cover" />
                      : other.charAt(0).toUpperCase()
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{other}</p>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{project.title}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                      project.status === "ASSIGNED" ? "bg-purple-100 text-purple-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Arrow */}
                  <FiArrowRight
                    size={18}
                    className="text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0"
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
