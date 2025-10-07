from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, date
from typing import Optional

from app.crud.attendance import create_log, update_summary, get_user_logs
from app.schemas.attendance import CheckInOut
from app.db.session import get_db
from app.models.attendance import AttendanceLog, AttendanceSummary
from app.models.user import User
from app.crud import attendance as crud


router = APIRouter(prefix="/attendance", tags=["Attendance"])

# ---------------- CHECK-IN ----------------
@router.post("/check-in")
def check_in(data: CheckInOut, db: Session = Depends(get_db)):
    now = datetime.now()

    # Get the last log for the user
    last_log = db.query(AttendanceLog).filter(
        AttendanceLog.user_id == data.user_id
    ).order_by(desc(AttendanceLog.check_in)).first()

    # Enforce alternating sequence
    if last_log and last_log.check_out is None:
        raise HTTPException(status_code=400, detail="Cannot check in again. Please check out first.")

    # Create new check-in log
    create_log(db, user_id=data.user_id, check_in=now, method=data.method)

    # Update summary
    update_summary(db, user_id=data.user_id, date_=now.date())

    return {"message": f"Check-in recorded at {now.isoformat()}"}


# ---------------- CHECK-OUT ----------------
@router.post("/check-out")
def check_out(data: CheckInOut, db: Session = Depends(get_db)):
    now = datetime.now()

    # Get the last log for the user
    last_log = db.query(AttendanceLog).filter(
        AttendanceLog.user_id == data.user_id
    ).order_by(desc(AttendanceLog.check_in)).first()

    # Enforce alternating sequence
    if not last_log or last_log.check_out is not None:
        raise HTTPException(status_code=400, detail="Cannot check out. Please check in first.")

    # Update the last log's check-out
    last_log.check_out = now
    db.commit()
    db.refresh(last_log)

    # Update summary
    update_summary(db, user_id=data.user_id, date_=now.date())

    return {"message": f"Check-out recorded at {now.isoformat()}"}


# ---------------- GET USER LOGS ----------------
@router.get("/logs/{user_id}")
def get_logs(user_id: int, db: Session = Depends(get_db)):
    logs = get_user_logs(db, user_id=user_id)
    return logs


# ---------------- TODAY'S SUMMARY ----------------
@router.get("/today-summary")
def get_today_summary(
    user_id: Optional[int] = Query(None),
    current_user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    current_user = db.query(User).filter(User.id == current_user_id).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="Current user not found")

    if current_user.role != "admin":
        user_id = current_user.id
    elif user_id is None:
        raise HTTPException(status_code=400, detail="Admin must provide user_id")

    today = date.today()
    summary = db.query(AttendanceSummary).filter(
        AttendanceSummary.user_id == user_id,
        AttendanceSummary.date == today
    ).first()

    return {
        "date": str(today),
        "first_in": summary.first_in.isoformat() if summary and summary.first_in else None,
        "final_out": summary.final_out.isoformat() if summary and summary.final_out else None,
        "total_duration": str(summary.total_duration) if summary and summary.total_duration else "00:00:00"

    }
# ---------------- CHECK STATUS ----------------
@router.get("/check-status")
def check_status(user_id: int = Query(...), db: Session = Depends(get_db)):
    """
    Returns whether the user is currently checked in.
    """
    # Get the last log for the user
    last_log = (
        db.query(AttendanceLog)
        .filter(AttendanceLog.user_id == user_id)
        .order_by(desc(AttendanceLog.check_in))
        .first()
    )

    # Checked in if last log exists and check_out is None
    checked_in = last_log is not None and last_log.check_out is None
    return {"checked_in": checked_in}

@router.get("/attendance/today-summary/{user_id}")
def get_today_summary(user_id: int, db: Session = Depends(get_db)):
    today = date.today()
    summary = crud.update_summary(db, user_id=user_id, date_=today)
    if not summary:
        return {"first_in": None, "final_out": None, "total_duration": "00:00:00"}
    return crud.serialize_summary(summary)