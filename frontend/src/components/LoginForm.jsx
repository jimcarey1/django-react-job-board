import {useFormStatus} from "react-dom"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import GoogleLoginButton from "./GoogleLoginButton"
import { AuthContext } from "../context/AuthContext"
import '../css/login.css'

const SubmitButtonStatus = ()=>{
    const {pending} = useFormStatus()
    return(
        <>
        <button className="login-button" disabled={pending}>{pending ? 'Submitting...' : 'Submit'}</button>
        </>
    )
}

const LoginForm = ()=>{
    const {user, login} = useContext(AuthContext)
    console.log(user)
    const navigate = useNavigate()
    if(user){
        navigate('-1', {replace: true})
    }
    const formAction = async (formData) => {
        const email = formData.get('email')
        const password = formData.get('password')
        console.log(email, password)
        const loggedIn = await login({email, password})
        if(loggedIn){
            navigate('/', {replace: true})
            console.log('User logged in successfully')
        }
    }

    return(
        <div className="login-card">
            <div className="title">
                <span>Login</span>
            </div>
            <form action={formAction}>
                <div className="field" id="email-field">
                    <label htmlFor="email">Email*</label>
                    <input type="email" id="email" name="email" required autoComplete="off" />
                </div>
                <div className="field" id="password-field">
                    <label htmlFor="password">Password*</label>
                    <input type="password" id="password" name="password" required autoComplete="off" />
                </div>
                <SubmitButtonStatus/>
                <GoogleLoginButton />
            </form>
        </div>
    )
}

export default LoginForm