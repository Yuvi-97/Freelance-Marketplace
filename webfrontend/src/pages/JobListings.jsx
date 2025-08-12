import React, { useState, useEffect } from "react";
import axios from "axios";

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("Most Relevant");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:8080/projects");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (category ? job.category === category : true)
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900">Find Your Next Project</h1>
        <p className="text-gray-600">
          Discover thousands of opportunities from companies around the world
        </p>
      </div>

      <div className="max-w-7xl mx-auto mt-8 flex gap-8">
        {/* Filters */}
        <div className="w-1/4 border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span>Filters</span>
          </h2>
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Keywords or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Category</h3>
            {[
              "All Categories",
              "Web Development",
              "Mobile Development",
              "Design & Creative",
              "Writing & Translation",
              "Digital Marketing",
              "Data Science",
              "DevOps & Cloud",
            ].map((cat) => (
              <div key={cat} className="mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat || (cat === "All Categories" && !category)}
                    onChange={() => setCategory(cat === "All Categories" ? "" : cat)}
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Job List */}
        <div className="flex-1">
          {/* Sort & Count */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">{filteredJobs.length} jobs found</span>
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

          {/* Jobs */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-blue-900">{job.title}</h2>
                    <p className="text-sm text-gray-500">{job.company || "Unknown Company"}</p>
                    <p className="text-sm mt-2 text-gray-700">{job.description}</p>

                    {/* Skills */}
                    <div className="flex gap-2 flex-wrap mt-3">
                      {job.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <span>📅 {job.posted || "Recently"}</span>
                      <span>🌍 {job.location || "Remote"}</span>
                      <span>💬 {job.proposals || 0} proposals</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-green-600 font-bold">
                      ${job.budgetMin || job.budget} - ${job.budgetMax || job.budget}
                    </p>
                    <p className="text-xs text-gray-500">{job.paymentType || "fixed price"}</p>
                    <button className="mt-4 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <p className="text-center text-gray-500 mt-10">No jobs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobListings;
