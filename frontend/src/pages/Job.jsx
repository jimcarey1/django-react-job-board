import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const Job = ()=>{
    const {name, id} = useParams() 
    const [job, setJob] = useState({})
    useEffect(()=>{
        const fetchJob = async ()=>{
            try{
                const response = await fetch(`http://localhost:8000/api/company/job/${name}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer `
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
    return (
        <div className="job-page">
            <div className="job-details">
                <span>{job.title}</span>
                <span>Posted by {job.organization.title}</span>
                {job.description}
            </div>
        </div>
    )
}

export default Job