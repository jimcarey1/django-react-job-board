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
from typing import Optional

import jwt
from jwt.exceptions import ExpiredSignatureError

from .utils import publish_email, generate_verification_token, confirm_verification_token

router = Router()
User = get_user_model()

class UserSchema(Schema):
    id:int
    email:str
    first_name:str
    last_name:str
    email_verified: bool

class RegisterSchema(Schema):
    email: str
    password: str
    first_name: str
    last_name: str

class LoginSchema(Schema):
    email: str
    password: str

class TokenSchema(Schema):
    access: Optional[str]
    user: UserSchema | None = None

@router.post("/register", response=TokenSchema)
async def register(request: HttpRequest, data: RegisterSchema):
    if await User.objects.filter(email = data.email).aexists():
        raise HttpError(status_code=400, message='A User with this email already exists.')
    user = User(email=data.email, first_name=data.first_name, last_name=data.last_name)
    user.set_password(data.password)
    await user.asave()
    refresh = await sync_to_async(RefreshToken.for_user)(user)

    #Email verification section
    token = await sync_to_async(generate_verification_token)(data.email)
    verification_link = f'https://localhost:8000/verify/{token}'
    payload = {
                'to':data.email, 
                'Subject':'Verification Email', 
                'message': f'Please click on this link to verify your email: \n ${verification_link}'
               }
    await publish_email(payload)

    access = str(refresh.access_token)
    response = Response({"access": access, "user":UserSchema.from_orm(user)})
    response.set_signed_cookie('refresh_token', str(refresh), settings.SALT, max_age=7*24*60*60)
    return response 

@router.post("/login", response=TokenSchema)
async def login(request: HttpRequest, data: LoginSchema):
    user = await aauthenticate(email=data.email, password=data.password)
    if not user:
        raise HttpError(status_code=400, message='Invalid credentials.')
    if not user.email_verified:
        #Email verification section
        token = await sync_to_async(generate_verification_token)(data.email)
        verification_link = f'https://localhost:8000/verify/{token}'
        payload = {
                    'to':data.email, 
                    'Subject':'Verification Email', 
                    'message': f'Please click on this link to verify your email: \n ${verification_link}'
                }
        await publish_email(payload)
    refresh = await sync_to_async(RefreshToken.for_user)(user)
    access = str(refresh.access_token)
    response = Response({"access":access, "user":UserSchema.from_orm(user)})
    response.set_signed_cookie('refresh_token', str(refresh), settings.SALT, max_age=7*24*60*60)
    return response

@router.post("/google/", response=TokenSchema)
async def google_login(request: HttpRequest, data:TokenSchema):
    try:
        # Verify the token with Google's public keys
        idinfo = await sync_to_async(google_id_token.verify_oauth2_token) \
                        (data.access, 
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
        response = Response({"access": access_token, "user": UserSchema.from_orm(user)})
        response.status_code = 200
        response.set_signed_cookie('refresh_token', str(refresh), settings.SALT, max_age=7*24*60*60)
        return response
    except Exception as e:
        # token invalid or verification failed
        raise HttpError(status_code=500, message=str(e))



@router.post('/access_token', response=TokenSchema)
async def new_access_token(request: HttpRequest, data:TokenSchema):
    access_token = data.access
    #If the access token is not None, then we will check for its integrity, else we will raise a 401 Unauthorized error.
    if data.access:
        try:
            payload = jwt.decode(access_token, settings.SIMPLE_JWT['SIGNING_KEY'], settings.SIMPLE_JWT['ALGORITHM'], options={'verify_exp':False})
        except Exception as e:
            raise HttpError(status_code=400, message='Invalid Access Token')
        #generating new access token from the existing refresh token.
        try:
            user_id = payload['user_id']
            user = await User.objects.aget(id=user_id)
            refresh_token:str = request.get_signed_cookie('refresh_token', salt=settings.SALT)
            if not refresh_token:
                raise HttpError(status_code=400, message='no refresh token, you are logged out.')
            try:
                refresh_token = RefreshToken(refresh_token)
                return {'access': str(refresh_token.access_token), 'user':user}
            except Exception as e:
                raise HttpError(status_code=400, message=str(e))
        #If there is no cookie named refresh_token, we will get the KeyError.
        except KeyError:
            raise HttpError(status_code=401, message='Unauthorized')
        except Exception as e:
            raise HttpError(status_code=401, message='Unauthorized')
    else:
        raise HttpError(status_code=401, message='Unauthorized')


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
    
@router.get("/verify/{token}")
async def verify_mail(request:HttpRequest, token):
    email = await sync_to_async(confirm_verification_token)(token)
    if email is not None:
        user = await User.objects.aget(email=email)
        user.email_verified = True
        await user.asave()
