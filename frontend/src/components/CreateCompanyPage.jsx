import { useEffect, useRef, useState } from 'react'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import '../css/createcompany.css'
import {useNavigate} from 'react-router-dom'

//We have to build a mulit-tab form, where each tab represents a section about the company such as what they do etc.
const CreateCompanyPage = ()=>{
    const accessToken = localStorage.getItem('access') || null;

    const navigate = useNavigate()

    //We want to update the dom on state changes, so we are using useRef.
    const tab1Ref = useRef(null)
    const tab2Ref = useRef(null)
    const tab3Ref = useRef(null)

    //Based on the tab value, we will display that particular tab in the form.
    const [currentTab, setCurrentTab] = useState(1)

    const [specializations, setSpecializations] = useState(JSON.parse(localStorage.getItem('specializations')) || [])
    const [companySize, setCompanySize] = useState(JSON.parse(localStorage.getItem('companySize')) || [])
    const [headquarters, setHeadquarters] = useState([])

    //we are storing and managing the form values using useState hook.
    const [companyName, setCompanyName] = useState('')
    const [companyUrl, setCompanyUrl] = useState('')
    const [selectedHeadquarters, setSelectedHeadquarters] = useState('')
    const [selectedSpecialization, setSelectedSpecialization] = useState('')
    const [selectedCompanySize, setSelectedCompanySize] = useState('')
    const overviewRef = useRef(null);

    const [loading, setLoading] = useState(true);

    const changeArrayToSelectCompatibleOptions = (inputArray)=>{
        return inputArray.map((value)=>({'label':value, 'value':value}))
    }

    /* Based on the value of the currentTab, we will display that particular tab in the form. 
       Everytime, the currentTab state changes, this useEffect runs.
    */
    useEffect(()=>{
        {/* We will run this useEffect everytime we update the state for the currentTab. */}
        const Navigate = ()=>{
            if(currentTab == 1){
                if(tab1Ref.current && tab2Ref.current && tab3Ref.current){
                    tab1Ref.current.style.display = 'flex'
                    tab2Ref.current.style.display = 'none'
                    tab3Ref.current.style.display = 'none'
                }
            }else if(currentTab==2){
                if(tab1Ref.current && tab2Ref.current && tab3Ref.current){
                    tab2Ref.current.style.display = 'flex'
                    tab2Ref.current.style.flexDirection = 'column'
                    tab2Ref.current.style.gap = '20px'
                    tab1Ref.current.style.display = 'none'
                    tab3Ref.current.style.display = 'none'
                }
            }else if(currentTab==3){
                if(tab1Ref.current && tab2Ref.current && tab3Ref.current){
                    tab3Ref.current.style.display = 'flex'
                    tab3Ref.current.style.flexDirection = 'column'
                    tab3Ref.current.style.gap = '20px'
                    tab1Ref.current.style.display = 'none'
                    tab2Ref.current.style.display = 'none'
                }
            }
        }
        Navigate()
    }, [currentTab])

    /* Right now, I am storing my cities data in json file in public folder.
        The file is almost 12MB and not recommended to store this in frontend
        in the production setting.
        Store the cities data in the backend and fetch cities based on the user input. 
    */
    useEffect(()=>{
        const fetchCityCountry = async ()=>{
            try{
                const response = await fetch('/data/modified_cities.json')
                if(response.ok){
                    try{
                        const data = await response.json()
                        setHeadquarters(data)
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

    /* This useEffect fetches specializations and companysizes from the backend, 
        if they are not present in the localStorage. 
    */
    useEffect(()=>{
        const fetchSpecializations = async ()=>{
            try{
                const response = await fetch('http://localhost:8000/api/company/specializations', {
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    credentials: 'include'
                })
                if(response.ok){
                    try{
                        let data = await response.json()
                        data = changeArrayToSelectCompatibleOptions(data.specializations)
                        setSpecializations(data)
                        localStorage.setItem('specializations', JSON.stringify(data))
                    }catch(error){
                        console.log(error)
                    }
                }
            }catch(error){
                console.log(error)
            }
        }
        const fetchCompanySize = async ()=>{
            try{
                const response = await fetch('http://localhost:8000/api/company/company-size', {
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    credentials: 'include'
                })
                if(response.ok){
                    try{
                        let data = await response.json()
                        data = changeArrayToSelectCompatibleOptions(data.companySize)
                        setCompanySize(data)
                        localStorage.setItem('companySize', JSON.stringify(data))
                    }catch(error){
                        console.log(error)
                    }
                }
            }catch(error){
                console.log(error)
            }
        }

        if(specializations.length == 0){
            fetchSpecializations()
        }
        if(companySize.length == 0){
            fetchCompanySize()
        }
    }, [])

    /* Based on the input value, we filters the options by that input value.
       This piece of code is from the react-select documentation.
       You can find the code here in promises section. 
       https://react-select.com/async
    */
    const loadOptions = (inputValue) => {
        if (!inputValue) {
        return Promise.resolve([])
        }

        const filtered = headquarters.filter(city =>
            city.label.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, 100)

        return Promise.resolve(filtered)
    };

    //This is a function, when user fills the form and click on submit button.
    const handleSubmit = async (event)=>{
        event.preventDefault()
        {/*checking if all the form variables are populated and has some value.*/}
        if(companyName && selectedSpecialization && companyUrl && selectedHeadquarters && selectedCompanySize && overviewRef.current){
            const companyOverview = overviewRef.current.value
            try{
                const response = await fetch('http://localhost:8000/api/company/create-page', {
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${accessToken}`,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        'name':companyName,
                        'specialization':selectedSpecialization.value,
                        'url':companyUrl,
                        'headquarters': selectedHeadquarters.value,
                        'company_size': selectedCompanySize.value,
                        'overview': companyOverview
                    })
                })
                if(response.ok){
                    try{
                        let data = await response.json()
                        data = data.company
                        navigate(`/${data.title}/page`)
                    }catch(error){
                        console.log(error)
                    }
                }
            }catch(error){
                console.log(error)
            }
        }
    }

    //This is a function, when user fills the form and click on cancel button.
    const handleCancel = ()=>{

    }


    return(
        <>
        <div className="create-company-page">
            <p>Become an Employer...</p>
            {/* This form is a basic multi-tab form, that displays one tab at a time 
                We are dividing each tab into a section where the input fields are 
                relatively similar.
            */}
            <form>
                <div className="tab1" id="1" ref={tab1Ref}>
                    <div className="field">
                        <label htmlFor="company-name">Company Name<span className="required">*</span></label>
                        <input 
                            name="company-name" 
                            id="company-name" 
                            placeholder="Google..." 
                            required 
                            value={companyName}
                            onChange={(event)=>setCompanyName(event.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label>Specialization<span className='required'>*</span></label>
                        <Select 
                            cacheOptions
                            options = {specializations}
                            isSearchable
                            value={selectedSpecialization}
                            onChange={(selected)=>setSelectedSpecialization(selected)}
                        />
                    </div>
                    <div className="field">
                        <label>Company Website<span className='required'>*</span></label>
                        <input 
                            type="url" 
                            name="website" 
                            id="website" 
                            placeholder="https://www.example.com" 
                            required 
                            value={companyUrl}
                            onChange={(event)=>setCompanyUrl(event.target.value)}
                            />
                    </div>
                    <div className='navigation-button'>
                        <button className='tab1-next' onClick={()=>setCurrentTab(prev=>prev+1)}>next</button>
                    </div>
                </div>

                <div className="tab2" id="2" ref={tab2Ref}>
                    {loading && <p>Loading...</p>}
                    <div className="field">
                        <label>Headquaters<span className="required">*</span></label>
                        {/* We are using AsyncSelect, because there are more than 100K options that we need to load.
                            and we are loading options by filtering based on user input 
                        */}
                        <AsyncSelect
                            cacheOptions
                            loadOptions={loadOptions}
                            value={selectedHeadquarters}
                            onChange={(selected)=>setSelectedHeadquarters(selected)}
                        />
                    </div>
                    <div className="field">
                        <label>Company Size<span className="required">*</span></label>
                        <Select 
                            cacheOptions
                            options={companySize}
                            isSearchable
                            value={selectedCompanySize}
                            onChange={(selected)=>setSelectedCompanySize(selected)}
                        />
                    </div>
                    <div className='navigation-button'>
                        <button className='tab2-previous' onClick={()=>setCurrentTab((prev)=>prev-1)}>previous</button>
                        <button className='tab2-next' onClick={()=>setCurrentTab((prev)=>prev+1)}>next</button>
                    </div>
                </div>

                <div className="tab3" id="3" ref={tab3Ref}>
                    <div className="field">
                        <label htmlFor="overview">Overview<span className="required">*</span></label>
                        <textarea  
                            id="overview" 
                            required 
                            ref={overviewRef}
                        />
                    </div>
                    <div className='navigation-button'>
                        <button className='tab3-previous' onClick={()=>setCurrentTab((prev)=>prev-1)}>previous</button>
                        <button className='create-company-page-button' onClick={(event)=>handleSubmit(event)}>Submit</button>
                        <button className='create-company-cancel-button'>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}

export default CreateCompanyPage