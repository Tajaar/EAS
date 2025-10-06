import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/attendance_db")
APP_NAME = os.getenv("APP_NAME", "Employee Attendance System")
DEBUG = os.getenv("DEBUG", "False") == "True"
