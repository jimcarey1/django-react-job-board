from ninja import Router
from ninja import Schema

router = Router()

@router.get('/create-page')
async def create_page():
    pass

@router.get('/get-page')
async def get_page():
    pass