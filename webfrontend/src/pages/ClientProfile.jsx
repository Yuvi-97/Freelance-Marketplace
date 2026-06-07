import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
    FiBriefcase,
    FiCheckCircle,
    FiEdit2,
    FiGlobe, FiLinkedin,
    FiMail,
    FiMapPin,
    FiPhone,
    FiSave,
    FiTwitter,
    FiX
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "E-commerce",
  "Media & Entertainment", "Real Estate", "Manufacturing", "Consulting", "Other"
];

function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const fileInputRef = useRef(null);
  const isOwnProfile = id === localStorage.getItem("userId");

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${API_BASE}/api/clients/user/${id}`, { headers });
        const data = res.data;
        setClient(data);
        setForm({
          clientName: data.clientName || "",
          phone: data.phone || "",
          companyName: data.companyName || "",
          companyDescription: data.companyDescription || "",
          industry: data.industry || "",
          companyWebsite: data.companyWebsite || "",
          companySize: data.companySize || "",
          location: data.location || "",
          linkedinUrl: data.linkedinUrl || "",
          twitterUrl: data.twitterUrl || "",
        });

        // Fetch client reviews and rating
        if (data.id) {
          try {
            const ratingRes = await axios.get(`${API_BASE}/api/reviews/client/${data.id}/rating`, { headers });
            setAvgRating(ratingRes.data);
          } catch (_) {}
          try {
            const reviewsRes = await axios.get(`${API_BASE}/api/reviews/client/${data.id}`, { headers });
            setReviews(reviewsRes.data || []);
          } catch (_) {}
          // Completed projects count
          setCompletedCount((data.projects || []).filter(p => p.status === "COMPLETED").length);
        }
      } catch (err) {
        console.error("Failed to fetch client profile", err);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClient();
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setMessage({ type: "error", text: "Cloudinary not configured." });
      return;
    }
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
      const newUrl = res.data.secure_url;
      setClient(prev => ({ ...prev, profileUrl: newUrl }));
      localStorage.setItem("profileUrl", newUrl);
      window.dispatchEvent(new Event("login"));
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/profile`, { ...form, profileUrl: newUrl }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: "Profile image updated!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to upload image." });
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClient(prev => ({ ...prev, ...form }));
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const f = (field) => form[field] ?? "";
  const setF = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  if (loading) return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!client) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md w-full shadow-sm">
        <h2 className="text-xl font-bold mb-2">Client Not Found</h2>
        <p className="mb-6 opacity-80">The profile you're looking for doesn't exist.</p>
        <button onClick={() => navigate("/")} className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition">Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-36 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <div className="px-8 pb-8">
            {/* Avatar + Actions */}
            <div className="flex justify-between items-end -mt-16 mb-6 flex-wrap gap-4">
              <div className="relative group cursor-pointer" onClick={() => isOwnProfile && fileInputRef.current?.click()}>
                <img
                  src={client.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.clientName || "C")}&background=e0e7ff&color=4f46e5&size=128&bold=true`}
                  alt={client.clientName}
                  className={`w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white ${uploadingImage ? "opacity-50" : ""} ${isOwnProfile ? "group-hover:opacity-80" : ""} transition`}
                />
                {isOwnProfile && !uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30 rounded-full">
                    <span className="text-white text-xs font-bold">Change</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} />
              </div>
              {isOwnProfile && (
                <div className="mb-2 flex gap-3">
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition">
                      <FiEdit2 size={16} /> Edit Profile
                    </button>
                  ) : (
                    <>
                      <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
                        <FiSave size={16} /> {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">
                        <FiX size={16} /> Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-xl ${message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                {message.text}
              </div>
            )}

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{(client.projects || []).length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Projects Posted</p>
              </div>
              <div className="text-center border-x border-gray-200">
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                <p className="text-xs text-gray-500 mt-0.5">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{avgRating && Number(avgRating) > 0 ? Number(avgRating).toFixed(1) : "—"}</p>
                <p className="text-xs text-gray-500 mt-0.5">Avg Rating</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column */}
              <div className="lg:col-span-1 space-y-6">
                {/* Name & Company */}
                <div>
                  {!editing ? (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900">{client.clientName || client.user?.username || "Unnamed Client"}</h1>
                      <p className="text-indigo-600 font-medium mt-1 flex items-center gap-1">
                        <FiBriefcase size={14} /> {client.companyName || "Independent Client"}
                      </p>
                      {client.verified && (
                        <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          <FiCheckCircle size={12} /> Verified
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <input className="w-full text-xl font-bold border-b border-gray-300 focus:border-indigo-500 outline-none pb-1 mb-2" value={f("clientName")} onChange={e => setF("clientName", e.target.value)} placeholder="Full Name" />
                      <input className="w-full text-sm border-b border-gray-300 focus:border-indigo-500 outline-none pb-1 text-indigo-600" value={f("companyName")} onChange={e => setF("companyName", e.target.value)} placeholder="Company Name" />
                    </>
                  )}
                </div>

                {/* Contact */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</p>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <FiMail className="text-gray-400 flex-shrink-0" />
                    <span className="break-all">{client.contactEmail || client.user?.email || "Not provided"}</span>
                  </div>
                  {!editing ? (
                    client.phone && (
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FiPhone className="text-gray-400 flex-shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-gray-400 flex-shrink-0" />
                      <input className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500" value={f("phone")} onChange={e => setF("phone", e.target.value)} placeholder="+1 234 567 890" />
                    </div>
                  )}
                  {!editing ? (
                    client.location && (
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FiMapPin className="text-gray-400 flex-shrink-0" />
                        <span>{client.location}</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-gray-400 flex-shrink-0" />
                      <input className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500" value={f("location")} onChange={e => setF("location", e.target.value)} placeholder="City, Country" />
                    </div>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Links</p>
                  {!editing ? (
                    <>
                      {client.companyWebsite && <a href={client.companyWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition"><FiGlobe /> Website</a>}
                      {client.linkedinUrl && <a href={client.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition"><FiLinkedin /> LinkedIn</a>}
                      {client.twitterUrl && <a href={client.twitterUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition"><FiTwitter /> Twitter</a>}
                      {!client.companyWebsite && !client.linkedinUrl && !client.twitterUrl && <p className="text-sm text-gray-400 italic">No links added</p>}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><FiGlobe className="text-gray-400 flex-shrink-0" /><input className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500" value={f("companyWebsite")} onChange={e => setF("companyWebsite", e.target.value)} placeholder="https://company.com" /></div>
                      <div className="flex items-center gap-2"><FiLinkedin className="text-gray-400 flex-shrink-0" /><input className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500" value={f("linkedinUrl")} onChange={e => setF("linkedinUrl", e.target.value)} placeholder="LinkedIn URL" /></div>
                      <div className="flex items-center gap-2"><FiTwitter className="text-gray-400 flex-shrink-0" /><input className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500" value={f("twitterUrl")} onChange={e => setF("twitterUrl", e.target.value)} placeholder="Twitter URL" /></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Details */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Company Details</h3>
                  {!editing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Industry</p>
                        <p className="text-gray-900 font-semibold mt-1">{client.industry || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Company Size</p>
                        <p className="text-gray-900 font-semibold mt-1">{client.companySize ? `${client.companySize} employees` : "Not set"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 font-medium">Industry</label>
                        <select className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500" value={f("industry")} onChange={e => setF("industry", e.target.value)}>
                          <option value="">Select...</option>
                          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium">Company Size</label>
                        <select className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500" value={f("companySize")} onChange={e => setF("companySize", e.target.value)}>
                          <option value="">Select...</option>
                          {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* About Company */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">About the Company</h3>
                  {!editing ? (
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {client.companyDescription || <span className="italic text-gray-400">No description provided.</span>}
                    </p>
                  ) : (
                    <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 resize-y" value={f("companyDescription")} onChange={e => setF("companyDescription", e.target.value)} placeholder="Describe your company, mission, and what you're looking for..." />
                  )}
                </div>

                {/* Projects */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Posted Projects</h3>
                    {isOwnProfile && (
                      <Link to="/post-project" className="text-sm text-indigo-600 hover:underline">+ Post New</Link>
                    )}
                  </div>
                  {client.projects && client.projects.length > 0 ? (
                    <div className="grid gap-3">
                      {client.projects.map(project => (
                        <div key={project.id} className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition bg-white">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-900">{project.title}</h4>
                            <span className="text-sm font-semibold text-indigo-600">${project.budget}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              project.status === "OPEN" ? "bg-blue-100 text-blue-700" :
                              project.status === "ASSIGNED" ? "bg-purple-100 text-purple-700" :
                              project.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                              "bg-gray-100 text-gray-600"
                            }`}>{project.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-8 text-center">
                      <FiBriefcase className="text-indigo-300 mx-auto mb-3" size={32} />
                      <p className="text-gray-500 font-medium">No projects posted yet</p>
                      {isOwnProfile && (
                        <Link to="/post-project" className="inline-block mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm">
                          Post a Project
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews section */}
            {reviews.length > 0 && (
              <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Reviews ({reviews.length})</h3>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map(review => (
                    <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{review.reviewer?.username || "Anonymous"}</span>
                        <span className="text-yellow-500 font-bold text-sm">
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">{review.createdAt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProfile;
