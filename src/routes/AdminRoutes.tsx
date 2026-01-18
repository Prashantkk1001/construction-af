// src/routes/AdminRoutes.tsx - FULL ROUTING WITH CONTACTS
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/dashboard/Dashboard';
import ContactSettings from '../pages/contacts/ContactSettings';
import Login from '../pages/auth/Login';
// Add your other page imports here

const AdminRoutes: React.FC = () => {
  return (
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/contacts" element={<ContactSettings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
