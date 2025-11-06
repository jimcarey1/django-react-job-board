import '../css/addexperience.css'

const AddSkills = () =>{
    return (
        <>
        <div className="add-skills">
            <div>
                <p className="heading">Skills</p>
                <p className="desc">Communicate your fit for new opportunities – 50% of hirers use skills data to fill their roles</p>
            </div>
            <div className="skill">
                <div className="skill-name">
                    <p>Soft Skills</p>
                    <p>Technical Skills</p>
                </div>
            </div>
            <div>
                <button className="skill-button">Add Skill</button>
            </div>
        </div>
        </>
    )
}

export default AddSkills