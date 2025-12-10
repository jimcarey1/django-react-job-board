from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

from experience.models import LOCATION_TYPE
from experience.models import Skill
from .utils import get_specializations_list

User = get_user_model()

COMPANY_SIZE = (
    ('Less than 50', '<50'),
    ('50 - 100', '50-100'),
    ('100-500', '100-500'),
    ('500-1K', '500-1K'),
    ('1K+', '1K+'),
    ('10K+', '10K+')
)

def validate_url(url):
    validator = URLValidator()
    try:
        validator(url)
        return True
    except ValidationError:
        return False

class Specialization(models.Model):
    name = models.CharField(max_length=150, unique=True)

class Organization(models.Model):
    title = models.CharField(unique=True)
    specialization = models.CharField()
    url = models.URLField(max_length=200, validators=[validate_url], null=True)
    overview = models.TextField()
    company_size = models.CharField(choices=COMPANY_SIZE)
    user = models.OneToOneField(User, on_delete=models.DO_NOTHING)
    followers = models.ManyToManyField(User, related_name='organizations')

class Job(models.Model):
    title = models.CharField()
    description = models.TextField()
    location_type = models.CharField(choices=LOCATION_TYPE)
    organization = models.ForeignKey(Organization, related_name='jobs', on_delete=models.CASCADE)
    applicants = models.ManyToManyField(User, related_name='jobs')

class Resume(models.Model):
    resume = models.FileField()
    user = models.ForeignKey(User, related_name='resumes', on_delete=models.CASCADE)

class JobApplication(models.Model):
    email = models.EmailField()
    mobile = models.CharField()
    resume = models.URLField()
    job_skills = models.ManyToManyField(Skill, related_name='job_applications')
    job = models.ForeignKey(Job, related_name='applications', on_delete=models.CASCADE)