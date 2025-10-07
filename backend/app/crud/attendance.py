# backend/app/crud/attendance.py
from sqlalchemy.orm import Session
from app.models.attendance import AttendanceLog, AttendanceSummary
from datetime import datetime, date, timedelta
from sqlalchemy import func


def create_log(db: Session, user_id: int, check_in=None, check_out=None, method="portal"):
    log = AttendanceLog(
        user_id=user_id,
        check_in=check_in,
        check_out=check_out,
        method=method
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

def update_summary(db: Session, user_id: int, date_: date):
    # Fetch all logs for the user for the day
    logs = db.query(AttendanceLog).filter(
        AttendanceLog.user_id == user_id,
        func.date(AttendanceLog.check_in) == date_
    ).all()

    if not logs:
        return None

    # First check-in
    first_in_times = [log.check_in for log in logs if log.check_in]
    first_in = min(first_in_times) if first_in_times else None

    # Final check-out
    check_out_times = [log.check_out for log in logs if log.check_out]
    final_out = max(check_out_times) if check_out_times else None

    # Total duration = sum of all intervals
    total_duration = timedelta()
    for log in logs:
        if log.check_in and log.check_out:
            total_duration += log.check_out - log.check_in

    # Update or create summary
    summary = db.query(AttendanceSummary).filter(
        AttendanceSummary.user_id == user_id,
        AttendanceSummary.date == date_
    ).first()

    if not summary:
        summary = AttendanceSummary(
            user_id=user_id,
            date=date_,
            first_in=first_in,
            final_out=final_out,
            total_duration=total_duration
        )
        db.add(summary)
    else:
        summary.first_in = first_in
        summary.final_out = final_out
        summary.total_duration = total_duration

    db.commit()
    db.refresh(summary)
    return summary

def serialize_summary(summary: AttendanceSummary):
    """Convert summary model to JSON-friendly dict."""
    total_seconds = int(summary.total_duration.total_seconds()) if summary.total_duration else 0
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    formatted_duration = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

    return {
        "first_in": summary.first_in.isoformat() if summary.first_in else None,
        "final_out": summary.final_out.isoformat() if summary.final_out else None,
        "total_duration": formatted_duration
    }

def get_user_logs(db: Session, user_id: int):
    return db.query(AttendanceLog).filter(AttendanceLog.user_id == user_id).all()

def get_all_logs(db: Session):
    return db.query(AttendanceLog).all()
