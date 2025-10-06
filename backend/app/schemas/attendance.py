from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CheckInOut(BaseModel):
    user_id: int
    method: Optional[str] = "portal"

class AttendanceLogOut(BaseModel):
    user_id: int
    check_in: Optional[datetime]
    check_out: Optional[datetime]
    method: str
