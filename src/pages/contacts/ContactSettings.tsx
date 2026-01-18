import { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  Trash2,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Map,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

/* ================= TYPES ================= */
interface SocialLinks {
  instagram: string;
  facebook: string;
  whatsapp: string;
  twitter: string;
}

interface ContactData {
  phone: string;
  email: string;
  address: string;
  workingTime: string;
  mapUrl: string;
  social: SocialLinks;
}

/* ================= COMPONENT ================= */
const ContactSettings = () => {
  const [data, setData] = useState<ContactData>({
    phone: "",
    email: "",
    address: "",
    workingTime: "",
    mapUrl: "",
    social: {
      instagram: "",
      facebook: "",
      whatsapp: "",
      twitter: "",
    },
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/admin/contact", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;
        const result = await res.json();

        setData({
          phone: result.phone || "",
          email: result.email || "",
          address: result.address || "",
          workingTime: result.workingTime || "",
          mapUrl: result.mapUrl || "",
          social: {
            instagram: result.social?.instagram || "",
            facebook: result.social?.facebook || "",
            whatsapp: result.social?.whatsapp || "",
            twitter: result.social?.twitter || "",
          },
        });
      } catch {
        console.log("Contact API not ready");
      }
    };

    fetchContact();
  }, []);

  /* ================= HANDLERS (UNCHANGED) ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [name]: value,
      },
    }));
  };

  /* ================= SAVE (UNCHANGED) ================= */
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No token");

      const res = await fetch("http://localhost:5000/api/admin/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Save failed");

      setMessage({
        type: "success",
        text: "Contact information saved successfully!",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to save contact information",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  /* ================= RESET (UNCHANGED) ================= */
  const handleReset = () => {
    if (!confirm("Clear all contact data?")) return;

    setData({
      phone: "",
      email: "",
      address: "",
      workingTime: "",
      mapUrl: "",
      social: {
        instagram: "",
        facebook: "",
        whatsapp: "",
        twitter: "",
      },
    });

    setMessage({ type: "success", text: "Contact data cleared" });
    setTimeout(() => setMessage(null), 3000);
  };

  /* ================= STYLED UI ONLY ✅ ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-3 sm:mb-4 tracking-tight">
            Contact Settings
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
            Update contact details for website footer & contact page
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-8 p-5 sm:p-6 rounded-3xl shadow-xl border-4 transform transition-all duration-300 ${
            message.type === "success" 
              ? "bg-emerald-50 border-emerald-200 hover:scale-[1.01]" 
              : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-start gap-4">
              {message.type === "success" ? (
                <CheckCircle className="w-8 h-8 text-emerald-500 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg sm:text-xl text-gray-900 leading-tight">
                  {message.text}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl lg:rounded-[3rem] border border-gray-200/50 p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          {/* Contact Info Section */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3 pb-3 border-b-2 border-gray-100">
              <Phone size={28} className="text-emerald-500" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <StyledField
                icon={<Phone size={20} className="text-emerald-500" />}
                label="Phone Number"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
              
              <StyledField
                icon={<Mail size={20} className="text-blue-500" />}
                label="Email Address"
                name="email"
                value={data.email}
                type="email"
                onChange={handleChange}
                placeholder="hello@rkconstructions.com"
              />
            </div>

            <StyledField
              icon={<MapPin size={20} className="text-purple-500" />}
              label="Office Address"
              name="address"
              value={data.address}
              as="textarea"
              rows={3}
              onChange={handleChange}
              placeholder="RK Constructions Pvt Ltd, Survey No. 123, Baner, Pune, Maharashtra 411045"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <StyledField
                icon={<Clock size={20} className="text-orange-500" />}
                label="Working Hours"
                name="workingTime"
                value={data.workingTime}
                onChange={handleChange}
                placeholder="Mon-Sat: 9:00 AM - 7:00 PM | Sun: Closed"
              />
              
              <StyledField
                icon={<Map size={20} className="text-indigo-500" />}
                label="Google Maps Embed URL"
                name="mapUrl"
                value={data.mapUrl}
                type="url"
                onChange={handleChange}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>
          </section>

          {/* Social Media Section */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b-2 border-gray-100">
              <MessageCircle size={28} className="text-pink-500" />
              Social Media Links
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <StyledSocialField
                icon={<Instagram size={20} className="text-pink-500 bg-gradient-to-r from-pink-500/10 to-purple-500/10" />}
                label="Instagram"
                name="instagram"
                value={data.social.instagram}
                onChange={handleSocialChange}
                placeholder="https://instagram.com/rkconstructions"
              />
              
              <StyledSocialField
                icon={<Facebook size={20} className="text-blue-600 bg-gradient-to-r from-blue-500/10 to-blue-700/10" />}
                label="Facebook"
                name="facebook"
                value={data.social.facebook}
                onChange={handleSocialChange}
                placeholder="https://facebook.com/rkconstructions"
              />
              
              <StyledSocialField
                icon={<MessageCircle size={20} className="text-green-500 bg-gradient-to-r from-green-500/10 to-emerald-500/10" />}
                label="WhatsApp"
                name="whatsapp"
                value={data.social.whatsapp}
                onChange={handleSocialChange}
                placeholder="https://wa.me/919876543210"
              />
              
              <StyledSocialField
                icon={<Twitter size={20} className="text-sky-400 bg-gradient-to-r from-sky-400/10 to-cyan-400/10" />}
                label="Twitter/X"
                name="twitter"
                value={data.social.twitter}
                onChange={handleSocialChange}
                placeholder="https://twitter.com/rkconstructions"
              />
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-4 border-gradient-to-r from-emerald-200 via-blue-200 to-purple-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 group relative flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 overflow-hidden min-h-[56px] after:absolute after:inset-0 after:bg-white/20 after:backdrop-blur-sm after:opacity-0 group-hover:after:opacity-100 after:transition-all after:duration-300"
            >
              {saving ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={24} />
                  Save All Changes
                </>
              )}
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-8 rounded-3xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 min-h-[56px] group/delete overflow-hidden after:absolute after:inset-0 after:bg-white/20 after:backdrop-blur-sm after:opacity-0 group-hover:after:opacity-100 after:transition-all after:duration-300"
            >
              <Trash2 size={22} />
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= STYLED FIELD COMPONENTS ================= */
interface FieldProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  rows?: number;
  as?: "input" | "textarea";
  onChange:
    | React.ChangeEventHandler<HTMLInputElement>
    | React.ChangeEventHandler<HTMLTextAreaElement>;
}

const StyledField = ({
  icon,
  label,
  as = "input",
  rows,
  onChange,
  ...rest
}: FieldProps) => (
  <div className="group">
    <label className="block text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-3 group-hover:text-blue-600 transition-colors">
      {icon}
      <span className="tracking-wide">{label}</span>
    </label>
    
    {as === "textarea" ? (
      <textarea
        {...rest}
        rows={rows}
        onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
        className="w-full px-5 py-4 border-2 border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-blue-500/40 focus:border-blue-500 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 placeholder-gray-400 text-base bg-white/50 backdrop-blur-sm min-h-[100px] resize-vertical"
      />
    ) : (
      <input
        {...rest}
        type={rest.type || "text"}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        className="w-full px-5 py-4 border-2 border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-blue-500/40 focus:border-blue-500 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 placeholder-gray-400 h-16 text-base bg-white/50 backdrop-blur-sm"
      />
    )}
  </div>
);

interface StyledSocialFieldProps extends Omit<FieldProps, "as"> {}

const StyledSocialField = (props: StyledSocialFieldProps) => (
  <div className="relative overflow-hidden rounded-3xl group/social p-1 bg-gradient-to-r from-gray-100/50 to-gray-200/50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-200/30 hover:border-blue-200/50">
    <StyledField {...props} type="url" />
  </div>
);

export default ContactSettings;
