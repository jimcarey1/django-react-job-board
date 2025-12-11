from ninja import Router
from ninja import Schema
from ninja.responses import Response
from ninja.errors import HttpError
from django.http import HttpRequest
from django.forms import model_to_dict
from django.contrib.auth import get_user_model
from django.conf import settings
from typing import List
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from asgiref.sync import sync_to_async

from .models import Specialization, COMPANY_SIZE, Organization
from .utils import get_specializations_list

router = Router()
User = get_user_model()

class SpecializationOut(Schema):
    specializations: List[str]

class CompanySizeOut(Schema):
    companySize: List[str]

class CreatePageIn(Schema):
    name: str
    specialization: str
    url:str
    headquarters: str
    company_size: str
    overview: str


@router.post('/create-page')
async def create_page(request:HttpRequest, data:CreatePageIn):
    authorization_header:str = request.headers.get('Authorization')
    if authorization_header and authorization_header.startswith('Bearer'):
        access_token = authorization_header.split()[1]
    try:
        payload = jwt.decode(access_token, settings.SIMPLE_JWT['SIGNING_KEY'], settings.SIMPLE_JWT['ALGORITHM'])
    except (ExpiredSignatureError,InvalidTokenError):
        raise HttpError(status_code=401, message='Unauthenticated')
    except Exception as exc:
        raise HttpError(status_code=401, message=str(exc))

    try:
        user_id = payload.get('user_id')
        user = await User.objects.aget(id=user_id)
        if(not data.name or not data.specialization or not data.company_size or not data.headquarters or not data.url or not data.overview):
            raise HttpError(status_code=400, message='Invalid form information')
        organization = await Organization.objects.acreate(
            title = data.name,
            specialization = data.specialization,
            url = data.url,
            overview = data.overview,
            company_size = data.company_size,
            headquarters = data.headquarters,
            user = user
        )
        organization_dict = model_to_dict(organization, fields=['title', 'specialization', 'url', 'overview', 'headquarters', 'company_size'])
        response = Response({'company':organization_dict})
        response.status_code = 200
        return response
    except Exception as exc:
        print(str(exc))
        raise HttpError(status_code=500, message=str(exc))
    
        

@router.get('/get-page')
async def get_page():
    pass

@router.get('/specializations', response=SpecializationOut)
async def get_specializations(request:HttpRequest):
    specializations = await sync_to_async(get_specializations_list)(Specialization)
    response = Response({'specializations':specializations})
    response.status_code = 200
    return response

@router.get('/company-size')
async def get_company_sizes(request:HttpRequest):
    company_sizes = [size[0] for size in COMPANY_SIZE]
    response = Response({'companySize':company_sizes})
    response.status_code = 200
    return response