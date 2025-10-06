from passlib.context import CryptContext

# Use bcrypt for secure password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hash the plain password using bcrypt.
    No need to manually truncate — bcrypt handles it.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its bcrypt hash.
    """
    return pwd_context.verify(plain_password, hashed_password)

if __name__ == "__main__":
    password = "Rohit123"
    hashed = hash_password(password)
    print(f"Plain: {password}")
    print(f"Hashed: {hashed}")
    print(f"Verified: {verify_password(password, hashed)}")
