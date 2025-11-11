export async function fetchEmploymentType(){
    try{
        const response = await fetch('http://localhost:8000/api/experience/employment-type',{
            method: 'GET'
        })
        if(response.ok){
            const data = await response.json()
            if(data.employmentType){
                console.log(data.employmentType)
                return data.employmentType
            }
        }
    }catch(error){
        console.log(error)
        return null
    }
}

export async function fetchLocationType(){
    try{
        const response = await fetch('http://localhost:8000/api/experience/location-type',{
            method: 'GET'
        })
        if(response.ok){
            const data = await response.json()
            if(data.locationType){
                console.log(data.locationType)
                return data.locationType
            }
        }
    }catch(error){
        console.log(error)
        return null
    }
}

export async function fetchLocation(){
    try{
        const response = await fetch('http://localhost:8000/api/experience/location',{
            method: 'GET'
        })
        if(response.ok){
            const data = await response.json()
            if(data.location){
                console.log(data.location)
                return data.location
            }
        }
    }catch(error){
        console.log(error)
        return null
    }
}
