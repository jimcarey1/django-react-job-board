import {Link} from 'react-router-dom'
import '../css/navbar.css'

const Home = ()=>{
    const accessToken = localStorage.getItem('access')

    if(accessToken){
        return(
            <>
            <div className="navbar">
                <div className="title">
                    <p>Django Job Board</p>
                </div>
                <div className="auth-related">
                    <button className="logout">Logout</button>
                    <div className="profile">
                        <i className="bi bi-person-circle"></i>
                    </div>
                </div>
            </div>
            </>
        )

    }else{
        return(
            <>
            <div className="navbar">
                <div className="title">
                    <p>Django Job Board</p>
                </div>
                <div className="auth-related">
                    <Link to="/register">
                        <button className="register">Register</button>
                    </Link>
                    <Link to="/login">
                        <button className="login">Login</button>
                    </Link>
                </div>
            </div>
            </>
        )
    }
}

export default Home