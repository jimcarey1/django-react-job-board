# accounts/api.py
from ninja import Router, Schema
from ninja.responses import Response
from ninja.errors import HttpError
from django.http import HttpRequest
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from ninja_jwt.tokens import RefreshToken
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from django.conf import settings

import jwt
from jwt.exceptions import ExpiredSignatureError

router = Router()
User = get_user_model()

class RegisterIn(Schema):
    email: str
    password: str
    confirm_password: str

class LoginIn(Schema):
    email: str
    password: str

class TokenOut(Schema):
    access: str

@router.post("/register", response=TokenOut)
def register(request: HttpRequest, data: RegisterIn):
    response = Response('Response object')
    if User.objects.filter(email=data.email).exists():
        raise HttpError(status_code=400, message='A User with this email already exists.')
    user = User.objects.create_user(email=data.email, password=data.password)
    refresh = RefreshToken.for_user(user)
    response.set_signed_cookie('refresh_token', str(refresh), settings.SALT)
    return {"access": str(refresh.access_token)}

@router.post("/login")
def login(request: HttpRequest, data: LoginIn):
    user = authenticate(email=data.email, password=data.password)
    if not user:
        raise HttpError(status_code=400, message='Invalid credentials.')
    refresh = RefreshToken.for_user(user)
    response = Response({"access": str(refresh.access_token)})
    response.set_signed_cookie('refresh_token', str(refresh), settings.SALT)
    return response

# Google social login: frontend sends id_token (from Google Identity)
class GoogleTokenIn(Schema):
    id_token: str 

@router.post("/google/", response=TokenOut)
def google_login(request: HttpRequest, data:GoogleTokenIn):
    try:
        # Verify the token with Google's public keys
        idinfo = google_id_token.verify_oauth2_token(data.id_token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
        # idinfo contains email, sub (user id), name, picture...
        email = idinfo.get("email")
        if not email:
            raise Exception("No email in ID token")
        user, created = User.objects.get_or_create(email=email)
        # Optionally set other fields if created
        refresh = RefreshToken.for_user(user)
        return {"access": str(refresh.access_token), "refresh": str(refresh)}
    except Exception as e:
        print(e)
        # token invalid or verification failed
        return {"access": "", "refresh": None}


@router.post('/access_token', response=TokenOut)
def new_access_token(request: HttpRequest, data:TokenOut):
    access_token = data.access
    try:
        payload = jwt.decode(access_token, settings.NINJA_JWT['SIGNING_KEY'], settings.NINJA_JWT['ALGORITHM'])
    except ExpiredSignatureError:
        pass
    except Exception as e:
        raise HttpError(status_code=400, message='Invalid Access Token')
    print(payload)
    refresh_token:RefreshToken = request.COOKIES.get('refresh_token')
    if not refresh_token:
        raise HttpError(status_code=400, message='no refresh token, you are logged out.')
    return {'access': refresh_token.access_token}


