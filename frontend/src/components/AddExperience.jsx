import { useEffect, useRef, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import '../css/addexperience.css'
import { fetchEmploymentType, fetchLocationType, fetchLocation } from '../services/experience';

const AddExperience = () =>{
    const [employmentType, setEmploymentType] = useState(JSON.parse(localStorage.getItem('employmentType')) || [])
    const [locationType, setLocationType] = useState(JSON.parse(localStorage.getItem('locationType')) || [])
    const [location, setLocation] = useState(JSON.parse(localStorage.getItem('location')) || [])

    const modalRef = useRef(null)

    const [selectedOption, setSelectedOption] = useState('');

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
                <div className='field' id='title-field'>
                    <label htmlFor='title'>Title*</label>
                    <input type='text' name='title' id='title' required placeholder='Ex. Django Software developer'></input>
                </div>

                <div className='field' id='employment-type-field'>
                    <label htmlFor='employment-type'>Employment Type*</label>
                    <select name='employment-type' id='employment-type' value={selectedOption} >
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
                    <input type='checkbox' name='currently-working' required></input>
                    <p>I am currently working in this role.</p>
                </div>

                <div className='field' id='start-date'>
                    <label>Start date*</label>
                    <div className='month-year'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker/>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker/>
                        </LocalizationProvider>
                    </div>
                </div>

                <div className='field' id='end-date'>
                    <label>End date</label>
                    <div className='month-year'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label={'"year"'} openTo="year" />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label={'"month"'} openTo="month" views={['year', 'month', 'day']}/>
                        </LocalizationProvider>
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
            </div>
            <div className='close-button' onClick={handleCloseButton}>
                <i className="bi bi-x-circle"></i>
            </div>
        </div>
        </>
    )
}

export default AddExperience