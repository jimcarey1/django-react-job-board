import {useFormStatus} from "react-dom"
import { useContext } from "react"
import GoogleLoginButton from "./GoogleLoginButton"
import { AuthContext } from "../context/AuthContext"


const SubmitButtonStatus = ()=>{
    const {pending} = useFormStatus()
    return(
        <>
        <button disabled={pending}>{pending ? 'Submitting...' : 'Submit'}</button>
        </>
    )
}

const LoginForm = ()=>{
    const {login} = useContext(AuthContext)
    const formAction = async (formData) => {
        const email = formData.get('email')
        const password = formData.get('password')
        console.log(email, password)
        const loggedIn = await login({email, password})
        if(loggedIn){
            location.href = '/'
            console.log('User logged in successfully')
        }
    }

    return(
        <form action={formAction}>
            <input type="email" name="email" required/>
            <input type="password" name="password" required/>
            <SubmitButtonStatus/>
            <GoogleLoginButton />
        </form>
    )
}

export default LoginForm