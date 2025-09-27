from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from app.database import get_db
from app import models, schemas
from app.auth.hash import verify_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    email = verify_access_token(token)
    result = await db.execute(select(models.User).where(models.User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user