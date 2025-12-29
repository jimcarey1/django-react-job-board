import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const Job = ({job_=null})=>{
    console.log(`The job is ${job_.id}`)
    //checking for accessToken in the localStorage.
    const accessToken = localStorage.getItem('access') || null;

    const {name, id} = useParams() 
    const [job, setJob] = useState(job_)

    if(!job){
        console.log('useEffect running')
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
                {job && 
                <>
                    <span>{job.title}</span>
                    {/**<span>Posted by {job.organization.title}</span>*/}
                    {job.description}
                </>}
            </div>
        </div>
    )
}

export default Job