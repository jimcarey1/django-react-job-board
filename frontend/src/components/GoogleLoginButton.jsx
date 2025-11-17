// src/GoogleLoginButton.jsx
import React, { useContext } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function GoogleLoginButton() {
  const {setUser} = useContext(AuthContext)
  return (
    <GoogleLogin
      onSuccess={async credentialResponse => {
        // credentialResponse.credential is the ID token (JWT)
        let id_token = credentialResponse.credential;
        id_token = String(id_token);
        console.log(id_token)
        // send to backend for verification and to get our JWTs
        const res = await axios.post("http://localhost:8000/api/auth/google/", { id_token }, { withCredentials: true });
        if (res.data.access && res.data.user) {
          localStorage.setItem('access', res.data.access)
          setUser(res.data.user)
          location.href = '/'
        } else {
          console.error("Google login failed on backend");
        }
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}
