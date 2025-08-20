// src/pages/MyProjects.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import ProjectCard from "../component/ui/ProjectComponent";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8080/api/projects/client/${clientId}`,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-indigo-600" size={32} />
        <p className="ml-3 text-indigo-600 font-medium">Loading Projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          My Posted Projects
        </h1>
        <p className="text-gray-600 mb-8">
          Track your projects and see freelancer engagement at a glance
        </p>

        {projects.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow p-12">
            <p className="text-gray-600 mb-6 text-lg">
              You haven’t posted any projects yet.
            </p>
            <Link
              to="/post-project"
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
            >
              🚀 Post a Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;
