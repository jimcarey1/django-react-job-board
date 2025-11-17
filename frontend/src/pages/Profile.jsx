import { useContext } from "react"
import AddExperience from "../components/AddExperience"
import AddSkills from "../components/AddSkills"
import '../css/profile.css'
import {AuthContext} from "../context/AuthContext"

const Profile = () => {
    const {user} = useContext(AuthContext)
    const fullName = `${user.first_name} ${user.last_name}`
    const userDescription = "Backend Engineer at Amazon"

    return(
        <>
        <div className="user-profile">
            <div className="user-intro">
                <p className="name">{fullName}</p>
                <p className="desc">{userDescription}</p>
            </div>
            <AddExperience />
            <AddSkills />
        </div>
        </>
    )
}

export default Profile