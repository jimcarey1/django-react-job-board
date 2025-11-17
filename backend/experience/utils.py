from django.forms import model_to_dict
from django.contrib.auth import get_user_model
from typing import List

from .models import Skill, Experience

User = get_user_model()

def fetch_skills_from_the_db():
    skills = Skill.objects.values('id', 'name')
    return list(skills)

def fetch_user_experiences_from_the_db(user):
    experiences = user.experiences.all()
    list_of_experiences = [
        {
            **model_to_dict(experience),
            "skills": [model_to_dict(skill, fields=['id', 'name']) for skill in experience.skills.all()]
        }
        for experience in experiences
    ]
    return list_of_experiences

def fetch_user_skills(user):
    user_skills = user.skills.all()
    list_of_skills = [model_to_dict(skill, fields=['id', 'name']) for skill in user_skills]
    return list_of_skills

async def async_iter(lst: List):
    for item in lst:
        yield item

def convert_model_to_dict(skill: Skill):
    return model_to_dict(skill, fields=['id', 'name', 'skill_type'])