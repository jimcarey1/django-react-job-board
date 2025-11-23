import { useEffect, useState } from 'react'
import PageHome from '../components/page/PageHome'
import '../css/page.css'

const Page = ()=>{
    const [currentSection, setCurrentSection] = useState("Home")
    const handleSectionChange = (event)=>{
        event.preventDefault()
        const value = event.target.textContent
        setCurrentSection(value)
    }
    
    return (
        <>
        <main className="company-page" id="1">
            <div className="company-info-card">
                <div className="company-icons">

                </div>
                <div className="basic-details">
                    <div className="title">
                        <span>Microsoft</span>
                    </div>
                    <div className="details">
                        <span>Software Development . Redmond, Washington . 27M followers . 10K+ Employees</span>
                    </div>
                </div>
                <div className="networking">
                    <button className='follow-button'>+ Follow</button>
                    <button className='learn-more'>Learn more</button>
                    <i className="bi bi-three-dots"></i>
                </div>
                <div className="navbar-section">
                    <span id='home' onClick={handleSectionChange}>Home</span>
                    <span id='about' onClick={handleSectionChange}>About</span>
                    <span id='posts' onClick={handleSectionChange}>Posts</span>
                    <span id='jobs' onClick={handleSectionChange}>Jobs</span>
                    <span id='life' onClick={handleSectionChange}>Life</span>
                    <span id='people' onClick={handleSectionChange}>People</span>
                </div>
            </div>
            <PageHome />
        </main>
        </>
    )
}

export default Page