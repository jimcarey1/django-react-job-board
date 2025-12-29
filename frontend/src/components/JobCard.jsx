const JobCard = ({job})=>{
    return(
        <div className="job-card">
            <div className="">
                <span className="title">{job.title}</span>
                <span className="posted-by">Posted by {}</span>
            </div>
            <div className="description">
                <p>A description that only shows the first 30 words.</p>
            </div>
            <div className="ctc">
                <span>ctc</span>
            </div>
        </div>
    )
}

export default JobCard