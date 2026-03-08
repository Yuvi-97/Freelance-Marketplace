import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit2, FiSave, FiX, FiBriefcase, FiPhone, FiMail, FiMapPin, FiCalendar, FiDollarSign, FiClock, FiStar } from "react-icons/fi";

function FreelancerProfile() {
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    skills: "",
    hourlyRate: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setMessage({ type: "error", text: "Cloudinary is not configured. Add REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET to your .env file." });
      return;
    }

    try {
      setUploadingImage(true);
      setMessage(null);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const newUrl = res.data.secure_url;
      setFreelancer((prev) => ({ ...prev, profileUrl: newUrl }));

      const token = localStorage.getItem("token");
      if (token) {
        // We include existing data to prevent nullifying fields in the backend
        const payload = {
          name: freelancer.name,
          skills: freelancer.skills,
          hourlyRate: freelancer.hourlyRate,
          bio: freelancer.bio,
          profileUrl: newUrl,
        };
        await axios.put(`${API_BASE}/api/profile`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMessage({ type: "success", text: "Profile image updated successfully!" });
    } catch (err) {
      console.error("Image upload failed", err);
      setMessage({ type: "error", text: "Failed to upload image." });
    } finally {
      setUploadingImage(false);
    }
  };

  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        // This endpoint assumes the logged-in user is getting their own profile
        // A full robust implementation would check if a param ID was passed to view others
        const res = await axios.get(`${API_BASE}/api/profile`, { headers });
        const data = res.data;
        
        setFreelancer({
          id: data.freelancerId || data.clientId,
          name: data.name,
          skills: data.skills,
          hourlyRate: data.hourlyRate,
          bio: data.bio,
          email: data.email,
          profileUrl: data.profileUrl,
          location: data.location,
          role: data.role,
          phone: data.phone,
          birthday: data.birthday,
          gender: data.gender,
          isOwnProfile: true // assuming this is their own profile based on /api/profile
        });
        
        if (data.freelancerId) localStorage.setItem("freelancerId", String(data.freelancerId));
        if (data.clientId) localStorage.setItem("clientId", String(data.clientId));
        
        setForm({
          name: data.name || "",
          skills: data.skills || "",
          hourlyRate: data.hourlyRate ?? "",
          bio: data.bio || "",
        });
      } catch (err) {
        console.error("GET /api/profile failed", err?.response || err);
        setFreelancer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancer();
  }, [API_BASE]);

  const saveProfile = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "error", text: "Please login to update profile." });
        return;
      }
      
      const payload = {
        name: form.name,
        skills: form.skills,
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : null,
        bio: form.bio,
      };
      
      const res = await axios.put(`${API_BASE}/api/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = res.data;
      setFreelancer({
        id: data.freelancerId || data.clientId,
        name: data.name,
        skills: data.skills,
        hourlyRate: data.hourlyRate,
        bio: data.bio,
        email: data.email,
        profileUrl: data.profileUrl,
        location: data.location,
        role: data.role,
        phone: data.phone,
        birthday: data.birthday,
        gender: data.gender,
        isOwnProfile: true
      });
      
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      console.error("PUT /api/profile failed", err?.response || err);
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md w-full shadow-sm">
          <h2 className="text-xl font-bold mb-2">Freelancer Not Found</h2>
          <p className="mb-6 opacity-80">The profile you're looking for doesn't exist or is currently unavailable.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          
          {/* Header Banner - Emerald gradient for freelancers */}
          <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-500"></div>
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-16 mb-8 flex-wrap gap-4">
              {/* Avatar Profile */}
              <div className="relative group cursor-pointer" onClick={() => { if(freelancer.isOwnProfile) fileInputRef.current?.click(); }}>
                <img
                  src={
                    freelancer.profileUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      freelancer.name || "Freelancer"
                    )}&background=d1fae5&color=059669&size=128&bold=true`
                  }
                  alt={freelancer.name || "Freelancer"}
                  className={`w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white transition-opacity ${uploadingImage ? 'opacity-50' : 'opacity-100'} ${freelancer.isOwnProfile ? 'group-hover:opacity-80' : ''}`}
                />
                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                )}
                {freelancer.isOwnProfile && !uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full">
                    <span className="text-white text-xs font-bold">Change</span>
                  </div>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
              </div>

              {/* Action Buttons */}
              {freelancer.isOwnProfile && (
                <div className="mb-2">
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-100 transition-colors"
                    >
                      <FiEdit2 size={18} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={saveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        <FiSave size={18} />
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setForm({
                            name: freelancer.name || "",
                            skills: freelancer.skills || "",
                            hourlyRate: freelancer.hourlyRate ?? "",
                            bio: freelancer.bio || "",
                          });
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <FiX size={18} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left Column: Essential & Contact Info */}
              <div className="lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-8">
                <div>
                  {!editing ? (
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                      {freelancer.name || "Unnamed Freelancer"}
                    </h1>
                  ) : (
                    <input
                      type="text"
                      className="text-2xl font-bold text-gray-900 mb-1 w-full border-b border-gray-300 focus:border-emerald-500 outline-none pb-1 bg-transparent"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  )}
                  <p className="text-emerald-600 font-medium mb-6 flex flex-wrap gap-2 items-center">
                    {freelancer.role || "Professional Freelancer"}
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-5 mb-8 border border-emerald-100">
                   {!editing ? (
                     <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm">
                          <FiDollarSign size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-emerald-800 font-medium">Hourly Rate</p>
                          <p className="text-xl font-bold text-emerald-900">${freelancer.hourlyRate || "0"}<span className="text-sm font-medium text-emerald-700">/hr</span></p>
                        </div>
                     </div>
                   ) : (
                     <div>
                       <label className="block text-sm text-emerald-800 font-medium mb-1">Hourly Rate ($)</label>
                       <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg px-3 py-2 outline-none transition-all"
                        value={form.hourlyRate}
                        onChange={(e) => setForm((f) => ({ ...f, hourlyRate: e.target.value }))}
                        placeholder="e.g. 50"
                      />
                     </div>
                   )}
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Contact & Info</h3>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
                      <FiMail size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="text-gray-900 font-medium break-all">{freelancer.email || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
                      <FiPhone size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900 font-medium">{freelancer.phone || "Not provided"}</p>
                    </div>
                  </div>

                  {freelancer.location && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
                        <FiMapPin size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-gray-900 font-medium">{freelancer.location}</p>
                      </div>
                    </div>
                  )}

                  {freelancer.birthday && (
                     <div className="flex items-start gap-4">
                     <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
                       <FiCalendar size={18} />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-500">Birthday</p>
                       <p className="text-gray-900 font-medium">{freelancer.birthday}</p>
                     </div>
                   </div>
                  )}
                </div>
              </div>

              {/* Right Column: Detailed Info & Edit Forms */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* About Me Section */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
                  {!editing ? (
                    <div className="prose prose-emerald max-w-none">
                      {freelancer.bio ? (
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{freelancer.bio}</p>
                      ) : (
                        <p className="text-gray-400 italic">No bio provided yet.</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        rows={6}
                        className="w-full border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg px-4 py-3 outline-none transition-all resize-y"
                        value={form.bio}
                        onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                        placeholder="Tell clients about yourself, your experience, and what makes you great..."
                      />
                    </div>
                  )}
                </div>

                {/* Skills Section */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Top Skills</h3>
                  {!editing ? (
                    <div>
                      {freelancer.skills ? (
                        <div className="flex flex-wrap gap-2">
                          {freelancer.skills.split(",").map((skill, index) => {
                            const trimmedSkill = skill.trim();
                            if(!trimmedSkill) return null;
                            return (
                              <span
                                key={index}
                                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium shadow-sm hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                              >
                                {trimmedSkill}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">No skills listed yet.</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Configure Skills (Comma separated)</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg px-4 py-3 outline-none transition-all"
                        value={form.skills}
                        onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                        placeholder="e.g. React, Node.js, Graphic Design..."
                      />
                      <p className="text-xs text-gray-500 mt-2">Separate each skill with a comma.</p>
                      
                      {/* Live preview of skills being typed */}
                      {form.skills && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Preview</p>
                          <div className="flex flex-wrap gap-2 opacity-70">
                            {form.skills.split(",").map((skill, i) => skill.trim() && (
                               <span key={i} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                                 {skill.trim()}
                               </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerProfile;
