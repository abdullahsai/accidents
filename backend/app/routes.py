# backend/app/routes.py
from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.utils import coordinates_to_plus_code

router = APIRouter()

class Coordinates(BaseModel):
    latitude: float
    longitude: float

@router.post("/pluscode")
async def get_plus_code(coords: Coordinates):
    plus_code = coordinates_to_plus_code(coords.latitude, coords.longitude)
    return {"plus_code": plus_code}
