from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..utils import pluscode as pc
from .. import crud

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/categories")
def all_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)

# ----- NEW Plus-Code endpoint -----
class Coords(BaseModel):
    lat: float
    lng: float

@router.post("/pluscode", response_model=str)
def generate_plus_code(c: Coords):
    return pc.encode(c.lat, c.lng, 11)
