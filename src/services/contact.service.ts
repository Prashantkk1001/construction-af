import api from "./api";

export const getContacts = async () => {
  const res = await api.get("/contact");
  return res.data;
};
