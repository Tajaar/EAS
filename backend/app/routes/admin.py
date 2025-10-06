from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.crud.user import create_user, get_user_by_id
from app.models.attendance import AttendanceLog
from app.models.user import User
from app.db.session import get_db
from typing import Optional
from datetime import datetime

router = APIRouter()

# ----------------- Add new user -----------------
@router.post("/add-user")
def add_user(name: str, email: str, password: str, role: str, admin_id: int, db: Session = Depends(get_db)):
    admin = get_user_by_id(db, admin_id)
    if admin.role.value != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return create_user(db, name=name, email=email, password=password, role=role)

# ----------------- List all employees -----------------
@router.get("/users")
def list_users(admin_id: int, db: Session = Depends(get_db)):
    admin = get_user_by_id(db, admin_id)
    if admin.role.value != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return db.query(User).filter(User.role == "employee").all()

# ----------------- Get all logs with optional filters -----------------
@router.get("/all-logs")
def get_all_logs(
    admin_id: int,
    user_id: Optional[int] = None,
    date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Verify admin
    admin = db.query(User).filter(User.id == admin_id).first()
    if not admin or admin.role.value != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")

    query = db.query(AttendanceLog)

    if user_id:
        query = query.filter(AttendanceLog.user_id == user_id)

    if date:
        try:
            filter_date = datetime.strptime(date, "%Y-%m-%d").date()
            query = query.filter(func.date(AttendanceLog.check_in) == filter_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    logs = query.order_by(AttendanceLog.check_in.desc()).all()

    # Serialize logs for frontend
    return [
        {
            "user_id": log.user_id,
            "check_in": log.check_in.isoformat() if log.check_in else None,
            "check_out": log.check_out.isoformat() if log.check_out else None,
            "method": log.method
        }
        for log in logs
    ]

# ----------------- Delete user -----------------
@router.delete("/delete-user/{user_id}")
def delete_user(user_id: int, admin_id: int, db: Session = Depends(get_db)):
    admin = get_user_by_id(db, admin_id)
    if admin.role.value != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
