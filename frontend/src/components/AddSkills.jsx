import { useEffect, useRef, useState } from 'react'
import '../css/addexperience.css'

const AddSkills = () =>{
    const [userSkills, setUserSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const skillFormRef = useRef(null)
    const accessToken = localStorage.getItem('access') || null 

    const handleAddSkill = ()=>{
        if(skillFormRef.current){
            skillFormRef.current.style.display = 'flex'
            skillFormRef.current.style.flexDirection = 'column'
            skillFormRef.current.style.gap = '10px'
        }
    }

    const addSkill = async (formData)=>{
        const name = formData.get('name')
        if(name){
            formData = {
                "name" : name
            }
        }

        const response = await fetch('http://localhost:8000/api/experience/add-skill', {
            method: 'POST', 
            headers:{
                "Content-Type" : "application/json",
                'Authorization': `Bearer ${accessToken}`,
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        if(response.ok){
            const data = await response.json()
            console.log(data)
        }
    }

    useEffect(()=>{
        const fetchUserSkills = async ()=>{
            const response = await fetch('http://localhost:8000/api/experience/check-skills', {
                'method' : 'GET',
                headers:{
                    'Authorization' : `bearer ${accessToken}`,
                },
                credentials: 'include'
            })
            if(response.ok){
                const userSkills = await response.json()
                setUserSkills(userSkills)
                console.log(userSkills)
            }
            setLoading(false)   
        }
        fetchUserSkills()
    }, [])


    return (
        <>
        {loading && <p>Loading...</p>}
        {userSkills.length == 0 && !loading &&
        <div className="add-skills">
            <div>
                <p className="heading">Skills</p>
                <p className="desc">Communicate your fit for new opportunities – 50% of hirers use skills data to fill their roles</p>
            </div>
            <div className="skill">
                <div className="skill-name">
                    <p>Soft Skills</p>
                    <p>Technical Skills</p>
                </div>
            </div>
            <div>
                <button className="skill-button" onClick={handleAddSkill}>Add Skill</button>
            </div>
        </div>
        }

        {userSkills.length > 0 && !loading &&
        <div className='display-skills'>
            <h2>Your skills</h2>
            <ul className='user-skills'>
                {userSkills.map((skill)=>(
                    <li className='skill-abc' id={skill.id} key={skill.id}>
                        {skill.name}
                        <i className="bi bi-pencil"></i>
                        <i className="bi bi-trash"></i>
                    </li>
                ))}
            </ul>
        </div>
        }
        <div className='skill-form' ref={skillFormRef}>
            <form className='add-skill-form' action={addSkill}>
                <div className='field' id='name-field'>
                    <label>Skill*</label>
                    <input type='text' id='add-skill' name='name' required />
                </div>
                <div>
                    <button className='add-skill-button'>Add Skill</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default AddSkills