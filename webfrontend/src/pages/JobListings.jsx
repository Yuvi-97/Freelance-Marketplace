import React, { useState, useEffect } from "react";
import axios from "axios";

function JobListings() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("Most Relevant");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token"); // get JWT token
      const res = await axios.get("http://localhost:8080/api/projects/all", {
        headers: {
          Authorization: `Bearer ${token}`, // send JWT in header
        },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // Filtered & sorted projects
  const filteredProjects = projects
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (category ? p.categories.includes(category) : true))
    .sort((a, b) => {
      if (sort === "Newest") return new Date(b.createdDate) - new Date(a.createdDate);
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
        <h1 className="text-3xl font-bold text-blue-900">Find Your Next Project</h1>
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
            <span className="text-gray-600">{filteredProjects.length} projects found</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-blue-900">{proj.title}</h2>
                <p className="text-gray-700 mt-2">{proj.description}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {proj.categories.map((cat) => (
                    <span
                      key={cat}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <span>📅 Deadline: {proj.deadline}</span>
                  <span>💰 ${proj.budget}</span>
                </div>

                <button className="mt-4 w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition">
                  Apply Now
                </button>
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <p className="text-center text-gray-500 mt-10">No projects found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobListings;
