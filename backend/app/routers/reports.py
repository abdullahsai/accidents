from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..schemas import ReportCreate, ReportOut
from ..database import get_db
from .. import crud, models

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/", response_model=ReportOut)
def create(rpt: ReportCreate, db: Session = Depends(get_db)):
    return crud.create_report(db, rpt)

@router.get("/", response_model=list[ReportOut])
def list_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).all()
