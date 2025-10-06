# backend/app/models/attendance.py
from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey, Enum, Date, Time
from app.db.base import Base
import enum

class MethodEnum(str, enum.Enum):
    portal = "portal"
    card = "card"

class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    check_in = Column(TIMESTAMP, nullable=True)
    check_out = Column(TIMESTAMP, nullable=True)
    method = Column(Enum(MethodEnum), default=MethodEnum.portal)
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

class AttendanceSummary(Base):
    __tablename__ = "attendance_summary"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    first_in = Column(TIMESTAMP)
    final_out = Column(TIMESTAMP)
    total_duration = Column(Time)
