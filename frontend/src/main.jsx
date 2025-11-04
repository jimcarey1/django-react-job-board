import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './css/main.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='258088388347-o1gp9ofno79k658bheoltk68tut7n794.apps.googleusercontent.com'>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
)
