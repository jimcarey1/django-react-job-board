from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

SKILL_TYPE = (
    ('Soft Skills', 'Soft Skills'),
    ('Technical Skills', 'Technical Skills'),
)

class Skill(models.Model):
    name = models.CharField(unique=True, max_length=100)
    skill_type = models.CharField(choices=SKILL_TYPE, blank=True)
    users = models.ManyToManyField(User, related_name="skills", blank=True)

EMPLOYMENT_TYPE = (
    ('Software Engineer', 'Software Engineer'),
    ('Backend Engineer', 'Backend Engineer'),
    ('Frontend Engineer', 'Frontend Engineer'),
    ('Fullstack Engineer', 'Fullstack Engineer'),
    ('Devops', 'Devops'),
    ('System Administrator', 'System Administrator'),
    ('Cloud Engineer', 'Cloud Engineer'),
    ('Python Developer', 'Python Developer'),
    ('Node.js Developer', 'Node.js Developer'),
    ('React.js Developer', 'React.js Developer'),
    ('Django Developer', 'Django Developer'),
    ('AI Engineer', 'AI Engineer'),
    ('Technical Support Engineer', 'Technical Support Engineer')
)

LOCATION = (
    ('bengaluru', 'Bengaluru'),
    ('hyderabad', 'Hyderabad'),
    ('chennai', 'Chennai'),
    ('delhi', 'Delhi'),
    ('gurugram', 'Gurugram'),
    ('mumbai', 'Mumbai'),
    ('visakapatnam', 'Visakapatnam'),
    ('pune', 'Pune'),
    ('kolkata', 'Kolkata'),
    ('noida', 'Noida'),
    ('indore', 'Indore'),
    ('kochi', 'Kochi'),
    ('gandhinagar', 'Gandhinagar'),
    ('surat', 'Surat'),
)
class Location(models.Model):
    name = models.CharField(unique=True)

LOCATION_TYPE = (
    ('onsite', 'Onsite'),
    ('hybrid', 'Hybrid'),
    ('remote', 'Remote'),
)

# Create your models here.
class Experience(models.Model):
    title = models.CharField(max_length=100, blank=False, null=False)
    employment_type = models.CharField(max_length=50, choices=EMPLOYMENT_TYPE)
    company = models.CharField(max_length=100, blank=False, null=False)
    start_date = models.DateField(blank=False, null=False)
    end_date = models.DateField(blank=True, null=True)
    currently_working = models.BooleanField()
    location = models.CharField(max_length=50, choices=LOCATION)
    location_type = models.CharField(max_length=10, choices=LOCATION_TYPE)
    description = models.TextField()
    skills = models.ManyToManyField(Skill)
    employee = models.ForeignKey(User, related_name='experiences', on_delete=models.CASCADE)



COURSE_TYPES = (
    ('Bachelor of Engineering', 'Bachelor of Engineering'),
    ('Master of Engineering', 'Master of Engineering'),
    ('Bachelor of Computer Applications', 'Bachelor of Computer Applications'),
    ('Master of Computer Applications', 'Master of Computer Applications'),
    ('Secondary Education', 'Secondary Education'),
)

class Education(models.Model):
    course = models.CharField(max_length=100, choices=COURSE_TYPES)
    college = models.CharField(max_length=100)
    starting_time = models.DateField(blank=False, null=False)
    ending_time = models.DateField(blank=True, null=True)
    currently_working = models.BooleanField(default=False)
    CGPA = models.DecimalField(max_digits=3, decimal_places=2)
    Achievements = models.TextField()
    student = models.ForeignKey(User, on_delete=models.CASCADE)