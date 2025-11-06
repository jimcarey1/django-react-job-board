import '../css/addexperience.css'

const AddExperience = () =>{
    return (
        <>
        <div className="add-experience">
            <div>
                <p className="heading">Experience</p>
                <p className="desc">Adding experience improves your chance of getting a job.</p>
            </div>
            <div className="job">
                <i class="bi bi-bag-fill"></i>
                <div className="job-details">
                    <p>Job Title</p>
                    <p>Organization</p>
                    <p>Achievements</p>
                </div>
            </div>
            <div>
                <button className="experience-button">Add Experience</button>
            </div>
        </div>
        </>
    )
}

export default AddExperience