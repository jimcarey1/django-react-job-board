from ninja import Router, Schema 
from ninja.responses import Response
from ninja.errors import HttpError
from django.http import HttpRequest
from django.contrib.auth import get_user_model

from .models import EMPLOYMENT_TYPE, LOCATION, LOCATION_TYPE


router = Router()
User = get_user_model()


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