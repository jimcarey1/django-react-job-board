from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from accounts.api import router as accounts_api

api = NinjaAPI()
api.add_router('/auth/', accounts_api)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]
