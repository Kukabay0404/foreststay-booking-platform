from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import Room
from app.schemas.room_request import SearchRequest, RoomOut
from app.database import get_db
from sqlalchemy import and_

router = APIRouter(prefix="/search", tags=["search"])

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
