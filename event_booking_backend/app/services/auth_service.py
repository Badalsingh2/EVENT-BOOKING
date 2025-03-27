from app.core.security import get_current_user
from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
import jwt
from app.core.config import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")



def role_required(required_roles: list):
    def role_checker(user: dict = Depends(get_current_user)):
        if user["role"] not in required_roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return user
    return role_checker
