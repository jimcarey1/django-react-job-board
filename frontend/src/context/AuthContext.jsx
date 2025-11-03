// src/AuthContext.jsx
import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  const login = async ({ username, password }) => {
    const res = await axios.post("http://localhost:8000/api/auth/login", { username, password }, { withCredentials: true });
    if (res.data.access) {
      setAccessToken(res.data.access);
      // optionally store refresh in localStorage if returned (less secure)
      if (res.data.refresh) localStorage.setItem("refresh", res.data.refresh);
      return true;
    }
    return false;
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem("refresh");
  };

  return <AuthContext.Provider value={{ accessToken, setAccessToken, login, logout }}>{children}</AuthContext.Provider>;
}
