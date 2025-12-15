import { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import '../css/page.css'

const Page = ()=>{
    const accessToken = localStorage.getItem('access') || null;
    const {name} = useParams()
    const [company, setCompany] = useState(null);
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
    return (
        <>
        {company &&
        <div className='company-page' id={company.id}>
            <div>
                <span>{company.title}</span>
                <span>{company.url}</span>
                <span>Specialized in: {company.specialization}</span> 
            </div>
            <div className='add-job'>
                <Link to={`/${company.title}/job/create`}>Add Job </Link>
            </div>
        </div>
        }
        </>
    )
}

export default Page