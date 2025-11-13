from ninja import Router, Schema 
from ninja.responses import Response
from ninja.errors import HttpError
from django.http import HttpRequest, JsonResponse
from django.contrib.auth import get_user_model
from typing import Optional, List
from datetime import datetime
from django.conf import settings
from asgiref.sync import sync_to_async


import jwt

from .models import EMPLOYMENT_TYPE, LOCATION, LOCATION_TYPE
from .models import Experience, Skill
from .utils import fetch_skills_from_the_db, async_iter, convert_model_to_dict


router = Router()
User = get_user_model()

class AddExperience(Schema):
    title : str
    employment_type : str
    company : str
    location : str
    location_type : str
    description : str
    currently_working : str
    start_date : str
    end_date : Optional[str]
    skills : List[str]

class AddSkill(Schema):
    name : str



@router.get('/employment-type')
def get_employment_type(request: HttpRequest):
    employment_type = [x for (x, y) in EMPLOYMENT_TYPE]
    return {"employmentType": employment_type}

@router.get('/location-type')
def get_location_type(request: HttpRequest):
    location_type = [x for (x, y) in LOCATION_TYPE]
    return {"locationType": location_type}

@router.get('/location')
def get_location(request: HttpRequest):
    location = [x for (x,y) in LOCATION]
    return {"location": location}


@router.post('/add-experience')
async def add_experience(request: HttpRequest, data: AddExperience):
    start_date = data.start_date
    start_date_object = datetime.strptime(start_date, "%Y-%m-%d").date()
    
    currently_working = True if data.currently_working == "on" else False

    refresh_token = request.get_signed_cookie('refresh_token', salt=settings.SALT)
    if refresh_token:
        payload = jwt.decode(refresh_token, options={'verify_signature':False})
        user_id = payload['user_id']
        user = await User.objects.aget(id=user_id)
    experience = Experience(title=data.title,
                            employment_type = data.employment_type,
                            company = data.company,
                            currently_working = currently_working,
                            start_date = start_date_object,
                            location = data.location,
                            location_type = data.location_type,
                            description = data.description,
                            employee = user)
    if data.end_date is not None:
        end_date = data.end_date
        end_date_object = datetime.strptime(end_date, "%Y-%m-%d")
        experience.end_date = end_date_object
    await experience.asave()
    async for skill in async_iter(data.skills):
        skill_obj, created = await Skill.objects.aget_or_create(name=skill, skill_type='Technical Skills')
        await experience.skills.aadd(skill_obj.id)
    return {"status" : "successfull"}

@router.get('/skills')
async def get_skills(request: HttpRequest):
    skills = await sync_to_async(fetch_skills_from_the_db)()
    response = JsonResponse({"skills":skills})
    response.status_code = 200
    return response


@router.post('/add-skill')
async def add_skill(request: HttpRequest, data:AddSkill):
    access_token = request.headers.get('Authorization')
    if access_token:
        access_token = access_token.split(' ')[1]
    try:
        payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError as e:
        response = Response({"status" : "error", "reason":str(e)})
        response.status_code = 401
        return response
    except jwt.InvalidTokenError as e:
        response = Response({"status" : "error", "reason":str(e)})
        response.status_code = 401
        return response
    user_id = payload.get('user_id')
    user = await User.objects.aget(id=user_id)
    skill_name = data.name
    skill, created = await Skill.objects.aget_or_create(name=skill_name, skill_type='Technical Skills')
    await skill.users.aadd(user)
    skill_dict = await sync_to_async(convert_model_to_dict)(skill)
    response = Response({"skill" : skill_dict})
    response.status_code = 200
    return response
