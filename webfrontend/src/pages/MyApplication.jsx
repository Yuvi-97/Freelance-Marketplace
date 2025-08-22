import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function ApplicationsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const freelancerId = localStorage.getItem("freelancerId");

        if (!freelancerId) {
          console.error("No freelancerId found in localStorage");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${API_BASE}/api/projects/freelancer/${freelancerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 h-screen">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {projects.length === 0 ? (
        <p className="text-gray-500">
          You haven’t applied to any projects yet.
        </p>
      ) : (
        <div className="grid gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 border rounded-lg shadow hover:shadow-md transition bg-white"
            >
              <h2 className="text-xl font-semibold">{proj.title}</h2>
              <p className="text-gray-600">{proj.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Budget: ${proj.budget}
              </p>
              <p className="text-sm text-gray-500">
                Status: <span className="font-medium">{proj.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
