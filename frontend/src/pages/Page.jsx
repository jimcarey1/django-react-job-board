import '../css/page.css'

const Page = ()=>{
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
                    <span>Home</span>
                    <span>About</span>
                    <span>Posts</span>
                    <span>Jobs</span>
                    <span>Life</span>
                    <span>People</span>
                </div>
            </div>
            <div className='company-overview'>
                <span className='overview-heading'>Overview</span>
                <span className='overview-description'> 
                    Every company has a mission. What's ours? To empower every person 
                    and every organization to achieve more. We believe technology can and 
                    should be a force for good and that meaningful innovation contributes to a 
                    brighter world in the future and today. Our culture doesn’t 
                    just encourage curiosity; it embraces it. Each day we make progress 
                    together by showing up as our authentic selves. We show up with a 
                    learn-it-all mentality. We show up cheering on others, knowing 
                    their success doesn't diminish our own. We show up every day open 
                    to learning our own biases, changing our behavior, and inviting 
                    in differences. Because impact matters. 
                    <br></br>
                    <br></br>
                    Microsoft operates in 190 countries and is made up of 
                    approximately 228,000 passionate employees worldwide.
                </span>
                <span className='show-details'>Show details</span>
                </div>
        </main>
        </>
    )
}

export default Page