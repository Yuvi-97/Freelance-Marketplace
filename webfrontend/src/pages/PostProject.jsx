import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategorySelector from "../component/ui/CategorySelector";

function PostProject() {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [categories, setCategories] = useState([]);
  const [otherCategory, setOtherCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const [message, setMessage] = useState({ text: "", type: "" });

  const categoryOptions = [
    "Web Development",
    "Mobile Development",
    "Design & Creative",
    "Writing & Translation",
    "Digital Marketing",
    "Data Science",
    "DevOps & Cloud",
    "Other",
  ];

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (!storedId) {
      setMessage({
        text: "You must be logged in as a client to post a project.",
        type: "error",
      });
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !budget || !deadline) {
      setMessage({
        text: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }
    if (budget <= 0) {
      setMessage({ text: "Budget must be a positive number.", type: "error" });
      return;
    }

    let finalCategories = categories.filter((cat) => cat !== "Other");
    if (categories.includes("Other") && otherCategory.trim() !== "") {
      finalCategories.push(otherCategory.trim());
    }

    const clientId = localStorage.getItem("userId");

    const projectData = {
      title,
      description,
      budget: parseFloat(budget),
      deadline,
      status,
      createdDate: new Date().toISOString().split("T")[0],
      categories: finalCategories,
      client: { id: clientId },
    };

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/api/projects`, projectData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessage({ text: "✅ Project posted successfully!", type: "success" });
      setTimeout(() => navigate("/my-projects"), 1500);
    } catch (err) {
      console.error("Error posting project:", err);

      if (err.response?.status === 401) {
        setMessage({
          text: "⚠️ Unauthorized. Please login to continue.",
          type: "error",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage({
          text: "❌ Failed to post project. Please try again.",
          type: "error",
        });
      }
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
        <h2 className="text-2xl font-bold mb-6 text-blue-800">
          Post a Project
        </h2>

        {/* Inline message */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Title */}
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

        {/* Budget */}
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

        {/* Status */}
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

        {/* Categories */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Categories *</label>
          <CategorySelector onChange={setCategories} />
        </div>

        {/* Submit */}
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
