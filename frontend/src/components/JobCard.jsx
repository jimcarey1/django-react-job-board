import '../css/jobcard.css'

const JobCard = ({job, handleDescribeJob})=>{
    return(
        <div className="job-card">
            <div className="job-info">
                <span className='job-id'>{job.id}</span>
                <span className="title" onClick={handleDescribeJob}>{job.title}</span>
                <span className="posted-by">Posted by <span className='org-name'>{job.organization.title}</span></span>
            </div>
            <div className="description">
                <p>{job.description}</p>
            </div>
            <div className="ctc">
                <span>Provided ctc: <span className='ctc-number'>{job.ctc}</span></span>
            </div>
        </div>
    )
}

export default JobCard