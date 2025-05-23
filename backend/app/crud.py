from sqlalchemy.orm import Session
from . import models, schemas

def get_categories(db: Session):
    return db.query(models.Category).all()

def create_report(db: Session, rpt: schemas.ReportCreate):
    db_report = models.Report(
        plus_code=rpt.plus_code,
        lat=rpt.lat,
        lng=rpt.lng,
        engineer_id=rpt.engineer_id,
        wilaya_id=rpt.wilaya_id,
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    for it in rpt.items:
        db_item = models.ReportItem(
            report_id=db_report.id,
            item_id=it.item_id,
            quantity=it.quantity
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_report)
    return db_report
