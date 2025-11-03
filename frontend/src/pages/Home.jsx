import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import '../css/navbar.css'

const Home = ()=>{
    const {accessToken, setAccessToken, login, logout} = useContext(AuthContext);
    const [openRegister, setOpenRegister] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);

    const toggleRegisterButton = ()=>{
        setOpenRegister(!openRegister)
    }

    const toggleLoginButton = ()=>{
        setOpenLogin(!openLogin)
    }

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
                    <div className="dropdown-container">
                        <button className="register" onClick={toggleRegisterButton}>Register</button>
                            {openRegister && (
                                    <div className="dropdown-menu">
                                        <button>Sign up with google</button>
                                        <button>Sign up with username and password</button>
                                    </div>
                                )}
                    </div>
                    <div className="dropdown-container">
                        <button className="login" onClick={toggleLoginButton}>Login</button>
                            {openLogin && (
                                    <div className="dropdown-menu">
                                        <button>Sign in with google</button>
                                        <button>Sign in with username and password</button>
                                    </div>
                                )}
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default Home