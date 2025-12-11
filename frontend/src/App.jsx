import {Route, Routes} from "react-router-dom"

import Home from './pages/Home'
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegistrationForm"
import Profile from "./pages/Profile"
import Page from "./pages/Page"
import CreateCompanyPage from "./components/CreateCompanyPage"
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
        //If the response status is 401(Unauthorized), removing access_token and user details from 
        //the localStorage as they are no longer valid. 
        if(response.status == 401){
          localStorage.removeItem('access')
          localStorage.removeItem('user')
          return 
        }  
        try{
          const data = await response.json()
          if(data.access){
            localStorage.removeItem('access')
            localStorage.setItem('access', data.access)
          }
        }catch(error){
          console.log(error)
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
      <Route path="/profile" element={<Profile />} />
      <Route path="/:name/page" element={<Page />} />
      <Route path="/company/create" element={<CreateCompanyPage />} />
    </Routes>
    </>
  )
}

export default App
