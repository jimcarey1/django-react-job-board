// src/AuthContext.jsx
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({})

  const login = async ({ email, password }) => {
    const res = await fetch("http://localhost:8000/api/auth/login",{
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({"email":email, "password":password})
    });
    const data = await res.json()
    console.log(data)
    if (data.access && data.user) {
      localStorage.setItem('access', data.access)
      setUser(data.user)
      //We are storing the refresh token in the cookies.
      return true;
    }
    return false;
  };

  const logout = async () => {
    localStorage.clear()
    const response = await fetch('http://localhost:8000/api/auth/logout', {
      method: 'GET',
      credentials: 'include',
    })
    if(response.ok){
      const data = await response.json()
      if(!data.reason){
        console.log(data)
      }
    }
  };

  return <AuthContext.Provider value={{ login, logout }}>{children}</AuthContext.Provider>;
}
