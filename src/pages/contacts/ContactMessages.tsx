import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  Eye,
  Trash2,
  Search,
  ChevronDown
} from "lucide-react";

/* ================= TYPES ================= */
interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  createdAt: string;
}

/* ================= COMPONENT ================= */
const ContactMessages = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await api.get("/admin/enquiries");
        setEnquiries(res.data.data ?? res.data);
      } catch (err) {
        console.error("Failed to load enquiries", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this enquiry?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/admin/enquiries/${id}`);
      setEnquiries(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert("Failed to delete enquiry");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= FILTER ================= */
  const filtered = enquiries.filter(e =>
    `${e.name} ${e.email} ${e.phone} ${e.subject}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 py-4">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-6 space-y-3">
        <h1 className="text-xl sm:text-2xl font-bold">Contact Enquiries</h1>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border"
            placeholder="Search enquiries..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="text-center mt-24 text-gray-500">
          No enquiries found
        </div>
      )}

      {/* ================= MOBILE CARDS ================= */}
      <div className="max-w-5xl mx-auto space-y-4 lg:hidden">
        {filtered.map(e => (
          <div key={e._id} className="bg-white rounded-2xl p-4 shadow space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-base truncate">{e.name}</h3>
                <p className="text-xs text-blue-600 truncate">{e.email}</p>
              </div>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                {new Date(e.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* SUBJECT */}
            <span className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              {e.subject || "General"}
            </span>

            {/* PHONE */}
            <a href={`tel:${e.phone}`} className="flex items-center gap-2 text-sm text-emerald-600">
              <Phone size={14} />
              {e.phone}
            </a>

            {/* MESSAGE PREVIEW */}
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 break-words">
              {e.message}
            </p>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setOpenId(openId === e._id ? null : e._id)}
                className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold"
              >
                {openId === e._id ? "Hide Message" : "View Full Message"}
                <ChevronDown
                  size={14}
                  className={`transition ${openId === e._id ? "rotate-180" : ""}`}
                />
              </button>

              <div className="flex gap-3">
                <a
                  href={`mailto:${e.email}`}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold text-center"
                >
                  Reply
                </a>

                <button
                  disabled={deletingId === e._id}
                  onClick={() => handleDelete(e._id)}
                  className="w-12 flex justify-center items-center rounded-xl bg-red-100 text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* FULL MESSAGE */}
            {openId === e._id && (
              <div className="bg-gray-50 p-4 rounded-xl text-sm leading-relaxed break-words">
                {e.message}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block max-w-6xl mx-auto mt-6">
        <div className="bg-white rounded-3xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-left">Message</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e._id} className="border-t">
                  <td className="p-4 font-medium">{e.name}</td>
                  <td className="p-4 text-blue-600">{e.email}</td>
                  <td className="p-4 text-emerald-600">{e.phone}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-xs rounded-full">
                      {e.subject || "General"}
                    </span>
                  </td>
                  <td className="p-4 max-w-md line-clamp-2">{e.message}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <a href={`mailto:${e.email}`}><Mail size={16} /></a>
                      <button><Eye size={16} /></button>
                      <button
                        onClick={() => handleDelete(e._id)}
                        disabled={deletingId === e._id}
                        className="text-red-600 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
