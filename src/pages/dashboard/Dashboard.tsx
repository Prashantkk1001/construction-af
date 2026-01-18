import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Info,
  Wrench,
  Building2,
  Phone,
} from "lucide-react";

type DashboardCard = {
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
};

const dashboardCards: DashboardCard[] = [
  {
    title: "About",
    description: "Edit company experience, projects & journey",
    path: "/admin/about",
    icon: Info,
  },
  {
    title: "Services",
    description: "Manage construction services & images",
    path: "/admin/services",
    icon: Wrench,
  },
  {
    title: "Projects",
    description: "Add and manage construction projects",
    path: "/admin/projects",
    icon: Building2,
  },
  {
    title: "Contact",
    description: "Update contact details & social links",
    path: "/admin/contact",
    icon: Phone,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", display: "flex", gap: "8px" }}>
          <LayoutDashboard />
          Dashboard Overview
        </h1>
        <p style={{ color: "#666" }}>
          Manage all admin sections from one place
        </p>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {dashboardCards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            style={{
              cursor: "pointer",
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <div style={{ background: "#e0e7ff", padding: "12px", borderRadius: "8px" }}>
              <card.icon />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{card.title}</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
