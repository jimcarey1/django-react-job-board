import { useRef } from 'react'
import '../css/addexperience.css'

const AddSkills = () =>{
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

    return (
        <>
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