import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import '../css/job.css'

const Job = ({job_=null})=>{
    console.log(`The job is ${job_.id}`)
    //checking for accessToken in the localStorage.
    const accessToken = localStorage.getItem('access') || null;

    const {name, id} = useParams() 
    const [job, setJob] = useState(job_)

    if(!job){
        //We are fetching the job when the component renders.
        useEffect(()=>{
            const fetchJob = async ()=>{
                try{
                    const response = await fetch(`http://localhost:8000/api/company/job/${name}/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        credentials: 'include'
                    })
                    if(response.ok){
                        try{
                            const jobData = await response.json()
                            console.log(jobData)
                            setJob(jobData)
                        }catch(error){
                            console.log(error)
                        }
                    }
                }catch(error){
                    console.log(error)
                }
            }
            fetchJob()
        }, [])
    }

    //Rendering the job details on the page.
    return (
        <div className="job-page">
            <div className="job-details">
                <div className="basic-info">
                    <span className="job-title">{job.title}</span>
                    <span className="posted-by">Posted by <span className="org-title">{job.organization.title}</span></span>
                </div>
                <div className="job-desc">
                    <p className="job-desc-heading">Job Description</p>
                    <span>{job.description}</span>
                </div>
                <div className="skills">
                    <span className="req-skills-heading">Required skills: </span>
                    <div>
                        {job.skills.map((skill)=>(
                            <span>{skill.name}, </span>
                        ))}
                    </div>
                </div>
                <div className="experience">
                    <span className="req-experience-heading">Experience </span>
                    <span>We need a candidate that has an experience of atleast: {job.experience} years.</span>
                </div>
                <div className="ctc">
                    <span className="provided-ctc-heading">Provided CTC</span>
                    <span>CTC: {job.ctc}</span>
                </div>
            </div>
        </div>
    )
}

export default Job