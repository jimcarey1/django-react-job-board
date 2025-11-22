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

            </div>
        </main>
        </>
    )
}

export default Page