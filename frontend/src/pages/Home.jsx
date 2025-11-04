import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import '../css/navbar.css'

const Home = ()=>{
    const {accessToken, setAccessToken, login, logout} = useContext(AuthContext);

    if(accessToken){
        //User is already logged in.

    }else{
        return(
            <>
            <div className="navbar">
                <div className="title">
                    <p>Django Job Board</p>
                </div>
                <div className="auth-related">
                    <button className="register">Register</button>
                    <button className="login">Login</button>
                </div>
            </div>
            </>
        )
    }
}

export default Home