from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, attendance, admin
from app.db.base import Base
from app.db.session import engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Attendance System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(attendance.router)
app.include_router(admin.router, prefix="/admin")
