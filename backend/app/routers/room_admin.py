from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.models import Room
from app.schemas.room_request import SearchRequest, RoomOut


router = APIRouter(prefix="/room_admin", tags=["Admin"])

@router.get("/", response_model=list[schemas.RoomOut])
async def get_rooms(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Room))
    rooms = result.scalars().all()
    return rooms

@router.post("/", response_model=schemas.room.RoomOut)
async def create_room(room: schemas.room.RoomCreate, db: AsyncSession = Depends(get_db)):
    db_room = models.Room(**room.dict())
    db.add(db_room)
    await db.commit()
    await db.refresh(db_room)
    return db_room

@router.put("/{room_id}", response_model=schemas.room.RoomOut)
async def update_room(room_id: int, room: schemas.room.RoomUpdate, db: AsyncSession = Depends(get_db)):
    query = update(models.Room).where(models.Room.id == room_id).values(**room.dict()).returning(models.Room)
    result = await db.execute(query)
    updated = result.fetchone()
    if not updated:
        raise HTTPException(404, detail="Room not found")
    await db.commit()
    return updated

@router.delete("/{room_id}")
async def delete_room(room_id: int, db: AsyncSession = Depends(get_db)):
    query = delete(models.Room).where(models.Room.id == room_id)
    result = await db.execute(query)
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"message": "Room deleted"}

@router.post("/", response_model=list[RoomOut])
def search_rooms(req: SearchRequest, db: Session = Depends(get_db)):
    # Считаем общее количество гостей
    total_guests = sum(r["adults"] + r["children"] for r in req.guests)

    # Базовый фильтр по вместимости
    query = db.query(Room).filter(Room.capacity >= total_guests)

    # TODO: проверить занятость через таблицу Booking
    # Если не будешь делать бронь сразу — можно пропустить

    rooms = query.all()
    return rooms
