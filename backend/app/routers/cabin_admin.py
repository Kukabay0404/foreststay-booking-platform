from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app import models
from app.auth.deps import get_current_admin
from app.database import get_db
from app.schemas import cabin as schemas


router = APIRouter(prefix="/cabin_admin", tags=["Admin"])


def _build_cabin_search_query(payload: schemas.SearchRequest):
    total_guests = sum(g.adults + g.children for g in payload.guests)

    overlap_exists = (
        select(models.Booking.id)
        .where(
            and_(
                models.Booking.object_type == "cabin",
                models.Booking.object_id == models.Cabin.id,
                models.Booking.status.in_(["pending", "confirmed"]),
                models.Booking.start_date < payload.endDate,
                models.Booking.end_date > payload.startDate,
            )
        )
        .exists()
    )

    return select(models.Cabin).where(
        models.Cabin.beds >= total_guests,
        ~overlap_exists,
    )


@router.get("/", response_model=list[schemas.CabinOut])
async def get_cabins(
    db: AsyncSession = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    result = await db.execute(select(models.Cabin))
    return result.scalars().all()


@router.get("/public", response_model=list[schemas.CabinOut])
async def get_cabins_public(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Cabin))
    return result.scalars().all()


@router.post("/", response_model=schemas.CabinOut)
async def create_cabin(
    cabin: schemas.CabinCreate,
    db: AsyncSession = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    db_cabin = models.Cabin(**cabin.model_dump(by_alias=False))
    db.add(db_cabin)
    await db.commit()
    await db.refresh(db_cabin)
    return db_cabin


@router.put("/{cabin_id}", response_model=schemas.CabinOut)
async def update_cabin(
    cabin_id: int,
    cabin: schemas.CabinUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    query = (
        update(models.Cabin)
        .where(models.Cabin.id == cabin_id)
        .values(**cabin.model_dump(by_alias=False))
        .returning(models.Cabin)
    )
    result = await db.execute(query)
    updated = result.scalar_one_or_none()
    if updated is None:
        raise HTTPException(404, detail="Cabin not found")

    await db.commit()
    return updated


@router.delete("/{cabin_id}")
async def delete_cabin(
    cabin_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    query = delete(models.Cabin).where(models.Cabin.id == cabin_id)
    result = await db.execute(query)
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Cabin not found")
    return {"message": "Cabin deleted"}


@router.post("/search", response_model=List[schemas.CabinOut])
async def search_cabins(
    payload: schemas.SearchRequest,
    db: AsyncSession = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    if payload.startDate >= payload.endDate:
        raise HTTPException(status_code=400, detail="startDate must be before endDate")

    query = _build_cabin_search_query(payload)

    result = await db.execute(query)
    return result.scalars().all()


@router.post("/public/search", response_model=List[schemas.CabinOut])
async def search_cabins_public(
    payload: schemas.SearchRequest,
    db: AsyncSession = Depends(get_db),
):
    if payload.startDate >= payload.endDate:
        raise HTTPException(status_code=400, detail="startDate must be before endDate")

    query = _build_cabin_search_query(payload)
    result = await db.execute(query)
    return result.scalars().all()
