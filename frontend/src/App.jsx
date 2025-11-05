import {Route, Routes} from "react-router-dom"

import Home from './pages/Home'
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegistrationForm"
import { useEffect } from "react"

function App() {
  const access_token = localStorage.getItem('access') || null;
  useEffect(()=>{
    const fecthAcessToken = async ()=>{
      try{
        const response = await fetch('http://localhost:8000/api/auth/access_token', {
          method: 'POST',
          headers:{
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({"access":access_token})
        })
        const data = await response.json()
        if(data.access){
          localStorage.removeItem('access')
          localStorage.setItem('access', data.access)
        }
      }catch(error){
          console.log(error)
      }
    }
    fecthAcessToken()
    const intervalId = setInterval(fecthAcessToken, 30*60*1000)
    return ()=> clearInterval(intervalId)
  }, [])
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
