from .models import Skill

def fetch_skills_from_the_db():
    skills = Skill.objects.values('id', 'name')
    return list(skills)