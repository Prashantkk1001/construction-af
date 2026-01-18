import { useEffect, useState } from "react";
import api from "../../services/api";
import { Save, Trash2, Upload, X, Edit3 } from "lucide-react";

/* ================= TYPES ================= */
interface ConstructionInfo {
  name: string;
  description: string;
  image: string;
}

interface OwnerInfo {
  name: string;
  description: string;
  image: string;
  phone?: string;
  email?: string;
  location?: string;
}

interface ProjectInfo {
  completedProjects: number;
  happyClients: number;
  experienceYears: number;
}

interface AboutData {
  constructionInfo: ConstructionInfo;
  ownerInfo: OwnerInfo;
  projectInfo: ProjectInfo;
}

/* ================= COMPONENT ================= */
const AboutEditor = () => {
  const [data, setData] = useState<AboutData>({
    constructionInfo: { name: "", description: "", image: "" },
    ownerInfo: { name: "", description: "", image: "", phone: "", email: "", location: "" },
    projectInfo: { completedProjects: 0, happyClients: 0, experienceYears: 0 },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadStates, setUploadStates] = useState({
    constructionInfo: false,
    ownerInfo: false,
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get("/admin/about");
        if (res.data) setData(res.data);
      } catch {
        console.log("About data not found");
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async (file: File, section: "constructionInfo" | "ownerInfo") => {
    setUploadStates(prev => ({ ...prev, [section]: true }));
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/admin/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof AboutData],
          image: res.data.url,
        },
      }));
    } catch {
      alert("❌ Image upload failed");
    } finally {
      setUploadStates(prev => ({ ...prev, [section]: false }));
    }
  };

  /* ================= DELETE IMAGE ================= */
  const deleteImage = async (section: "constructionInfo" | "ownerInfo") => {
    if (!confirm(`Delete ${section === 'constructionInfo' ? 'construction logo' : 'owner photo'}?`)) return;

    try {
      setData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof AboutData],
          image: "",
        },
      }));
      alert("✅ Image removed successfully");
    } catch {
      alert("❌ Failed to delete image");
    }
  };

  /* ================= HANDLERS ================= */
  const handleChange = (
    section: keyof AboutData,
    field: string,
    value: string | number
  ) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/admin/about", data);
      alert("✅ All changes saved successfully!");
    } catch {
      alert("❌ Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSection = (section: keyof AboutData) => {
    const resetData = section === "projectInfo"
      ? { completedProjects: 0, happyClients: 0, experienceYears: 0 }
      : { name: "", description: "", image: "", ...(section === "ownerInfo" && { phone: "", email: "", location: "" }) };

    setData(prev => ({
      ...prev,
      [section]: resetData,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="animate-pulse space-y-8 w-full max-w-md">
          <div className="h-12 w-48 bg-gray-300 rounded-2xl mx-auto" />
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded-3xl mx-auto" />
            <div className="h-12 bg-gray-300 rounded-2xl mx-auto w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-4 tracking-tight">
          About Page Manager
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Edit content live on <code className="bg-white/80 px-3 py-1.5 rounded-full text-sm font-mono border backdrop-blur-sm shadow-sm">/about</code>
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
        {/* ================= CONSTRUCTION INFO ================= */}
        <section className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl lg:shadow-2xl border border-gray-200/60 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">🏗️</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-1">Construction Company</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-5 sm:space-y-6">
              <input
                placeholder="Company Name (Header Title)"
                value={data.constructionInfo.name}
                onChange={e => handleChange("constructionInfo", "name", e.target.value)}
                className="w-full p-4 sm:p-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all h-14 flex items-center"
              />
              <textarea
                placeholder="Company Description (Header Subtitle)"
                value={data.constructionInfo.description}
                onChange={e => handleChange("constructionInfo", "description", e.target.value)}
                rows={4}
                className="w-full p-4 sm:p-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 resize-vertical shadow-sm min-h-[120px]"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4 sm:space-y-6">
              <div className="relative group">
                {data.constructionInfo.image ? (
                  <>
                    <img
                      src={data.constructionInfo.image}
                      alt="Construction Logo Preview"
                      className="w-full h-48 sm:h-64 lg:h-72 object-contain rounded-2xl shadow-xl border-4 border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] bg-white p-4"
                    />
                    <button
                      onClick={() => deleteImage("constructionInfo")}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-all duration-200 border-2 border-white/80"
                      title="Delete Logo"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-48 sm:h-64 lg:h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 transition-all group-hover:scale-[1.02] p-6">
                    <Upload size={32} className="mb-2 opacity-60" />
                    <span className="text-lg font-medium">No Logo</span>
                  </div>
                )}
              </div>
              
              <label className="block w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-2xl cursor-pointer transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center text-sm sm:text-base group/file">
                {uploadStates.constructionInfo ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} className="mr-2" />
                    Upload Logo
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => e.target.files && uploadImage(e.target.files[0]!, "constructionInfo")}
                  disabled={uploadStates.constructionInfo}
                />
              </label>
            </div>
          </div>

          <button
            onClick={() => handleResetSection("constructionInfo")}
            className="mt-6 sm:mt-8 w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <Trash2 size={18} />
            Reset Section
          </button>
        </section>

        {/* ================= OWNER INFO ================= */}
        <section className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl lg:shadow-2xl border border-gray-200/60 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">👨‍💼</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-1">Owner Details</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <input
                placeholder="Owner Full Name"
                value={data.ownerInfo.name}
                onChange={e => handleChange("ownerInfo", "name", e.target.value)}
                className="w-full p-4 sm:p-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 shadow-sm h-14 flex items-center"
              />
              <textarea
                placeholder="Owner Bio / Description"
                value={data.ownerInfo.description}
                onChange={e => handleChange("ownerInfo", "description", e.target.value)}
                rows={3}
                className="w-full p-4 sm:p-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 resize-vertical shadow-sm min-h-[100px]"
              />
              
              {/* Contact Fields - Mobile Stacked */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sr-only sm:not-sr-only">Phone</label>
                  <input
                    type="tel"
                    placeholder="Phone (+91 98765 43210)"
                    value={data.ownerInfo.phone || ""}
                    onChange={e => handleChange("ownerInfo", "phone", e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sr-only sm:not-sr-only">Email</label>
                  <input
                    type="email"
                    placeholder="Email (owner@rkconstructions.com)"
                    value={data.ownerInfo.email || ""}
                    onChange={e => handleChange("ownerInfo", "email", e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 h-12"
                  />
                </div>
                <input
                  placeholder="Location (Pune, Maharashtra)"
                  value={data.ownerInfo.location || ""}
                  onChange={e => handleChange("ownerInfo", "location", e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 h-12"
                />
              </div>
            </div>

            {/* Owner Photo */}
            <div className="space-y-4 sm:space-y-6">
              <div className="relative group">
                {data.ownerInfo.image ? (
                  <>
                    <img
                      src={data.ownerInfo.image}
                      alt="Owner Photo Preview"
                      className="w-full h-64 sm:h-72 lg:h-80 object-cover rounded-3xl shadow-2xl border-4 sm:border-6 border-white hover:shadow-3xl transition-all duration-300 group-hover:scale-[1.02]"
                    />
                    <button
                      onClick={() => deleteImage("ownerInfo")}
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-200 border-4 border-white/90"
                      title="Delete Photo"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl border-4 sm:border-6 border-dashed border-purple-300 flex flex-col items-center justify-center text-purple-600 hover:border-purple-400 transition-all group-hover:scale-[1.02] p-8">
                    <span className="text-4xl sm:text-5xl mb-3">👤</span>
                    <span className="text-lg font-medium text-center">Upload Owner Photo</span>
                  </div>
                )}
              </div>
              
              <label className="block w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl cursor-pointer transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center text-sm sm:text-base group/file">
                {uploadStates.ownerInfo ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} className="mr-2" />
                    Upload Photo
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => e.target.files && uploadImage(e.target.files[0]!, "ownerInfo")}
                  disabled={uploadStates.ownerInfo}
                />
              </label>
            </div>
          </div>

          <button
            onClick={() => handleResetSection("ownerInfo")}
            className="mt-6 sm:mt-8 w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <Trash2 size={18} />
            Reset Section
          </button>
        </section>

        {/* ================= PROJECT STATS ================= */}
        <section className="bg-gradient-to-r from-emerald-50 to-cyan-50/50 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl lg:shadow-2xl border border-emerald-200/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">📊</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-1">Project Statistics</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="group p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all border border-emerald-100/50 hover:border-emerald-300/75">
              <label className="block text-base sm:text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏗️</span>
                Completed Projects
              </label>
              <input
                type="number"
                min="0"
                placeholder="500"
                value={data.projectInfo.completedProjects}
                onChange={e => handleChange("projectInfo", "completedProjects", Number(e.target.value) || 0)}
                className="w-full p-6 text-2xl sm:text-3xl font-black text-emerald-700 border-2 border-emerald-200/50 rounded-xl focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 text-center bg-emerald-50/50 backdrop-blur-sm shadow-inner h-20 flex items-center justify-center"
              />
            </div>
            
            <div className="group p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all border border-amber-100/50 hover:border-amber-300/75">
              <label className="block text-base sm:text-lg font-semibold text-amber-700 mb-4 flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Happy Clients
              </label>
              <input
                type="number"
                min="0"
                placeholder="200"
                value={data.projectInfo.happyClients}
                onChange={e => handleChange("projectInfo", "happyClients", Number(e.target.value) || 0)}
                className="w-full p-6 text-2xl sm:text-3xl font-black text-amber-700 border-2 border-amber-200/50 rounded-xl focus:ring-4 focus:ring-amber-500/50 focus:border-amber-500 text-center bg-amber-50/50 backdrop-blur-sm shadow-inner h-20 flex items-center justify-center"
              />
            </div>
            
            <div className="group p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all border border-slate-100/50 hover:border-slate-300/75">
              <label className="block text-base sm:text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Years Experience
              </label>
              <input
                type="number"
                min="0"
                placeholder="20"
                value={data.projectInfo.experienceYears}
                onChange={e => handleChange("projectInfo", "experienceYears", Number(e.target.value) || 0)}
                className="w-full p-6 text-2xl sm:text-3xl font-black text-slate-700 border-2 border-slate-200/50 rounded-xl focus:ring-4 focus:ring-slate-500/50 focus:border-slate-500 text-center bg-slate-50/50 backdrop-blur-sm shadow-inner h-20 flex items-center justify-center"
              />
            </div>
          </div>

          <button
            onClick={() => handleResetSection("projectInfo")}
            className="mt-6 sm:mt-8 w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <Trash2 size={18} />
            Reset Stats
          </button>
        </section>

        {/* ================= SAVE BUTTON ================= */}
        <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border-t-4 border-blue-200 sticky bottom-4 sm:static">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:justify-between">
            <div className="text-center sm:text-left text-sm sm:text-base text-gray-600 font-medium">
              <span className="text-emerald-600 font-bold">3</span> sections ready • 
              <span className="text-blue-600 font-bold ml-2">
                {data.projectInfo.completedProjects + data.projectInfo.happyClients + data.projectInfo.experienceYears}
              </span> stats configured
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-3xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 h-14 sm:h-auto min-w-[200px]"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={22} />
                  Save All Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutEditor;
