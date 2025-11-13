from django.forms import model_to_dict

from .models import Skill

def fetch_skills_from_the_db():
    skills = Skill.objects.values('id', 'name')
    return list(skills)

async def async_iter(lst):
    for item in lst:
        yield item

def convert_model_to_dict(skill: Skill):
    return model_to_dict(skill, fields=['id', 'name', 'skill_type'])