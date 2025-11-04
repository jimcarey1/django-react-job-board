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
                    <button>Logout</button>
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
                    <button className="register">Register</button>
                    <button className="login">Login</button>
                </div>
            </div>
            </>
        )
    }
}

export default Home