import { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import JobCard from '../components/JobCard'
import '../css/page.css'

const Page = ()=>{
    const accessToken = localStorage.getItem('access') || null;
    const {name} = useParams()
    const [company, setCompany] = useState(null)
    const [companyJobs, setCompanyJobs] = useState([])

    //fetch the company details.
    useEffect(()=>{
        const fetchCompany = async ()=>{
            try{
                const response = await fetch(`http://localhost:8000/api/company/${name}/page`, {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    credentials: 'include'
                })
                if(response.ok){
                    try{
                        const data = await response.json()
                        setCompany(data)
                    }catch(error){
                        console.log(error)
                    }
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchCompany()
    }, [])

    //fetching the jobs listed by this company.
    useEffect(()=>{
        const fetchCompanyJobListings = async ()=>{
            try{
                const response = await fetch(`http://localhost:8000/api/company/${name}/jobs`, {
                    method: 'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${accessToken}`,
                    },
                    credentials: 'include',
                })
                if(response.ok){
                    try{
                        const jobsData = await response.json()
                        setCompanyJobs(jobsData)
                    }catch(error){
                        console.log(error)
                    }
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchCompanyJobListings()
    }, [])

    return (
        <>
        {company &&
        <div className='company-page' id={company.id}>
            <div className='company-details'>
                <span className='company-name'>{company.title}</span>
                <span className='company-domain'>{company.url}</span>
                <span className='company-specialization'>Specialized in: {company.specialization}</span> 
            </div>
            <div className='add-job'>
                <Link to={`/${company.title}/job/create`}>Add Job </Link>
            </div>
            <div className='list-jobs'>
                {companyJobs.map((job)=>(
                    <div className='job-card'>
                        <JobCard job={job} key={job.id} organization={company.title}/>
                    </div>
                ))}
            </div>
        </div>
        }
        </>
    )
}

export default Page