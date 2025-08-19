import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaSpinner,
  FaFolderOpen,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8080/client/${clientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [clientId]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 flex items-center gap-1">
            <FaCheckCircle /> Completed
          </span>
        );
      case "in progress":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
            <FaClock /> In Progress
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
            <FaFolderOpen /> Open
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
        <FaSpinner className="animate-spin text-indigo-600" size={32} />
        <p className="ml-3 text-indigo-600 font-medium">Loading Projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#0A2647] mb-10 text-center">
          My Projects
        </h1>

        {projects.length === 0 ? (
          <div className="text-center bg-white/40 backdrop-blur-lg rounded-3xl shadow-lg p-12">
            <p className="text-gray-600 mb-6 text-lg">
              You haven’t posted any projects yet.
            </p>
            <Link
              to="/post-project"
              className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition shadow-lg"
            >
              🚀 Post a Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  {getStatusBadge(project.status)}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Budget:{" "}
                    <span className="font-medium text-gray-800">
                      ₹{project.budget}
                    </span>
                  </p>
                  <Link
                    to={`/project/${project.id}`}
                    className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition shadow-md"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;
