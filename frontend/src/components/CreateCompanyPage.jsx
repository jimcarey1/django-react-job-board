import { useEffect, useRef, useState } from 'react'
import '../css/createcompany.css'

//We have to build a mulit-tab form, where each tab represents a section about the company such as what they do etc.
const CreateCompanyPage = ()=>{
    const tab1Ref = useRef(null);
    const tab2Ref = useRef(null);
    const tab3Ref = useRef(null);
    const [currentTab, setCurrentTab] = useState(1)
    useEffect(()=>{
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
                        <input name="company-name" id="company-name" placeholder="Google..." required />
                    </div>
                    <div className="field">
                        <label>Specialization<span className='required'>*</span></label>
                        <select></select>
                    </div>
                    <div className="field">
                        <label>Company Website<span className='required'>*</span></label>
                        <input type="url" name="website" id="website" placeholder="https://www.example.com" required />
                    </div>
                    <div className='navigation-button'>
                        <button className='tab1-next' onClick={()=>setCurrentTab(prev=>prev+1)}>next</button>
                    </div>
                </div>

                <div className="tab2" id="2" ref={tab2Ref}>
                    <div className="field">
                        <label htmlFor="headquarters">Headquaters<span className="required">*</span></label>
                        <input type="text" name="headquaters" id="headquarters" placeholder="Hyderabad, India" required />
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
                        <textarea name="overview" id="overview" required />
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