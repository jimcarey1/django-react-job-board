from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI
from ninja.errors import ValidationError

from accounts.api import router as accounts_api
from experience.api import router as experience_api
from pages.api import router as company_api

api = NinjaAPI()

@api.exception_handler(ValidationError)
def custom_validation_errors(request, exc):
    print(exc.errors) # This will print the errors dictionary to your console
    return api.create_response(request, {"detail": exc.errors}, status=422)

api.add_router('/auth/', accounts_api)
api.add_router('/experience', experience_api)
api.add_router('/company', company_api)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]
