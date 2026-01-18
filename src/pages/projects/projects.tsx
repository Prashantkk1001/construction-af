import { useEffect, useState } from "react";
import { Plus, Edit, ArrowLeft, Save, X, Trash, Image, MapPin } from "lucide-react";
import api from "../../services/api";

/* ================= TYPES ================= */
type Section =
  | "Residential"
  | "Interior"
  | "3D Plan"
  | "Line Plan"
  | "Commercial"
  | "Infrastructure";

interface Project {
  _id?: string;
  title: string;
  description: string;
  location: string;
  section: Section;
  images: string[];
}

type Mode = "section" | "list" | "form";

/* ================= SECTIONS ================= */
const SECTIONS: Section[] = [
  "Residential",
  "Interior", 
  "3D Plan",
  "Line Plan",
  "Commercial",
  "Infrastructure",
];

const ProjectPage = () => {
  const [mode, setMode] = useState<Mode>("section");
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [data, setData] = useState<Project>({
    title: "",
    description: "",
    location: "",
    section: "Residential" as Section,
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (mode === "list" && currentSection) fetchProjects();
  }, [mode, currentSection]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/projects?section=${currentSection}`);
      setProjects(res.data);
    } catch (error) {
      console.error("Fetch projects error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setData({ ...data, [e.target.name]: e.target.value as any });

  const handleImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    
    setUploading(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach(f => formData.append("images", f));
    
    try {
      const res = await api.post("/admin/upload/images", formData);
      setData(prev => ({ ...prev, images: [...prev.images, ...res.data.urls] }));
    } catch (error) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  const removeImage = (i: number) =>
    setData(p => ({ ...p, images: p.images.filter((_, x) => x !== i) }));

  const handleSave = async () => {
    if (!data.title?.trim() || !data.description?.trim() || !data.location?.trim()) {
      return alert("All fields are required");
    }
    
    setSaving(true);
    try {
      if (currentId) {
        await api.put(`/admin/projects/${currentId}`, data);
      } else {
        await api.post("/admin/projects", data);
      }
      resetForm();
      fetchProjects();
    } catch (error) {
      alert("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      setProjects(p => p.filter(x => x._id !== id));
    } catch (error) {
      alert("Failed to delete project");
    }
  };

  const resetForm = () => {
    setData({
      title: "",
      description: "",
      location: "",
      section: currentSection!,
      images: [],
    });
    setCurrentId(null);
    setMode("form");
  };

  const editProject = (project: Project) => {
    setData(project);
    setCurrentId(project._id!);
    setMode("form");
  };

  /* ================= SECTION SELECTION ================= */
  if (mode === "section") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-slate-900 bg-clip-text text-transparent text-center mb-8 tracking-tight">
            Projects Manager
          </h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {SECTIONS.map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setCurrentSection(sec);
                  setMode("list");
                }}
                className="group relative bg-white/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/50 hover:border-blue-300 hover:bg-white"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                    <span className="text-white font-bold text-sm sm:text-base">
                      {sec.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                    {sec}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">View Projects</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= PROJECTS LIST ================= */
  if (mode === "list") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setMode("section")}
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700 hover:text-gray-900 transition-colors mb-2 sm:mb-0"
              >
                <ArrowLeft size={18} />
                All Sections
              </button>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">
                {currentSection} Projects
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {projects.length} project{projects.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <button
              onClick={() => resetForm()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 sm:py-3.5 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-sm sm:text-base min-h-[44px]"
            >
              <Plus size={20} />
              Add New Project
            </button>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                  <div className="h-32 bg-gray-300 rounded-xl mb-4" />
                  <div className="h-5 bg-gray-300 rounded-full w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded-xl flex-1" />
                    <div className="w-10 h-8 bg-gray-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 px-6 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50">
              <Image className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No projects</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {/* Create your first {currentSection.toLowerCase()} project to get started. */}
              </p>
              <button
                onClick={() => resetForm()}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Plus size={20} />
                Add First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="group bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 hover:border-blue-200/50 overflow-hidden"
                >
                  {project.images[0] && (
                    <div className="relative mb-4 h-40 sm:h-48 rounded-2xl overflow-hidden bg-gray-100">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <MapPin size={14} />
                    <span className="truncate">{project.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => editProject(project)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all min-h-[40px] flex-1"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(project._id!)}
                      className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group/delete"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ================= PROJECT FORM ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => setMode("list")}
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 text-sm sm:text-base font-semibold text-gray-700 hover:text-gray-900 transition-colors p-3 sm:p-4 rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={18} />
          Back to {currentSection}
        </button>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">
              {currentId ? "Edit Project" : "New Project"}
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold rounded-full">
              {currentSection}
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">🏗️</span>
                Project Title
              </label>
              <input
                name="title"
                value={data.title}
                onChange={handleChange}
                placeholder="Enter project title"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm transition-all text-lg placeholder-gray-400 h-16"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={18} />
                  Location
                </label>
                <input
                  name="location"
                  value={data.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-sm transition-all placeholder-gray-400 h-16"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={data.section}
                  onChange={(e) => setData({ ...data, section: e.target.value as Section })}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 shadow-sm transition-all h-16"
                  disabled
                >
                  {SECTIONS.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">📝</span>
                Description
              </label>
              <textarea
                name="description"
                value={data.description}
                onChange={handleChange}
                rows={4}
                placeholder="Project description..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all resize-vertical placeholder-gray-400 min-h-[120px] text-base"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Image size={20} />
                Project Images ({data.images.length} selected)
              </label>
              <label className="w-full flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group bg-gradient-to-br from-gray-50/50 to-white/50 shadow-sm hover:shadow-md">
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-3" />
                    <p className="text-lg font-semibold text-blue-600">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Image size={48} className="text-gray-400 group-hover:text-blue-500 mb-3 transition-colors" />
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900 mb-1">Click to upload</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 5MB (Multiple OK)</p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview */}
            {data.images.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Preview ({data.images.length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {data.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-28 sm:h-32 object-cover rounded-2xl shadow-md group-hover:shadow-xl transition-all"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-2xl shadow-lg hover:scale-110 transition-all flex items-center justify-center w-7 h-7"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || !data.title.trim() || !data.description.trim() || !data.location.trim()}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 text-white py-5 px-8 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 min-h-[56px]"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save size={24} />
                {currentId ? "Update Project" : "Create Project"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
