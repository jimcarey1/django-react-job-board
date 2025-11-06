import '../css/jobsearch.css';

const JobSearch = ()=>{
    return(
        <>
        <div className="search-bar">
            <div className="search-input">
                <i className="bi bi-search"></i>
                <input type="text" placeholder="Job title, Keywords or company" name="job" required />
            </div>
            <div className="search-input">
                <i className="bi bi-geo-alt"></i>
                <input type="text" placeholder="Location" name="location" required />
            </div>
            <button className="find-jobs">Find Jobs</button>
        </div>
        </>
    )
}

export default JobSearch