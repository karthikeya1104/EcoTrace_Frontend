export const getAuth = () => {
  const data = localStorage.getItem("auth");
  return data ? JSON.parse(data) : null;
};

export const isAuthenticated = () => !!getAuth();

export const getUser = () => {
  const auth = getAuth();
  if (!auth) return null;

  return {
    role: auth.role,
    name: auth.username || auth.email || "User",
    token: auth.access_token
  };
};

export const logout = () => {
  localStorage.removeItem("auth");
  window.location.href = "/login";
};
