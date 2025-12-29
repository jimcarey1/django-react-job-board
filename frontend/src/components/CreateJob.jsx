import { useRef, useState, useEffect } from "react"
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import AsyncSelect from 'react-select/async'
import { useParams } from "react-router-dom"
import { justSkillNames } from "./AddExperience"
import '../css/createjob.css'

const CreateJob = ()=>{
    const {company_name} = useParams()
    const accessToken = localStorage.getItem('access')

    const [jobTitle, setJobTitle] = useState('')
    const [selectedlocationType, setSelectedLocationType] = useState({})
    const [selectedSkills, setSelectedSkills] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('')
    const [experience, setExperience] = useState(0)
    const [ctc, setCtc] = useState(0)
    
    const jobDescriptionRef = useRef(null)

    const skills = JSON.parse(localStorage.getItem('skills')) || []
    const locationTypes = JSON.parse(localStorage.getItem('locationType')) || []

    const skillOptions = justSkillNames(skills)
    const locationTypeOptions = locationTypes.map((location)=>({'value':location, 'label':location}))

    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(false);
    console.log(jobTitle, selectedLocation, selectedSkills, ctc, experience, selectedlocationType, company_name)

    useEffect(()=>{
        const fetchCityCountry = async ()=>{
            try{
                const response = await fetch('/data/modified_cities.json')
                if(response.ok){
                    try{
                        const data = await response.json()
                        setLocations(data)
                        setLoading(false)
                    }catch(error){
                        console.log(error)
                        setLoading(false)
                    }
                }
            }catch(error){
                console.log(error)
                setLoading(false)
            }
        }
        fetchCityCountry()
    }, [])

    const loadOptions = (inputValue) => {
        if (!inputValue) {
        return Promise.resolve([])
        }

        const filtered = locations.filter(city =>
            city.label.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, 100)

        return Promise.resolve(filtered)
    };

    const onSubmit = async ()=>{
        const description = jobDescriptionRef.current.value
        /*changed the fetch API endpoint, removed organization from request body and send it
        in the URL via query parameter.*/
        const response = await fetch(`http://localhost:8000/api/company/${company_name}/add-job`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include',
            body: JSON.stringify({
                title: jobTitle,
                description: description,
                location: selectedLocation.value,
                skills: selectedSkills.map((skill)=>skill.value),
                ctc: ctc,
                experience: experience,
                location_type: selectedlocationType.value,
            })
        })
        if(response.ok){
            const data = await response.json()
            console.log(data)
        }
    }

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
                    <label htmlFor="locations">Location<span className="required">*</span></label>
                    <AsyncSelect
                        id="locations"
                        isClearable
                        loadOptions={loadOptions}
                        value={selectedLocation}
                        onChange={(selected)=>setSelectedLocation(selected)}
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
                    <input type="number" id="experience" required value={experience} onChange={(e)=>setExperience(e.target.value)} />
                </div>
                <div className="field">
                    <label htmlFor="ctc">CTC<span className="required">*</span></label>
                    <input type="text" id="ctc" value={ctc} onChange={(e)=>setCtc(e.target.value)}/>
                </div>
                <div className="action-buttons">
                    <button className="submit-button" onClick={onSubmit}>Submit</button>
                    <button className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default CreateJob