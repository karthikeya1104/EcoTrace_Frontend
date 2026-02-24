import api from "./axios";

/**
 * Store auth safely
 */
const handleAuthSuccess = (data) => {
  localStorage.setItem("auth", JSON.stringify(data));
  return data.role;
};

/**
 * Register
 */
export const register = async (payload) => {
  const res = await api.post("/auth/register", payload);
  return handleAuthSuccess(res.data);
};

/**
 * Login
 */
export const login = async (payload) => {
  const res = await api.post("/auth/login", payload);
  return handleAuthSuccess(res.data);
};

/**
 * Logout
 */
export const logout = () => {
  localStorage.removeItem("auth");
  window.location.href = "/login";
};
