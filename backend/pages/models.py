from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

from experience.models import LOCATION_TYPE
from experience.models import Skill

User = get_user_model()

class Organization(models.Model):
    title = models.CharField(unique=True)
    specialization = models.CharField()
    overview = models.TextField()
    company_size = models.CharField()
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