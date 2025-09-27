from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy import select
from app.database import get_db
from app.schemas import user
from app import models, schemas
from app.auth.hash import hash_password
from app.auth.deps import get_current_user
from app.auth.jwt_handler import create_access_token

router = APIRouter(prefix='/auth', tags=['Auth'])

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post('/register', response_model=user.UserOut)
async def create_user(user : schemas.user.UserCreate, db : AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User).where(models.User.email == user.email))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400,detail='Такой eMail уже зарегистрирован')

    db_user = models.User(
        email=user.email,
        hashed_password = hash_password(user.password),
        first_name = user.first_name,
        last_name = user.last_name,
        role = user.role,
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.get("/", response_model=list[schemas.user.UserOut])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.user.User))
    return result.scalars().all()


@router.get("/{user_id}", response_model=schemas.user.UserOut)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.user.User).where(models.user.User.id == user_id))
    user_ext = result.scalar_one_or_none()
    if not user_ext:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/login")
async def login(user: schemas.user.UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User).filter(models.User.email == user.email))
    db_user = result.scalar_one_or_none()

    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=user.UserOut)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.delete("/users/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # проверим роль
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Удалять пользователей может только администратор",
        )

    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user_to_delete = result.scalar_one_or_none()

    if not user_to_delete:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    await db.delete(user_to_delete)
    await db.commit()
    return {"detail": f"Пользователь {user_id} успешно удалён"}


@router.put("/{user_id}", response_model=schemas.UserOut)
async def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    db_user = result.scalars().first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # обновляем только переданные поля
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, key, value)

    await db.commit()
    await db.refresh(db_user)

    return db_user
