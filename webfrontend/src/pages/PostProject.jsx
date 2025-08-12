import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostProject() {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [createdDate, setCreatedDate] = useState("");
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-fill created date
    setCreatedDate(new Date().toISOString().split("T")[0]);

    // Get client ID from localStorage
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setClientId(parseInt(storedId, 10));
    } else {
      alert("You must be logged in as a client to post a project.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title || !description || !budget || !deadline) {
      alert("Please fill in all required fields.");
      return;
    }
    if (budget <= 0) {
      alert("Budget must be a positive number.");
      return;
    }

    const projectData = {
      title,
      description,
      budget: parseFloat(budget),
      deadline,
      status,
      createdDate,
      client: { id: clientId },
    };

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/projects", projectData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Project posted successfully!");
      navigate("/my-projects");
    } catch (err) {
      console.error("Error posting project:", err);
      alert("Failed to post project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Post a Project</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Title *</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Description *</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Budget (USD) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full border rounded px-3 py-2"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>

        {/* Deadline */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Deadline *</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Status</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Created Date</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={createdDate}
            readOnly
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Client ID</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={clientId || ""}
            readOnly
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
        >
          {loading ? "Posting..." : "Post Project"}
        </button>
      </form>
    </div>
  );
}

export default PostProject;
