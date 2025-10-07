# app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserLogin, UserOut
from app.crud.user import get_user_by_email
from app.core.security import verify_password
from app.db.session import get_db

router = APIRouter()

@router.post("/login", response_model=UserOut)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return db_user  # directly return ORM object
