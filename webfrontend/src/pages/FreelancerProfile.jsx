import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function FreelancerProfile() {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/freelancers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFreelancer(res.data);
      } catch (err) {
        setFreelancer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancer();
  }, [id, API_BASE]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-indigo-600 font-bold">Loading...</span>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 font-bold mb-4">Freelancer not found.</p>
        <Link to="/" className="text-indigo-600 underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Left Column */}
        <div className="md:w-1/3 bg-[#232c3b] flex flex-col items-center p-8 min-h-screen shadow-lg">
          <img
            src={
              freelancer.profileUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                freelancer.name
              )}&background=4f46e5&color=fff&size=128`
            }
            alt={freelancer.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow mb-4"
          />
          <h1 className="text-2xl font-extrabold text-white mb-1">
            {freelancer.name}
          </h1>
          <p className="text-blue-200 font-medium mb-2">
            {freelancer.role || "Freelancer"}
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {freelancer.skills &&
              freelancer.skills.split(",").map((skill) => (
                <span
                  key={skill.trim()}
                  className="bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {skill.trim()}
                </span>
              ))}
          </div>
          <div className="w-full mt-6 flex flex-col items-center">
            <h3 className="text-sm font-bold text-gray-200 mb-2 text-center">
              Work History
            </h3>
            <ul className="text-xs text-gray-300 space-y-1 text-center">
              <li>
                <span className="font-semibold text-white">
                  Spotify New York
                </span>
                <span className="ml-2 bg-blue-700 text-white px-2 py-0.5 rounded text-[10px]">
                  Primary
                </span>
                <br />
                <span>170 William Street, NY 10038</span>
              </li>
              <li>
                <span className="font-semibold text-white">
                  Metropolitan Museum
                </span>
                <span className="ml-2 bg-blue-500 text-white px-2 py-0.5 rounded text-[10px]">
                  Secondary
                </span>
                <br />
                <span>525 E 68th Street, NY 10065</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:w-2/3 p-8 flex flex-col min-h-screen">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {freelancer.name}
              </h2>
              <p className="text-indigo-500">
                {freelancer.role || "Product Designer"}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-lg font-bold text-blue-700">8.6</span>
              <span className="text-yellow-400 text-xl">★★★★★</span>
              <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition">
                Send Message
              </button>
              <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-50 transition">
                Contacts
              </button>
            </div>
          </div>
          <div className="border-b mb-4"></div>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Contact Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-700 mb-2">
                Contact Information
              </h3>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <a
                  href={`tel:${freelancer.phone || ""}`}
                  className="text-blue-700 hover:underline"
                >
                  {freelancer.phone || "N/A"}
                </a>
              </p>
              <p>
                <span className="font-semibold">E-mail:</span>{" "}
                <a
                  href={`mailto:${freelancer.email}`}
                  className="text-blue-700 hover:underline"
                >
                  {freelancer.email}
                </a>
              </p>
              <p>
                <span className="font-semibold">Site:</span>{" "}
                <a
                  href={freelancer.profileUrl || "#"}
                  className="text-blue-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {freelancer.profileUrl || "N/A"}
                </a>
              </p>
            </div>
            {/* Basic Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-700 mb-2">
                Basic Information
              </h3>
              <p>
                <span className="font-semibold">Hourly Rate:</span>{" "}
                <span className="text-indigo-700 font-bold">
                  ${freelancer.hourlyRate}
                </span>
              </p>
              <p>
                <span className="font-semibold">Bio:</span>{" "}
                <span className="text-gray-700">{freelancer.bio}</span>
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                <span className="text-gray-700">
                  {freelancer.location || "N/A"}
                </span>
              </p>
              <p>
                <span className="font-semibold">Birthday:</span>{" "}
                <span className="text-gray-700">
                  {freelancer.birthday || "N/A"}
                </span>
              </p>
              <p>
                <span className="font-semibold">Gender:</span>{" "}
                <span className="text-gray-700">
                  {freelancer.gender || "N/A"}
                </span>
              </p>
            </div>
          </div>
          <div className="border-b mt-6 mb-4"></div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">About</h3>
            <p className="text-gray-700">{freelancer.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerProfile;
