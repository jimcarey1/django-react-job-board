// src/AuthContext.jsx
import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  const login = async ({ email, password }) => {
    const res = await fetch("http://localhost:8000/api/auth/login",{
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({"email":email, "password":password})
    });
    const data = await res.json()
    if (data.access) {
      setAccessToken(data.access);
      // optionally store refresh in localStorage if returned (less secure)
      if (data.refresh) localStorage.setItem("refresh", data.refresh);
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
