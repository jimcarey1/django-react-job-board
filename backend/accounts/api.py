# accounts/api.py
from ninja import Router, Schema
from ninja.responses import Response
from ninja.errors import HttpError
from django.http import HttpRequest
from django.contrib.auth import get_user_model, aauthenticate
from django.forms import model_to_dict
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from asgiref.sync import sync_to_async

import jwt
from jwt.exceptions import ExpiredSignatureError

router = Router()
User = get_user_model()

class RegisterIn(Schema):
    email: str
    password: str
    first_name: str
    last_name: str

class LoginIn(Schema):
    email: str
    password: str

class TokenOut(Schema):
    access: str

@router.post("/register", response=TokenOut)
async def register(request: HttpRequest, data: RegisterIn):
    if await User.objects.filter(email = data.email).aexists():
        raise HttpError(status_code=400, message='A User with this email already exists.')
    user = User(email=data.email, first_name=data.first_name, last_name=data.last_name)
    user.set_password(data.password)
    await user.asave()
    refresh = await sync_to_async(RefreshToken.for_user)(user)
    access = str(refresh.access_token)
    response = Response({"access": access, "user":model_to_dict(user, fields=['id', 'email', 'first_name', 'last_name'])})
    response.set_signed_cookie('refresh_token', str(refresh), settings.SALT, max_age=7*24*60*60)
    return response 

@router.post("/login")
async def login(request: HttpRequest, data: LoginIn):
    user = await aauthenticate(email=data.email, password=data.password)
    if not user:
        raise HttpError(status_code=400, message='Invalid credentials.')
    refresh = await sync_to_async(RefreshToken.for_user)(user)
    access = str(refresh.access_token)
    response = Response({"access": access, "user":model_to_dict(user, fields=['id', 'email', 'first_name', 'last_name'])})
    response.set_signed_cookie('refresh_token', str(refresh), settings.SALT, max_age=7*24*60*60)
    return response

# Google social login: frontend sends id_token (from Google Identity)
class GoogleTokenIn(Schema):
    id_token: str 

@router.post("/google/", response=TokenOut)
async def google_login(request: HttpRequest, data:GoogleTokenIn):
    try:
        # Verify the token with Google's public keys
        idinfo = await sync_to_async(google_id_token.verify_oauth2_token) \
                        (data.id_token, 
                         google_requests.Request(), 
                         settings.GOOGLE_CLIENT_ID
                        )
        # idinfo contains email, sub (user id), name, picture...
        email = idinfo.get("email")
        first_name = idinfo.get('given_name')
        last_name = idinfo.get('family_name')
        if not email:
            raise Exception("No email in ID token")
        user, created = await User.objects.aget_or_create(email=email, first_name=first_name, last_name=last_name)
        # Optionally set other fields if created
        refresh = await sync_to_async(RefreshToken.for_user)(user)
        access_token = str(refresh.access_token)
        response = Response({"access": access_token, "user": model_to_dict(user, fields=['id', 'email', 'first_name', 'last_name'])})
        response.status_code = 200
        response.set_signed_cookie('refresh_token', str(refresh), settings.SALT, max_age=7*24*60*60)
        return response
    except Exception as e:
        # token invalid or verification failed
        raise HttpError(status_code=500, message=str(e))



@router.post('/access_token', response=TokenOut)
async def new_access_token(request: HttpRequest, data:TokenOut):
    access_token = data.access
    try:
        payload = jwt.decode(access_token, settings.SIMPLE_JWT['SIGNING_KEY'], settings.SIMPLE_JWT['ALGORITHM'], options={'verify_exp':False})
    except Exception as e:
        raise HttpError(status_code=400, message='Invalid Access Token')
    refresh_token:str = request.get_signed_cookie('refresh_token', salt=settings.SALT)
    if not refresh_token:
        raise HttpError(status_code=400, message='no refresh token, you are logged out.')
    try:
        refresh_token = RefreshToken(refresh_token)
        return {'access': str(refresh_token.access_token)}
    except Exception as e:
        raise HttpError(status_code=400, message=str(e))


@router.get('/logout')
async def logout(request: HttpRequest):
    try:
        response = Response({"message": "logout successfull"})
        response.delete_cookie('refresh_token', path='/')
        response.status_code = 200
        return response
    except Exception as e:
        response = Response({"message" : "logout failed", "reason": str(e)})
        response.status_code = 500
        return response