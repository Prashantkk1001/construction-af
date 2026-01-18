import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/dashboard/Dashboard";

import AboutEditor from "./pages/about/AboutEditor";

// import ServiceList from "./pages/services/ServiceList";
// import AddService from "./pages/services/AddService";
// import EditService from "./pages/services/EditService";

import ProjectPage from "./pages/projects/projects";

import ContactSettings from "./pages/contacts/ContactSettings";
import EnquiryList from "./pages/contacts/ContactMessages";

const App = (): JSX.Element => {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
       
        <Route path="about" element={<AboutEditor />} />

        {/* <Route path="services" element={<ServiceList />} />
        <Route path="services/add" element={<AddService />} />
        <Route path="services/edit/:id" element={<EditService />} /> */}

        {/* ✅ MERGED PROJECT PAGE */}
        <Route path="projects" element={<ProjectPage />} />

        <Route path="contact" element={<ContactSettings />} />
        <Route path="enquiries" element={<EnquiryList />} />
      </Route>
    </Routes>
  );
};

export default App;
