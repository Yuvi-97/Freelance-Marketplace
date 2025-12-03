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
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage({
        text: "You must be logged in as a client to post a project.",
        type: "error",
      });
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    const fetchClientProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/clients/user/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res?.data?.id) {
          localStorage.setItem("clientId", String(res.data.id));
          console.log("Resolved clientId:", res.data.id);
        } else {
          console.warn("Client profile response missing id:", res?.data);
        }
      } catch (err) {
        console.error(
          "Client profile not found",
          err.response?.data || err.message
        );
        setMessage({
          text: "Client profile not found. Please complete your client profile before posting.",
          type: "error",
        });
        // don't navigate away here; allow user to see message (or navigate if you prefer)
      }
    };

    fetchClientProfile();
  }, [API_BASE, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !budget || !deadline) {
      setMessage({
        text: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }
    if (parseFloat(budget) <= 0) {
      setMessage({ text: "Budget must be a positive number.", type: "error" });
      return;
    }

    const clientId = localStorage.getItem("userId");
    if (!clientId) {
      setMessage({
        text: "You must be logged in to post a project.",
        type: "error",
      });
      navigate("/login");
      return;
    }

    const finalCategories = categories.filter((cat) => cat !== "Other");
    if (categories.includes("Other") && otherCategory.trim() !== "") {
      finalCategories.push(otherCategory.trim());
    }

    // FIX 3: convert deadline to local date string (YYYY-MM-DD)
    const deadlineLocal = new Date(deadline).toISOString().split("T")[0];
    const clientProfileId = localStorage.getItem("clientId");

    const projectData = {
      title,
      description,
      budget: parseFloat(budget),
      deadline: deadlineLocal,
      status,
      categories: finalCategories,
      client: { id: parseInt(clientProfileId) },
    };

    console.log("POST URL:", `${API_BASE}/api/projects`);
    console.log("projectData:", projectData);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE}/api/projects`, projectData, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      console.log("Project created:", res.data);
      setMessage({ text: "✅ Project posted successfully!", type: "success" });
      setTimeout(() => navigate("/my-projects"), 1500);
    } catch (err) {
      console.error("Error posting project:", err);
      // show server response to find validation message
      console.error("server response data:", err.response?.data);
      setMessage({
        text:
          err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          "❌ Failed to post project. Please try again.",
        type: "error",
      });
      if (err.response?.status === 401) {
        setTimeout(() => navigate("/login"), 2000);
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
