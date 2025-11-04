import {useFormStatus} from "react-dom"
import GoogleLoginButton from "./GoogleLoginButton"

const SubmitButtonStatus = ()=>{
    const {pending} = useFormStatus()
    return(
        <>
        <button disabled={pending}>{pending ? 'Submitting...' : 'Submit'}</button>
        </>
    )
} 

const RegisterForm = ()=>{
    const formAction = async (formData)=>{
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password')
        if(password != confirmPassword){
            return
        }
        formData = {
            "email" : formData.get('email'),
            "password" : formData.get('password'),
            "confirm_password" : formData.get('confirm_password')
        }
        const response = await fetch('http://localhost:8000/api/auth/register', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
    }

    return(
        <form action={formAction}>
            <input type="email" name="email" placeholder="email..." required/>
            <input type="password" name="password" placeholder="***********" required/>
            <input type="password" name="confirm_password" placeholder="***********" required/>
            <SubmitButtonStatus/>
            <GoogleLoginButton />
        </form>
    )
}

export default RegisterForm