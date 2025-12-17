import { useEffect, useRef, useState } from 'react'
import CreatableSelect from 'react-select/creatable'

import '../css/addexperience.css'
import { fetchEmploymentType, fetchLocationType, fetchLocation, fetchSkills } from '../services/experience';

export const justSkillNames = (skills)=>{
    const skillNames = skills.map((skill)=>({'value': skill.name, 'label': skill.name}))
    return skillNames
}

const CustomYearSelector = ({name, disabled})=>{
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i); // Generate years from 50 years ago to 50 years in the future

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  return (
    <select value={selectedYear} disabled={disabled} name={name} onChange={handleChange}>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
}

const CustomMonthSelector = ({name, disabled}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-indexed

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setSelectedMonth(newMonth);
  };

  return (
    <div>
      <select value={selectedMonth} disabled={disabled} name={name} onChange={handleMonthChange}>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const AddExperience = () =>{
    const [employmentType, setEmploymentType] = useState(JSON.parse(localStorage.getItem('employmentType')) || [])
    const [locationType, setLocationType] = useState(JSON.parse(localStorage.getItem('locationType')) || [])
    const [location, setLocation] = useState(JSON.parse(localStorage.getItem('location')) || [])
    const [skills, setSkills] = useState(JSON.parse(localStorage.getItem('skills')) || [])
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [loading, setLoading] = useState(true)

    const [currentlyWorking, setCurrentlyWorking] = useState(false);
    const [userExperiences, setUserExperiences] = useState([])

    const modalRef = useRef(null)

    //A value derived from the state.
    const filteredSkills = justSkillNames(skills)
    const accessToken = localStorage.getItem('access') || null


    useEffect(()=>{
        const setEverythingOnce = async ()=>{
            const employment_type = await fetchEmploymentType()
            const location_type = await fetchLocationType()
            const location_ = await fetchLocation()
            const skills_ = await fetchSkills()

            if(employment_type && employmentType.length === 0){
                localStorage.setItem('employmentType', JSON.stringify(employment_type))
                setEmploymentType(employment_type)
            }
            if(location_type && locationType.length === 0){
                localStorage.setItem('locationType', JSON.stringify(location_type))
                setLocationType(location_type)
            }
            if(location_ && location.length === 0){
                localStorage.setItem('location', JSON.stringify(location_))
                setLocation(location)
            }
            if(skills_ && skills.length === 0){
                localStorage.setItem('skills', JSON.stringify(skills_))
                setSkills(skills_)
            }
        }
        if(employmentType.length === 0 || locationType.length === 0 || location.length === 0 || skills.length == 0){
            setEverythingOnce()
        }
    }, [])

    useEffect(()=>{
        const fetchUserExperience = async ()=>{
            const response = await fetch('http://localhost:8000/api/experience/check-experience', {
                method: 'GET',
                headers:{
                    'Authorization' : `Bearer ${accessToken}`
                },
                credentials: 'include'
            })
            if(response.ok){
                const data = await response.json()
                setUserExperiences(data.userExperiences)
            }
            setLoading(false)
        }
        fetchUserExperience()
    }, [])

    const handleAddExperience = ()=>{
        if(modalRef.current){
            modalRef.current.style.display = 'flex'
            modalRef.current.style.flexDirection = 'column'
            modalRef.current.style.gap = '20px'
        }
    }

    const handleCurrentlyWorkingChange = ()=>{
        setCurrentlyWorking((prev)=> !prev)
    }

    const handleCloseButton = ()=>{
        if(modalRef.current){
            modalRef.current.style.display = 'none'
        }
    }

    const addSkillToSelectedOptions = (selected)=>{
        setSelectedOptions(selected)
    }


    const formAction = async (formData)=>{
        const startMonth = formData.get('start-month')
        const startYear = formData.get('start-year')
        const endMonth = formData.get('end-month')
        const endYear = formData.get('end-year')

        let startDate = new Date(startYear, startMonth-1, 1)
        startDate = startDate.toISOString().slice(0, 10)
        console.log(startDate)

        formData = {
            "title" : formData.get('title'),
            "employment_type" : formData.get('employment-type'),
            "company" : formData.get('company'),
            "location" : formData.get('location'),
            "location_type" : formData.get('location-type'),
            "description" : formData.get('description'),
            "currently_working" : formData.get('currently-working'),
            "start_date" : startDate,
            "skills" : selectedOptions.map((skill)=>skill.value),
            "end_date" : null,
        }

        if(endMonth){
            let endDate = new Date(endYear, endMonth-1, 1)
            endDate = endDate.toISOString().slice(0, 10)
            formData = {...formData,  "end_date" : endDate}
        }
        console.log(formData)
        const response = await fetch('http://localhost:8000/api/experience/add-experience', {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
            },
            credentials : 'include',
            body : JSON.stringify(formData)
        })
        const data = await response.json()
        if(data.status){
            console.log(data.status)
            modalRef.current.style = 'none'
        }
    }

    return (
        <>
        {loading && <p>Loading ...</p>}

        {(userExperiences.length === 0 ) && !loading &&
            <div className="add-experience">
                <div>
                    <p className="heading">Experience</p>
                    <span className="desc">Adding experience improves your chance of getting a job.</span>
                </div>
                <div className="job">
                    <i className="bi bi-bag-fill"></i>
                    <div className="job-details">
                        <p>Job Title</p>
                        <p>Organization</p>
                        <p>Achievements</p>
                    </div>
                </div>
                <div>
                    <button onClick={handleAddExperience} className="experience-button">Add Experience</button>
                </div>
            </div>
        }

        {userExperiences.length > 0 && !loading &&
            <div className='list-jobs'>
                {userExperiences.map((experience)=>(
                    <div key={experience.id} className='users-job' id={experience.id}>
                        <div className='company-icon'>
                            <i className="bi bi-bag-fill"></i>
                        </div>
                        <div className='job-details'>
                            <div className='job-name'>
                                <span>{experience.title}</span>
                            </div>
                            <div className='company-name'>
                                <span>{experience.company}</span>
                                <span>Full time</span>
                            </div>
                            <div className='job-duration'>
                                <p>{experience.start_date}</p>
                                <span>-</span>
                                {experience.end_date && <p>{experience.end_date}</p>}
                                {!experience.end_date && <p>Present</p>}
                            </div>
                            <div className='job-location'>
                                <span>{experience.location}, India . {experience.location_type}</span>
                            </div>
                            <div className='job-description'>
                                <p>{experience.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        }

        <div className='modal' id='popup' ref={modalRef}>
            <div className='modal-heading'>
                <p>Add Experience</p>
            </div>
            <div className='modal-form'>
                <form action={formAction}>
                    <div className='field' id='title-field'>
                        <label htmlFor='title'>Title*</label>
                        <input type='text' name='title' id='title' required placeholder='Ex. Django Software developer'></input>
                    </div>

                    <div className='field' id='employment-type-field'>
                        <label htmlFor='employment-type'>Employment Type*</label>
                        <select name='employment-type' id='employment-type' >
                            {employmentType.map((employment, index) => (
                                <option key={index} value={employment}>{employment}</option>
                            ))}
                        </select>
                    </div>

                    <div className='field' id='company-field'>
                        <label htmlFor='company'>Company or Organization*</label>
                        <input type='text' name='company' id='company' required placeholder='Google'></input>
                    </div>

                    <div className='field' id='currently-working-field'>
                        <input type='checkbox' name='currently-working' onChange={handleCurrentlyWorkingChange}></input>
                        <p>I am currently working in this role.</p>
                    </div>

                    <div className='field' id='start-date'>
                        <label>Start date*</label>
                        <div className='month-year'>
                            <CustomMonthSelector name={'start-month'} />
                            <CustomYearSelector name={'start-year'} />
                        </div>
                    </div>

                    <div className='field' id='end-date'>
                        <label>End date</label>
                        <div className='month-year'>
                            <CustomMonthSelector disabled={currentlyWorking} name={'end-month'}/>
                            <CustomYearSelector disabled={currentlyWorking} name={'end-year'} />
                        </div>
                    </div>

                    <div className='field' id='location-field'>
                        <label htmlFor='location'>Location*</label>
                        <select name='location' id='location'>
                            {location.map((loc, index) => (
                                <option key={index} value={loc}>{loc}</option>
                            ) )}
                        </select>
                    </div>

                    <div className='field' id='location-type-field'>
                        <label htmlFor='location-type'>Location type*</label>
                        <select name='location-type' id='location-type'>
                            {locationType.map((type_, index) => (
                                <option key={index} value={type_}>{type_}</option>
                            ))}
                        </select>
                    </div>

                    <div className='field' id='skills-field'>
                        <label htmlFor='skills'>Skills*</label>
                        <CreatableSelect 
                            id='skills' 
                            name='skills' 
                            required 
                            isClearable 
                            isMulti 
                            options={filteredSkills}
                            value={selectedOptions}
                            onChange={addSkillToSelectedOptions}
                        />
                    </div>

                    <div className='field' id='description-field'>
                        <label>Description*</label>
                        <textarea name='description' rows={5}></textarea>
                    </div>

                    <div className='submit-button'>
                        <button className='add-experience-button'>Add Experience</button>
                    </div>
                </form>
                </div>
                <div className='close-button' onClick={handleCloseButton}>
                    <i className="bi bi-x-circle"></i>
                </div>
        </div>
        </>
    )
}

export default AddExperience