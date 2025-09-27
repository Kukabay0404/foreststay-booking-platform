from sqlalchemy import String, Integer, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP
from datetime import datetime

from app.database import Base


class Room(Base):
    __tablename__ = "rooms"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    category: Mapped[str] = mapped_column(String(120), nullable=False)
    rooms: Mapped[int] = mapped_column(Integer, nullable=False)
    area: Mapped[str] = mapped_column(String(50), nullable=False)
    beds: Mapped[int] = mapped_column(Integer, nullable=False)
    tv: Mapped[bool] = mapped_column(Boolean, default=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    price_weekdays: Mapped[str] = mapped_column(String(50), nullable=False)
    price_weekend: Mapped[str] = mapped_column(String(50), nullable=False)

    bookings = relationship("Booking", back_populates="room")
    images: Mapped[list[str]] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False,
    )


