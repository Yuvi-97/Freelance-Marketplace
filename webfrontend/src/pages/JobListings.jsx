import axios from "axios";
import { useEffect, useState } from "react";

function JobListings() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("Most Relevant");
  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token"); // get JWT token
      const res = await axios.get(`${API_BASE}/api/projects/all`, {
        headers: {
          Authorization: `Bearer ${token}`, // send JWT in header
        },
      });
      console.log("Fetched projects:", res.data);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // inside JobListings component
  const handleAcceptProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const freelancerId = localStorage.getItem("freelancerId"); // assume stored after login

      const res = await axios.put(
        `${API_BASE}/api/projects/${projectId}/accept?freelancerId=${freelancerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Project accepted:", res.data);

      fetchProjects();
      // alert("You have successfully applied for this project!");
    } catch (err) {
      console.error("Error accepting project:", err);
      alert("Failed to apply. Please try again.");
    }
  };

  // Filtered & sorted projects
  const filteredProjects = projects
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (category ? p.categories.includes(category) : true))
    .sort((a, b) => {
      if (sort === "Newest")
        return new Date(b.createdDate) - new Date(a.createdDate);
      if (sort === "Highest Budget") return b.budget - a.budget;
      return 0; // Most Relevant
    });

  const categoriesList = [
    "Web Development",
    "Mobile Development",
    "Design & Creative",
    "Writing & Translation",
    "Digital Marketing",
    "Data Science",
    "DevOps & Cloud",
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900">
          Find Your Next Project
        </h1>
        <p className="text-gray-600 mt-1">
          Discover projects from clients around the world
        </p>
      </div>

      <div className="max-w-7xl mx-auto mt-8 flex gap-8">
        {/* Filters */}
        <div className="w-1/4 border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="font-semibold mb-4">Filters</h2>

          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm mb-6"
          />

          <h3 className="font-medium mb-2">Category</h3>
          {categoriesList.map((cat) => (
            <div key={cat} className="mb-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                  className="accent-blue-600"
                />
                {cat}
              </label>
            </div>
          ))}
          <div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                value=""
                checked={category === ""}
                onChange={() => setCategory("")}
                className="accent-blue-600"
              />
              All Categories
            </label>
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">
              {filteredProjects.length} projects found
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg px-3 py-1 text-sm"
            >
              <option>Most Relevant</option>
              <option>Newest</option>
              <option>Highest Budget</option>
            </select>
          </div>

          <div className="space-y-6">
            {" "}
            {/* replaces grid */}
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="border rounded-xl p-6 bg-white shadow hover:shadow-lg transition"
              >
                {/* Title + Budget */}
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">
                    {proj.title}
                  </h2>
                  <span className="text-green-600 font-semibold">
                    ${proj.budget}
                  </span>
                </div>

                {/* Company / Client */}
                <p className="text-sm text-gray-500 mt-1">{proj.clientName}</p>

                {/* Description */}
                <p className="text-gray-700 mt-3 line-clamp-3">
                  {proj.description}
                </p>

                {/* Tech Stack / Categories */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {proj.categories.map((cat) => (
                    <span
                      key={cat}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-4"></div>
                  {proj.status === "APPLIED" ? (
                    <button
                      disabled
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                    >
                      Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAcceptProject(proj.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <p className="text-center text-gray-500 mt-10">
                No projects found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobListings;
