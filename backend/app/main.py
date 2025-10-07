from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, attendance, admin
from app.db.base import Base
from app.db.session import engine
from app.routes import users  

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Attendance System")

origins = [
    "http://localhost:5173",  # your frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(attendance.router)
app.include_router(admin.router, prefix="/admin")
app.include_router(users.router, prefix="/users")  # Added users router
