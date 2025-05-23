from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/categories")
def all_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)
