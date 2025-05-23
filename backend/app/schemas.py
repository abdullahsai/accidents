from pydantic import BaseModel
from typing import List

class ReportItemIn(BaseModel):
    item_id: int
    quantity: int

class ReportCreate(BaseModel):
    plus_code: str
    lat: float
    lng: float
    engineer_id: int
    wilaya_id: int
    items: List[ReportItemIn]

class ItemOut(BaseModel):
    id: int
    description_ar: str
    price: float
    class Config:
        orm_mode = True

class ReportOut(BaseModel):
    id: int
    plus_code: str
    created_at: str
    items: List[ItemOut]
    class Config:
        orm_mode = True
