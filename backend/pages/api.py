from ninja import Router
from ninja import Schema
from ninja.responses import Response
from django.http import HttpRequest
from typing import List
from asgiref.sync import sync_to_async

from .models import Specialization, COMPANY_SIZE
from .utils import get_specializations_list

router = Router()

class SpecializationOut(Schema):
    specializations: List[str]

class CompanySizeOut(Schema):
    companySize: List[str]

@router.get('/create-page')
async def create_page():
    pass

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