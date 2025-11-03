# accounts/api.py
from ninja import Router, Schema
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from ninja_jwt.tokens import RefreshToken
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from django.conf import settings

router = Router()
User = get_user_model()

class RegisterIn(Schema):
    email: str
    password: str

class LoginIn(Schema):
    email: str
    password: str

class TokenOut(Schema):
    access: str
    refresh: str = None

@router.post("/register", response=TokenOut)
def register(request, data: RegisterIn):
    if User.objects.filter(email=data.email).exists():
        return {"access": "", "refresh": None}
    user = User.objects.create_user(email=data.email, password=data.password)
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}

@router.post("/login", response=TokenOut)
def login(request, data: LoginIn):
    user = authenticate(email=data.email, password=data.password)
    if not user:
        return {"access": "", "refresh": None}
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}

# Google social login: frontend sends id_token (from Google Identity)
class GoogleTokenIn(Schema):
    id_token: str 

@router.post("/google/", response=TokenOut)
def google_login(request, data:GoogleTokenIn):
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
