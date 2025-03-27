
from typing import Optional
from bson import ObjectId  # Add this at the top of the file
from datetime import datetime, timedelta, timezone
from app.models.user import RoleEnum
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from app.core.database import db

SECRET_KEY = "your_secret"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
ACCESS_TOKEN_EXPIRE_MINUTES = 1000
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token with secure expiration
    """
    to_encode = data.copy()
    
    # Use UTC time and handle expiration
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    try:
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token creation failed: {str(e)}"
        )

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Decode and validate JWT token
    """
    try:
        # Decode token with explicit algorithm
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Extract user ID and verify
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: No user ID")
        
        # Fetch user from database
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTClaimsError:
        raise HTTPException(status_code=401, detail="Invalid token claims")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

async def get_current_admin(current_user: dict = Depends(get_current_user)):
    """
    Verify user is an admin
    """
    if current_user.get("role") != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

