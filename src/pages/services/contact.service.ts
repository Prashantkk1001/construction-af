// src/services/contact.service.ts
import api from "./api";

export interface ContactSettings {
  _id?: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
}

// Admin APIs
export const getContactSettings = async () => {
  const res = await api.get<{ success: boolean; data: ContactSettings }>("/admin/contact");
  return res.data.data;
};

export const updateContactSettings = async (payload: ContactSettings) => {
  const res = await api.put<{ success: boolean; data: ContactSettings }>("/admin/contact", payload);
  return res.data.data;
};

export const deleteContactSettings = async () => {
  const res = await api.delete<{ success: boolean; message: string }>("/admin/contact");
  return res.data;
};
