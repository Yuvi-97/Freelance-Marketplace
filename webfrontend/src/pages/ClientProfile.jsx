import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiEdit2, FiSave, FiX, FiBriefcase, FiPhone, FiMail } from "react-icons/fi";

function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    company: "",
    phone: "",
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
      setClient((prev) => ({ ...prev, profileUrl: newUrl }));

      const token = localStorage.getItem("token");
      if (token) {
        // We include existing data to prevent nullifying fields in the backend
        const payload = {
          clientName: client.clientName,
          company: client.company,
          phone: client.phone,
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

  // Note: Backend might rely on the token for /api/profile, but the route is /client/:id
  // The actual endpoint used in FreelancerProfile to get one's own profile is /api/profile.
  // To view another client's profile, it might be /api/clients/{id} or /api/clients/user/{id}.
  
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        // If the logged-in user is viewing their own profile, we can use /api/profile
        // If they're viewing someone else's, we need /api/clients/user/{id} or /api/clients/{id}
        // Let's use the explicit endpoint for fetching by user ID since the route is /client/:id (where id is userId according to Header.jsx)
        
        let url = `${API_BASE}/api/clients/user/${id}`;
        let isOwnProfile = false;
        
        if (id === localStorage.getItem("userId")) {
             // they can edit their own profile
             isOwnProfile = true;
        }

        const res = await axios.get(url, { headers });
        const data = res.data;
        
        setClient({
          ...data,
          isOwnProfile
        });
        
        setForm({
          clientName: data.clientName || "",
          company: data.company || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Failed to fetch client profile", err?.response || err);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClient();
  }, [id, API_BASE]);

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
        clientName: form.clientName,
        company: form.company,
        phone: form.phone,
      };
      
      const res = await axios.put(`${API_BASE}/api/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Assume success, we will fetch the updated data from res or just update state manually since /api/profile returns a custom ProfileResponse object
      
      setClient((prev) => ({
        ...prev,
        clientName: form.clientName,
        company: form.company,
        phone: form.phone,
      }));
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md w-full shadow-sm">
          <h2 className="text-xl font-bold mb-2">Client Not Found</h2>
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-16 mb-8">
              {/* Avatar Profile */}
              <div className="relative group cursor-pointer" onClick={() => { if(client.isOwnProfile) fileInputRef.current?.click(); }}>
                <img
                  src={
                    client.profileUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      client.clientName || client.user?.username || "Client"
                    )}&background=e0e7ff&color=4f46e5&size=128&bold=true`
                  }
                  alt={client.clientName || "Client"}
                  className={`w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white transition-opacity ${uploadingImage ? 'opacity-50' : 'opacity-100'} ${client.isOwnProfile ? 'group-hover:opacity-80' : ''}`}
                />
                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                )}
                {client.isOwnProfile && !uploadingImage && (
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
              {client.isOwnProfile && (
                <div className="mb-2">
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition-colors"
                    >
                      <FiEdit2 size={18} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={saveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        <FiSave size={18} />
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setForm({
                            clientName: client.clientName || "",
                            company: client.company || "",
                            phone: client.phone || "",
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              {/* Left Column: Essential Info */}
              <div className="md:col-span-1 border-r border-gray-100 pr-0 md:pr-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {client.clientName || client.user?.username || "Unnamed Client"}
                </h1>
                <p className="text-indigo-600 font-medium mb-8 flex items-center gap-2">
                  <FiBriefcase /> {client.company || "Independent Client"}
                </p>

                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Contact Info</h3>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                      <FiMail size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="text-gray-900 font-medium">{client.contactEmail || client.user?.email || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                      <FiPhone size={20} />
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      {!editing ? (
                        <p className="text-gray-900 font-medium">{client.phone || "Not provided"}</p>
                      ) : (
                        <input
                          type="tel"
                          className="mt-1 w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg px-3 py-2 text-sm outline-none transition-all"
                          placeholder="+1 234 567 890"
                          value={form.phone}
                          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Info & Edit Forms */}
              <div className="md:col-span-2">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Details</h3>
                  
                  {!editing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                          <p className="text-gray-900 font-semibold">{client.clientName || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Company / Organization</p>
                          <p className="text-gray-900 font-semibold">{client.company || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg px-4 py-2.5 outline-none transition-all"
                          value={form.clientName}
                          onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                          placeholder="e.g. Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg px-4 py-2.5 outline-none transition-all"
                          value={form.company}
                          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                          placeholder="e.g. Acme Corp"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Projects Section (Future Enhancement) */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Active Projects</h3>
                  {client.projects && client.projects.length > 0 ? (
                    <div className="grid gap-4">
                      {client.projects.map(project => (
                        <div key={project.id} className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
                          <h4 className="font-bold text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiBriefcase className="text-indigo-600 text-2xl" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">No active projects</h4>
                      <p className="text-gray-500 max-w-sm mx-auto">This client hasn't posted any projects or they are currently hidden.</p>
                      
                      {client.isOwnProfile && (
                        <Link to="/post-project" className="inline-block mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                          Post a Project Now
                        </Link>
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

export default ClientProfile;
