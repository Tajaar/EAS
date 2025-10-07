# app/models/user.py
from sqlalchemy import Column, Integer, String
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(String(50), nullable=False)  # employee/admin
    password_hash = Column(String(255), nullable=False)
    department = Column(String(100), nullable=True)
    created_at = Column(String(50), nullable=True)  # optional timestamp
