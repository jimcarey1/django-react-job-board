import {Link} from 'react-router-dom'
import '../css/navbar.css'

import Navbar from '../components/Navbar'
import JobSearch from '../components/jobSearch'

const Home = ()=>{
    return (
        <>
            <Navbar />
            <JobSearch />
        </>
    )

}

export default Home