import { useContext } from "react"
import AddExperience from "../components/AddExperience"
import AddSkills from "../components/AddSkills"
import {AuthContext} from "../context/AuthContext"
import { Link } from "react-router-dom"

import '../css/profile.css'
import '../components/CreateCompanyPage'
import CreateCompanyPage from "../components/CreateCompanyPage"

const Profile = () => {
    const {user} = useContext(AuthContext)
    const fullName = `${user.first_name} ${user.last_name}`
    const userDescription = "Backend Engineer at Amazon"

    return(
        <>
        {/* This become-employer div has a link to a page that allows you to register your business, 
            so that you can find right people for the job.
        */}
        <div className="become-employer">
            <span>Wanna become an employer ?</span>
            <p>
                You can register and verify your business on this portal to search for the talent you need for completely free.
                Find the right person based on his academics and the past experience.
            </p>
            <Link to={{
                pathname: '/company/create',
            }} className="become-employer-link">Become an Employer</Link>
        </div>
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