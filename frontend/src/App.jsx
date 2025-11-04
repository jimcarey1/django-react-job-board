import {Route, Routes} from "react-router-dom"

import Home from './pages/Home'
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegistrationForm"

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
    </>
  )
}

export default App
