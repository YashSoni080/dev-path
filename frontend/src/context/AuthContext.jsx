import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if the user has a valid session cookie and rehydrate
  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    return data; // returns { message, email, requiresOtp }
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await api.post("/auth/verify-otp", { email, otp });
    setUser(data.user);
    return data;
  };

  const resendOtp = async (email) => {
    const { data } = await api.post("/auth/resend-otp", { email });
    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.user) setUser(data.user);
    return data; // includes { user } or { requiresOtp, email }
  };

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore — clear local state regardless
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, resendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
