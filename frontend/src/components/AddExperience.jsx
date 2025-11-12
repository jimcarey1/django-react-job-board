import { useEffect, useRef, useState } from 'react'

import '../css/addexperience.css'
import { fetchEmploymentType, fetchLocationType, fetchLocation } from '../services/experience';


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

    const [currentlyWorking, setCurrentlyWorking] = useState(false);

    const modalRef = useRef(null)

    useEffect(()=>{
        const setEverythingOnce = async ()=>{
            const employ_type = await fetchEmploymentType()
            const loc_type = await fetchLocationType()
            const loc = await fetchLocation()

            if(employ_type && employmentType.length === 0){
                localStorage.setItem('employmentType', JSON.stringify(employ_type))
                setEmploymentType(employ_type)
            }
            if(loc_type && locationType.length === 0){
                localStorage.setItem('locationType', JSON.stringify(loc_type))
                setLocationType(loc_type)
            }
            if(loc && location.length === 0){
                localStorage.setItem('location', JSON.stringify(loc))
                setLocation(loc)
            }
        }
        if(employmentType.length === 0 && locationType.length === 0 && location.length === 0){
            setEverythingOnce()
        }
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
        }
    }

    const handleCloseButton = ()=>{
        if(modalRef.current){
            modalRef.current.style.display = 'none'
        }
    }

    return (
        <>
        <div className="add-experience">
            <div>
                <p className="heading">Experience</p>
                <p className="desc">Adding experience improves your chance of getting a job.</p>
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

                    <div className='field' id='company'>
                        <label htmlFor='company'>Company or Organization*</label>
                        <input type='text' name='company' id='company' required placeholder='Google'></input>
                    </div>

                    <div className='field' id='currently-working-field'>
                        <input type='checkbox' name='currently-working' onChange={handleCurrentlyWorkingChange} required></input>
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

                    <div className='field' id='location'>
                        <label htmlFor='location'>Location*</label>
                        <select name='location' id='location'>
                            {location.map((loc, index) => (
                                <option key={index} value={loc}>{loc}</option>
                            ) )}
                        </select>
                    </div>

                    <div className='field' id='location-type'>
                        <label htmlFor='location-type'>Location type*</label>
                        <select name='location-type' id='location-type'>
                            {locationType.map((type_, index) => (
                                <option key={index} value={type_}>{type_}</option>
                            ))}
                        </select>
                    </div>

                    <div className='field' id='description'>
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