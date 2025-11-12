import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'

import './css/main.css'
import 'bootstrap-icons/font/bootstrap-icons.css';


createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
)
