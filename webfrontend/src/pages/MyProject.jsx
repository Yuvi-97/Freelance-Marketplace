// src/pages/MyProjects.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSpinner, FaTrash, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProjectCard from "../component/ui/ProjectComponent";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", budget: "" });

  const clientId = localStorage.getItem("clientId");
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchProjects();
  }, [clientId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/projects/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project.id);
    setEditForm({
      title: project.title,
      description: project.description,
      budget: project.budget,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/projects/${editingProject}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

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
          Manage your projects below
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
               Post a Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
              >
                <ProjectCard project={project} />

                {/* Action buttons at bottom */}
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => handleEditClick(project)}
                    className="p-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingProject && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Project</h2>

              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full border rounded p-2 mb-3"
              />

              <label className="block text-gray-700">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full border rounded p-2 mb-3"
              />

              <label className="block text-gray-700">Budget (USD)</label>
              <input
                type="number"
                value={editForm.budget}
                onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                className="w-full border rounded p-2 mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;
