from typing import List
from django.db import models

def get_specializations_list(model: models.Model)->List[str]:
    results = model.objects.values_list('name', flat=True)
    return list(results)