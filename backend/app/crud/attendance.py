from sqlalchemy.orm import Session
from app.models.attendance import AttendanceLog, AttendanceSummary
from datetime import datetime, date, timedelta

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
    from sqlalchemy import func

    # Fetch all logs for the day
    logs = db.query(AttendanceLog).filter(
        AttendanceLog.user_id == user_id,
        func.date(AttendanceLog.check_in) == date_
    ).all()

    if not logs:
        return None

    # First in / Final out
    first_in = min([log.check_in for log in logs if log.check_in])
    final_out = max([log.check_out for log in logs if log.check_out])

    # Calculate total duration
    total_duration = timedelta()
    for log in logs:
        if log.check_in and log.check_out:
            total_duration += log.check_out - log.check_in

    # Convert to HH:MM:SS
    hours, remainder = divmod(total_duration.total_seconds(), 3600)
    minutes, seconds = divmod(remainder, 60)
    total_duration_str = f"{int(hours):02d}:{int(minutes):02d}:{int(seconds):02d}"

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

def get_user_logs(db: Session, user_id: int):
    return db.query(AttendanceLog).filter(AttendanceLog.user_id == user_id).all()

def get_all_logs(db: Session):
    return db.query(AttendanceLog).all()
