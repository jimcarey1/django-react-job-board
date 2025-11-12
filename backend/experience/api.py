from ninja import Router, Schema 
from ninja.responses import Response
from ninja.errors import HttpError
from django.http import HttpRequest
from django.contrib.auth import get_user_model
from typing import Optional
from datetime import datetime
from django.conf import settings

import jwt

from .models import EMPLOYMENT_TYPE, LOCATION, LOCATION_TYPE
from .models import Experience


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
    return {"status" : "successfull"}
