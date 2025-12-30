import '../css/home.css'

import Navbar from '../components/Navbar'
import JobSearch from '../components/JobSearch'
import JobCard from '../components/JobCard'
import Job from './Job'
import {createPortal} from 'react-dom'
import { useState, useEffect, useRef } from 'react'

const accessToken = localStorage.getItem('access') 

const Home = ()=>{
    const [jobs, setJobs] = useState([])
    const [selectedJob, setSelectedJob] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const describeJobRef = useRef(null)
    useEffect(()=>{
        const fetchJobs = async ()=>{
            try{
                const response = await fetch(`http://localhost:8000/api/company/jobs?page=${currentPage}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${accessToken}`
                    },
                    credentials: 'include'
                })
                if(response.ok){
                    try{
                        const data = await response.json()
                        setJobs(data.items)
                    }catch(error){
                        console.log(error)
                    }
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchJobs()
    }, [currentPage])

    const handleDescribeJob = (event)=>{
        const jobIdElement = event.target.previousElementSibling
        const jobId = jobIdElement.textContent
        const job = jobs.find(j=> j.id == jobId)
        setSelectedJob(job)
    }
    
    return (
        <>
            <Navbar/>
            <JobSearch />
            <div className='show-jobs'>
                <div className='list-jobs'>
                    {jobs.map((job)=>(
                        <JobCard key={job.id} job={job} handleDescribeJob={handleDescribeJob}/>
                    ))}
                    <button className='next-page-button' onClick={()=>setCurrentPage((page)=>page+1)}>Next</button>
                </div>
                <div className='describe-job' ref={describeJobRef}>
                    {describeJobRef.current && selectedJob &&
                    createPortal(
                        <Job job_={selectedJob} />,
                        describeJobRef.current
                    )
                    }
                </div>
            </div>
        </>
    )

}

export default Home