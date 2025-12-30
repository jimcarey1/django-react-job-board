from ninja import Router
from ninja import Schema
from ninja.responses import Response
from ninja.errors import HttpError
from ninja.pagination import paginate, PageNumberPagination
from django.http import HttpRequest
from django.forms import model_to_dict
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from typing import List
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from asgiref.sync import sync_to_async

from .models import Specialization, COMPANY_SIZE, Organization, Job, Skill
from experience.models import Skill
from experience.api import SkillSchema
from .utils import get_specializations_list
from accounts.api import UserSchema
from experience.utils import async_iter

router = Router()
User = get_user_model()

class SpecializationSchema(Schema):
    id: int | None = None
    name: str

class CreatePageIn(Schema):
    name: str
    specialization: str
    url:str
    headquarters: str
    company_size: str
    overview: str

class OrganizationSchema(Schema):
    id: int
    title: str
    specialization: str
    url:str
    headquarters: str
    company_size: str
    overview: str
    user: UserSchema | None = None

class JobSchema(Schema):
    id: int | None
    title:str
    description: str
    location_type: str
    location: str
    experience: int
    skills: List[SkillSchema]
    ctc: int
    organization: OrganizationSchema | None = None



@router.post('/create-page', response=OrganizationSchema)
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
        company = await Organization.objects.acreate(
            title = data.name,
            specialization = data.specialization,
            url = data.url,
            overview = data.overview,
            company_size = data.company_size,
            headquarters = data.headquarters,
            user = user
        )
        return company
    except Exception as exc:
        print(str(exc))
        raise HttpError(status_code=500, message=str(exc))

@router.get('/{name}/page', response=OrganizationSchema)
async def get_page(request:HttpRequest, name:str):
    try:
        page = await Organization.objects.select_related('user').aget(title=name)
        return page
    except ObjectDoesNotExist:
        raise HttpError(status_code=404, message='Not found')

@router.get('/specializations', response=List[SpecializationSchema])
async def get_specializations(request:HttpRequest):
    specializations = await sync_to_async(Specialization.objects.all)()
    return specializations

@router.get('/company-size')
async def get_company_sizes(request:HttpRequest):
    company_sizes = [size[0] for size in COMPANY_SIZE]
    return company_sizes

@router.post('/{organization}/add-job', response=JobSchema)
async def add_job(request:HttpRequest, data:JobSchema, organization:str):
    authorization_header:str = request.headers.get('Authorization')
    if authorization_header and authorization_header.startswith('Bearer'):
        access_token = authorization_header.split()[1]
    try:
        payload = jwt.decode(access_token, settings.SIMPLE_JWT['SIGNING_KEY'], settings.SIMPLE_JWT['ALGORITHM'])
    except (InvalidTokenError, ExpiredSignatureError):
        raise HttpError(status_code=401, message='Unauthenticated')
    except Exception as exc:
        raise HttpError(status_code=400, message=str(exc))
    
    try:
        organization = await Organization.objects.aget(title = organization)
        job = await Job.objects.acreate(
            title = data.title,
            description = data.description,
            location = data.location,
            location_type = data.location_type,
            experience = data.experience,
            ctc = data.ctc,
            organization = organization,
        )
        async for skill in async_iter(data.skills):
            skill, _ = await Skill.objects.aget_or_create(name=skill)
            await job.skills.aadd(skill)
        job = Job.objects.select_related('user').aget(title=data.title)
        return job
    except Exception as exc:
        raise HttpError(status_code=500, message=str(exc))

@router.get('/job/{name}/{id}', response=JobSchema)
async def get_job(request:HttpRequest, name:str, id:int,):
    try:
        job = await Job.objects.select_related('organization', 'organization__user').prefetch_related('skills').aget(id=id)
        #print(JobSchema.from_orm(job))
        return job
    except ObjectDoesNotExist:
        raise HttpError(status_code=404, message='A Job with that name has not found.')

@router.get('/{organization}/jobs', response=List[JobSchema])
def get_jobs_posted_by_org(request:HttpRequest, organization:str):
    try:
        jobs =  Job.objects.filter(organization__title = organization).prefetch_related('skills')
        return jobs
    except ObjectDoesNotExist:
        raise HttpError(status_code=401, message='Not found')
    
@router.get('/jobs', response=List[JobSchema])
@paginate(PageNumberPagination, page_size=10)
def get_jobs(request:HttpRequest):
    try:
        jobs = Job.objects.select_related('organization').all().prefetch_related('skills').order_by('id')
        return jobs
    except Exception as e:
        raise HttpError(status_code=500, message='Internal server Error')