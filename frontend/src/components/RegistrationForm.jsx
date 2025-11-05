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
        if(data.access){
            localStorage.setItem('access', data.access)
            location.href = '/'
        }
    }

    return(
        <form action={formAction}>
            <input type="email" name="email" placeholder="email..." required/>
            <input type="text" name="first" placeholder="First Name..." required/>
            <input type="text" name="last" placeholder="Last Name..." required/>
            <input type="password" name="password" placeholder="***********" required/>
            <input type="password" name="confirm_password" placeholder="***********" required/>
            <SubmitButtonStatus/>
            <GoogleLoginButton />
        </form>
    )
}

export default RegisterForm