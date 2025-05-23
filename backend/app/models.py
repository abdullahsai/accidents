from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from .database import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name_ar = Column(String, nullable=False, unique=True)
    items = relationship("Item", back_populates="category")

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    description_ar = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="items")

class Engineer(Base):
    __tablename__ = "engineers"
    id = Column(Integer, primary_key=True, index=True)
    name_ar = Column(String, nullable=False)

class Wilaya(Base):
    __tablename__ = "wilayat"
    id = Column(Integer, primary_key=True, index=True)
    name_ar = Column(String, nullable=False, unique=True)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    plus_code = Column(String, nullable=False)
    lat = Column(Float)
    lng = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    engineer_id = Column(Integer, ForeignKey("engineers.id"))
    wilaya_id = Column(Integer, ForeignKey("wilayat.id"))

    engineer = relationship("Engineer")
    wilaya   = relationship("Wilaya")
    items    = relationship("ReportItem", back_populates="report")

class ReportItem(Base):
    __tablename__ = "report_items"
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"))
    item_id   = Column(Integer, ForeignKey("items.id"))
    quantity  = Column(Integer, nullable=False)

    report = relationship("Report", back_populates="items")
    item   = relationship("Item")
