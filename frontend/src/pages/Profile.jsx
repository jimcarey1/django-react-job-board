import AddExperience from "../components/AddExperience"
import AddSkills from "../components/AddSkills"
import '../css/profile.css'

const Profile = () => {
    const fullName = `first Last`
    const userDescription = "Backend Engineer at Amazon"

    return(
        <>
        <div className="user-profile">
            <div className="user-intro">
                <p className="name">fullName</p>
                <p className="desc">userDescription</p>
            </div>
            <AddExperience />
            <AddSkills />
        </div>
        </>
    )
}

export default Profile