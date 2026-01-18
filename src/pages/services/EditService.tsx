import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, Save, ArrowLeft } from "lucide-react";
import api from "../../services/api";

interface ServiceData {
  title: string;
  description: string;
  image: string;
}

export default function EditService() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ServiceData>({
    title: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await api.get(`/admin/services/${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching service:", error);
      alert("Error loading service data.");
      navigate("/admin/services");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/admin/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData(prev => ({ ...prev, image: response.data.url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!data.title || !data.description) {
      alert("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/admin/services/${id}`, data);
      alert("Service updated successfully!");
      navigate("/admin/services");
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Error updating service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/services")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          Back to Services
        </button>
        <h1 className="text-2xl font-bold">Edit Service</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter service title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter service description..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Image
          </label>

          {data.image && (
            <div className="mb-4">
              <img
                src={data.image}
                alt="Service preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="service-image-upload"
              disabled={uploading}
            />
            <label
              htmlFor="service-image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                {uploading ? "Uploading..." : "Click to upload service image"}
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate("/admin/services")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={20} />
            {saving ? "Saving..." : "Update Service"}
          </button>
        </div>
      </div>
    </div>
  );
}
