from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.auth.deps import get_current_admin
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/user_admin", tags=["Admin"])

@router.get("/", response_model=list[schemas.user.UserOut])
async def get_users(
    db: AsyncSession = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    result = await db.execute(select(models.User))
    return result.scalars().all()

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    query = delete(models.User).where(models.User.id == user_id)
    result = await db.execute(query)
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
