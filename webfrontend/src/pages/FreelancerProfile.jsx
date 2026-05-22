import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  FiAward,
  FiBriefcase,
  FiDollarSign,
  FiEdit2,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiMail, FiMapPin,
  FiSave,
  FiStar,
  FiX
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const EXPERIENCE_LEVELS = ["BEGINNER", "INTERMEDIATE", "EXPERT"];
const WORK_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE"];

function FreelancerProfile() {
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const isOwnProfile = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const headers = { Authorization: token ? `Bearer ${token}` : "" };

        const res = await axios.get(`${API_BASE}/api/freelancers/user/${userId}`, { headers });
        const data = res.data;
        setFreelancer(data);
        if (data.id) localStorage.setItem("freelancerId", String(data.id));

        setForm({
          name: data.name || "",
          professionalHeadline: data.professionalHeadline || "",
          skills: data.skills || "",
          techStack: data.techStack || "",
          hourlyRate: data.hourlyRate ?? "",
          bio: data.bio || "",
          location: data.location || "",
          experienceLevel: data.experienceLevel || "",
          yearsOfExperience: data.yearsOfExperience ?? "",
          preferredWorkType: data.preferredWorkType || "",
          portfolioUrl: data.portfolioUrl || "",
          resumeUrl: data.resumeUrl || "",
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          education: data.education || "",
          certifications: data.certifications || "",
          languages: data.languages || "",
          availableForWork: data.availableForWork ?? true,
        });

        // Fetch reviews and rating
        if (data.id) {
          try {
            const ratingRes = await axios.get(`${API_BASE}/api/reviews/freelancer/${data.id}/rating`, { headers });
            setAvgRating(ratingRes.data);
          } catch (_) {}
          try {
            const reviewsRes = await axios.get(`${API_BASE}/api/reviews`, { headers });
            setReviews(reviewsRes.data.filter(r => r.freelancer?.id === data.id));
          } catch (_) {}
        }
      } catch (err) {
        console.error("Failed to fetch freelancer profile", err);
        setFreelancer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      setFreelancer(prev => ({ ...prev, profileUrl: newUrl }));
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
      const payload = {
        ...form,
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : null,
        yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : null,
      };
      const res = await axios.put(`${API_BASE}/api/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = res.data;
      setFreelancer(prev => ({ ...prev, ...d }));
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const f = (field) => form[field];
  const setF = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  if (loading) return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  if (!freelancer) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md w-full shadow-sm">
        <h2 className="text-xl font-bold mb-2">Freelancer Not Found</h2>
        <p className="mb-6 opacity-80">The profile you're looking for doesn't exist.</p>
        <button onClick={() => navigate("/")} className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition">
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-36 bg-gradient-to-r from-emerald-600 to-teal-500"></div>
          <div className="px-8 pb-8">
            {/* Avatar + Actions */}
            <div className="flex justify-between items-end -mt-16 mb-6 flex-wrap gap-4">
              <div className="relative group cursor-pointer" onClick={() => isOwnProfile && fileInputRef.current?.click()}>
                <img
                  src={freelancer.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name || "F")}&background=d1fae5&color=059669&size=128&bold=true`}
                  alt={freelancer.name}
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
                    <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-100 transition">
                      <FiEdit2 size={16} /> Edit Profile
                    </button>
                  ) : (
                    <>
                      <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column */}
              <div className="lg:col-span-1 space-y-6">
                {/* Name & Headline */}
                <div>
                  {!editing ? (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900">{freelancer.name || "Unnamed Freelancer"}</h1>
                      <p className="text-emerald-600 font-medium mt-1">{freelancer.professionalHeadline || "Professional Freelancer"}</p>
                    </>
                  ) : (
                    <>
                      <input className="w-full text-xl font-bold border-b border-gray-300 focus:border-emerald-500 outline-none pb-1 mb-2" value={f("name")} onChange={e => setF("name", e.target.value)} placeholder="Full Name" />
                      <input className="w-full text-sm border-b border-gray-300 focus:border-emerald-500 outline-none pb-1 text-emerald-600" value={f("professionalHeadline")} onChange={e => setF("professionalHeadline", e.target.value)} placeholder="Professional Headline" />
                    </>
                  )}
                </div>

                {/* Availability Badge */}
                <div className="flex items-center gap-2">
                  {editing ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={f("availableForWork")} onChange={e => setF("availableForWork", e.target.checked)} className="accent-emerald-600" />
                      <span className="text-sm font-medium text-gray-700">Available for work</span>
                    </label>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${freelancer.availableForWork ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {freelancer.availableForWork ? "✓ Available for work" : "✗ Not available"}
                    </span>
                  )}
                </div>

                {/* Rate */}
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  {!editing ? (
                    <div className="flex items-center gap-3">
                      <FiDollarSign className="text-emerald-600" size={20} />
                      <div>
                        <p className="text-xs text-emerald-700 font-medium">Hourly Rate</p>
                        <p className="text-xl font-bold text-emerald-900">${freelancer.hourlyRate || "0"}<span className="text-sm font-medium">/hr</span></p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs text-emerald-700 font-medium">Hourly Rate ($)</label>
                      <input type="number" min="0" className="w-full mt-1 border border-emerald-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500" value={f("hourlyRate")} onChange={e => setF("hourlyRate", e.target.value)} />
                    </div>
                  )}
                </div>

                {/* Contact & Info */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact & Info</p>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <FiMail className="text-gray-400 flex-shrink-0" />
                    <span className="break-all">{freelancer.email || "Not provided"}</span>
                  </div>
                  {!editing ? (
                    freelancer.location && (
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FiMapPin className="text-gray-400 flex-shrink-0" />
                        <span>{freelancer.location}</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-gray-400 flex-shrink-0" />
                      <input className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-500" value={f("location")} onChange={e => setF("location", e.target.value)} placeholder="City, Country" />
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Links</p>
                  {!editing ? (
                    <>
                      {freelancer.githubUrl && <a href={freelancer.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-700 hover:text-emerald-600 transition"><FiGithub /> GitHub</a>}
                      {freelancer.linkedinUrl && <a href={freelancer.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-700 hover:text-emerald-600 transition"><FiLinkedin /> LinkedIn</a>}
                      {freelancer.portfolioUrl && <a href={freelancer.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-700 hover:text-emerald-600 transition"><FiGlobe /> Portfolio</a>}
                      {!freelancer.githubUrl && !freelancer.linkedinUrl && !freelancer.portfolioUrl && <p className="text-sm text-gray-400 italic">No links added</p>}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><FiGithub className="text-gray-400 flex-shrink-0" /><input className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-500" value={f("githubUrl")} onChange={e => setF("githubUrl", e.target.value)} placeholder="GitHub URL" /></div>
                      <div className="flex items-center gap-2"><FiLinkedin className="text-gray-400 flex-shrink-0" /><input className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-500" value={f("linkedinUrl")} onChange={e => setF("linkedinUrl", e.target.value)} placeholder="LinkedIn URL" /></div>
                      <div className="flex items-center gap-2"><FiGlobe className="text-gray-400 flex-shrink-0" /><input className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-500" value={f("portfolioUrl")} onChange={e => setF("portfolioUrl", e.target.value)} placeholder="Portfolio URL" /></div>
                    </div>
                  )}
                </div>

                {/* Rating */}
                {avgRating !== null && (
                  <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
                    <div className="flex items-center gap-2">
                      <FiStar className="text-yellow-500" size={20} />
                      <div>
                        <p className="text-xs text-yellow-700 font-medium">Average Rating</p>
                        <p className="text-xl font-bold text-yellow-900">{Number(avgRating).toFixed(1)} <span className="text-sm font-medium">/ 5</span></p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">About Me</h3>
                  {!editing ? (
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{freelancer.bio || <span className="italic text-gray-400">No bio provided yet.</span>}</p>
                  ) : (
                    <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 resize-y" value={f("bio")} onChange={e => setF("bio", e.target.value)} placeholder="Tell clients about yourself..." />
                  )}
                </div>

                {/* Skills */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                  {!editing ? (
                    freelancer.skills ? (
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills.split(",").map((s, i) => s.trim() && (
                          <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium shadow-sm hover:border-emerald-300 hover:text-emerald-700 transition">{s.trim()}</span>
                        ))}
                      </div>
                    ) : <p className="text-gray-400 italic">No skills listed.</p>
                  ) : (
                    <div>
                      <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-emerald-500" value={f("skills")} onChange={e => setF("skills", e.target.value)} placeholder="React, Node.js, Python... (comma separated)" />
                      <p className="text-xs text-gray-400 mt-1">Separate each skill with a comma</p>
                    </div>
                  )}
                </div>

                {/* Tech Stack */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Tech Stack</h3>
                  {!editing ? (
                    freelancer.techStack ? (
                      <div className="flex flex-wrap gap-2">
                        {freelancer.techStack.split(",").map((t, i) => t.trim() && (
                          <span key={i} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-sm font-medium">{t.trim()}</span>
                        ))}
                      </div>
                    ) : <p className="text-gray-400 italic">No tech stack listed.</p>
                  ) : (
                    <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-emerald-500" value={f("techStack")} onChange={e => setF("techStack", e.target.value)} placeholder="AWS, Docker, PostgreSQL... (comma separated)" />
                  )}
                </div>

                {/* Experience */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Experience</h3>
                  {!editing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Level</p>
                        <p className="text-gray-900 font-semibold mt-1">{freelancer.experienceLevel || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Years</p>
                        <p className="text-gray-900 font-semibold mt-1">{freelancer.yearsOfExperience != null ? `${freelancer.yearsOfExperience} years` : "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Work Type</p>
                        <p className="text-gray-900 font-semibold mt-1">{freelancer.preferredWorkType || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Languages</p>
                        <p className="text-gray-900 font-semibold mt-1">{freelancer.languages || "Not set"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 font-medium">Experience Level</label>
                        <select className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500" value={f("experienceLevel")} onChange={e => setF("experienceLevel", e.target.value)}>
                          <option value="">Select...</option>
                          {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium">Years of Experience</label>
                        <input type="number" min="0" className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500" value={f("yearsOfExperience")} onChange={e => setF("yearsOfExperience", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium">Preferred Work Type</label>
                        <select className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500" value={f("preferredWorkType")} onChange={e => setF("preferredWorkType", e.target.value)}>
                          <option value="">Select...</option>
                          {WORK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium">Languages Spoken</label>
                        <input className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500" value={f("languages")} onChange={e => setF("languages", e.target.value)} placeholder="English, Spanish..." />
                      </div>
                    </div>
                  )}
                </div>

                {/* Education & Certifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2"><FiAward size={16} /> Education</h3>
                    {!editing ? (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{freelancer.education || <span className="italic text-gray-400">Not provided</span>}</p>
                    ) : (
                      <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 resize-y" value={f("education")} onChange={e => setF("education", e.target.value)} placeholder="B.Sc. Computer Science, MIT, 2020" />
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2"><FiBriefcase size={16} /> Certifications</h3>
                    {!editing ? (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{freelancer.certifications || <span className="italic text-gray-400">Not provided</span>}</p>
                    ) : (
                      <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 resize-y" value={f("certifications")} onChange={e => setF("certifications", e.target.value)} placeholder="AWS Certified, Google Cloud..." />
                    )}
                  </div>
                </div>

                {/* Reviews */}
                {reviews.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Reviews ({reviews.length})</h3>
                    <div className="space-y-4">
                      {reviews.slice(0, 5).map(review => (
                        <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-800">{review.reviewer?.username || "Anonymous"}</span>
                            <span className="text-yellow-500 font-bold">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
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
      </div>
    </div>
  );
}

export default FreelancerProfile;
