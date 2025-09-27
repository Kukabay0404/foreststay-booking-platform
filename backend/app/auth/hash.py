from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext


SECRET_KEY = "supersecretkey"  # лучше вынести в .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def hash_password(password : str):
    return pwd_context.hash(password)

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Не удалось проверить токен",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return email
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный токен",
            headers={"WWW-Authenticate": "Bearer"},
        )