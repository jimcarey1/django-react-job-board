import { useEffect, useRef, useState } from 'react'
import AsyncSelect from 'react-select/async'
import '../css/createcompany.css'

//We have to build a mulit-tab form, where each tab represents a section about the company such as what they do etc.
const CreateCompanyPage = ()=>{
    //We want to update the dom on state changes, so we are using useRef.
    const tab1Ref = useRef(null);
    const tab2Ref = useRef(null);
    const tab3Ref = useRef(null);

    //Based on the tab value, we will display that particular tab in the form.
    const [currentTab, setCurrentTab] = useState(1)

    //we are storing and managing the form values using useState hook.
    const [companyName, setCompanyName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [companyUrl, setCompanyUrl] = useState('');
    const [headquarters, setHeadquarters] = useState([]);
    const [companySize, setCompanySize] = useState('');
    const overviewRef = useRef(null);

    const [loading, setLoading] = useState(true);

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
                        <select></select>
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
                        />
                    </div>
                    <div className="field">
                        <label>Company Size<span className="required">*</span></label>
                        <select></select>
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
                        <button className='create-company-page-button'>Submit</button>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}

export default CreateCompanyPage