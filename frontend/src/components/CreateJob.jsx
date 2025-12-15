import { useRef, useState } from "react"
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { justSkillNames } from "./AddExperience"
import '../css/createjob.css'

const CreateJob = ()=>{
    const [jobTitle, setJobTitle] = useState('')
    const [selectedlocationType, setSelectedLocationType] = useState('')
    const [selectedSkills, setSelectedSkills] = useState([])
    
    const jobDescriptionRef = useRef(null)

    const skills = JSON.parse(localStorage.getItem('skills')) || []
    const locationTypes = JSON.parse(localStorage.getItem('locationType')) || []

    const skillOptions = justSkillNames(skills)
    const locationTypeOptions = locationTypes.map((location)=>({'value':location, 'label':location}))


    return (
        <>
        <div className="post-job">
            <span>CREATE A JOB</span>
            <form>
                <div className="field">
                    <label htmlFor="job-title">Job Title<span className="required">*</span></label>
                    <input type="text" id="job-title" value={jobTitle} onChange={(e)=>setJobTitle(e.target.value)} placeholder="Python developer" required />
                </div>
                <div className="field">
                    <label htmlFor="job-description">Description<span className="required">*</span></label>
                    <textarea id="job-description" ref={jobDescriptionRef} required/>
                </div>
                <div className="field">
                    <label htmlFor="location-type">Location Type<span className="required">*</span></label>
                    <Select
                        id="location-type" 
                        options={locationTypeOptions}
                        value={selectedlocationType}
                        onChange={(selected)=>setSelectedLocationType(selected)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="skills">Skills Required<span className="required">*</span></label>
                    <CreatableSelect 
                        id="skills"
                        isMulti
                        isClearable
                        options={skillOptions}
                        value={selectedSkills}
                        onChange={(selected)=>setSelectedSkills(selected)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="experience">Experience<span className="required">*</span></label>
                    <input type="text" name="experience" id="experience" required />
                </div>
                <div className="field">
                    <label htmlFor="ctc">CTC<span className="required">*</span></label>
                    <input type="text" id="ctc" name="ctc" required />
                </div>
                <div className="action-buttons">
                    <button className="submit-button">Submit</button>
                    <button className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default CreateJob