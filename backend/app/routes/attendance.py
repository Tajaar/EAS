from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from app.crud.attendance import create_log, update_summary, get_user_logs
from app.schemas.attendance import CheckInOut
from app.db.session import get_db
from app.models.attendance import AttendanceSummary
from app.models.user import User
from typing import Optional
from datetime import date

router = APIRouter(prefix="/attendance")

@router.post("/check-in")
def check_in(data: CheckInOut, db: Session = Depends(get_db)):
    now = datetime.now()
    create_log(db, user_id=data.user_id, check_in=now, method=data.method)
    update_summary(db, user_id=data.user_id, date_=now.date())
    return {"message": f"Check-in recorded at {now}"}

@router.post("/check-out")
def check_out(data: CheckInOut, db: Session = Depends(get_db)):
    now = datetime.now()
    create_log(db, user_id=data.user_id, check_out=now, method=data.method)
    update_summary(db, user_id=data.user_id, date_=now.date())
    return {"message": f"Check-out recorded at {now}"}

@router.get("/logs/{user_id}")
def get_logs(user_id: int, db: Session = Depends(get_db)):
    logs = get_user_logs(db, user_id=user_id)
    return logs

@router.get("/today-summary")
def get_today_summary(
    user_id: Optional[int] = Query(None),  # optional for admin
    current_user_id: int = Query(...),      # the logged-in user making request
    db: Session = Depends(get_db)
):
    # Fetch current user
    current_user = db.query(User).filter(User.id == current_user_id).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="Current user not found")

    # If employee: force user_id = current_user.id
    if current_user.role != "admin":
        user_id = current_user.id
    elif user_id is None:
        # Admin without specifying user_id -> optional: return all summaries or error
        raise HTTPException(status_code=400, detail="Admin must provide user_id")

    # Query today’s summary
    today = date.today()
    summary = db.query(AttendanceSummary).filter(
        AttendanceSummary.user_id == user_id,
        AttendanceSummary.date == today
    ).first()

    return {
        "first_in": summary.first_in.isoformat() if summary and summary.first_in else None,
        "final_out": summary.final_out.isoformat() if summary and summary.final_out else None,
        "total_duration": str(summary.total_duration) if summary and summary.total_duration else None
    }