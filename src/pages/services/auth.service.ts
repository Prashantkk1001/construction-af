import api from "./api";

const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

const authService = {
  login,
};

export default authService;
