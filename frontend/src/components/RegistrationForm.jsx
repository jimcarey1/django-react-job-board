import {useFormStatus} from "react-dom"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"


import GoogleLoginButton from "./GoogleLoginButton"
import { AuthContext } from "../context/AuthContext"
import '../css/register.css'


const SubmitButtonStatus = ()=>{
    const {pending} = useFormStatus()
    return(
        <>
        <button className="register-button" disabled={pending}>{pending ? 'Submitting...' : 'Submit'}</button>
        </>
    )
} 

const RegisterForm = ()=>{
    const {user, setUser} = useContext(AuthContext)
    const navigate = useNavigate()
    if(user){
        navigate('-1', {replace: true})
    }
    const formAction = async (formData)=>{
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password')
        if(password != confirmPassword){
            return
        }
        formData = {
            "email" : formData.get('email'),
            "password" : formData.get('password'),
            "first_name" : formData.get('first'),
            "last_name" : formData.get('last'),
        }
        const response = await fetch('http://localhost:8000/api/auth/register', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            'credentials': 'include',
            body: JSON.stringify(formData)
        })
        const data = await response.json()
        if(data.access && data.user){
            localStorage.setItem('access', data.access)
            localStorage.setItem('user', JSON.stringify(data.user))
            setUser(data.user)
            location.href = '/'
        }
    }

    return(
        <div className="register-card">
            <span className="title">Register</span>
            <form action={formAction}>
                <div className="field" id="email-field">
                    <label htmlFor="email">Email*</label>
                    <input type="email" id="email" name="email" required autoComplete="off" />
                </div>
                <div className="field" id="first-name-field">
                    <label htmlFor="first-name">First Name*</label>
                    <input type="text" id="first-name" name="first" required autoComplete="off" />
                </div>
                <div className="field" id="last-name-field">
                    <label htmlFor="last-name">Last Name*</label>
                    <input type="text" id="last-name" name="last" required autoComplete="off" />
                </div>
                <div className="field" id="password-field">
                    <label htmlFor="password">Password*</label>
                    <input type="password" id="password" name="password" required autoComplete="off" />
                </div>
                <div className="field" id="confirm-password-field">
                    <label htmlFor="confirm-password">Confirm Password*</label>
                    <input type="password" id="confirm-password" name="confirm_password" required autoComplete="off" />
                </div>
                <SubmitButtonStatus/>
                <GoogleLoginButton />
            </form>
        </div>
    )
}

export default RegisterForm