from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update, and_
from app.database import get_db
from app import models
from app.schemas import cabin as schemas
from typing import List

router = APIRouter(prefix="/cabin_admin", tags=["Admin"])


@router.get("/", response_model=list[schemas.CabinOut])
async def get_cabins(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Cabin))
    cabins = result.scalars().all()
    return cabins


@router.post("/", response_model=schemas.CabinOut)
async def create_cabin(cabin: schemas.CabinCreate, db: AsyncSession = Depends(get_db)):
    db_cabin = models.Cabin(**cabin.dict())
    db.add(db_cabin)
    await db.commit()
    await db.refresh(db_cabin)
    return db_cabin


@router.put("/{cabin_id}", response_model=schemas.CabinOut)
async def update_cabin(cabin_id: int, cabin: schemas.CabinUpdate, db: AsyncSession = Depends(get_db)):
    query = (
        update(models.Cabin)
        .where(models.Cabin.id == cabin_id)
        .values(**cabin.dict())
        .returning(models.Cabin)
    )
    result = await db.execute(query)
    updated = result.fetchone()
    if not updated:
        raise HTTPException(404, detail="Cabin not found")
    await db.commit()
    return updated


@router.delete("/{cabin_id}")
async def delete_cabin(cabin_id: int, db: AsyncSession = Depends(get_db)):
    query = delete(models.Cabin).where(models.Cabin.id == cabin_id)
    result = await db.execute(query)
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Cabin not found")
    return {"message": "Cabin deleted"}


@router.post("/search", response_model=List[schemas.CabinOut])
async def search_cabins(payload: schemas.SearchRequest, db: AsyncSession = Depends(get_db)):
    """Ищет свободные срубы по датам и количеству гостей."""

    # 1. Считаем сколько всего людей
    total_guests = sum(g.adults + g.children for g in payload.guests)

    # 2. Получаем все срубы
    query = select(models.Cabin)
    result = await db.execute(query)
    all_cabins: List[models.Cabin] = result.scalars().all()

    available_cabins: List[models.Cabin] = []

    for cabin in all_cabins:
        # Проверка вместимости (используем beds как capacity)
        if cabin.beds < total_guests:
            continue

        # 3. Проверяем брони (чтобы не пересекались даты)
        q = (
            select(models.Booking)
            .where(
                and_(
                    models.Booking.cabin_id == cabin.id,   # 👈 связь с срубом
                    models.Booking.start_date < payload.endDate,
                    models.Booking.end_date > payload.startDate,
                )
            )
        )
        bookings = await db.execute(q)
        if bookings.scalars().first():
            # есть пересечение — сруб занят
            continue

        # свободный сруб
        available_cabins.append(cabin)

    return available_cabins