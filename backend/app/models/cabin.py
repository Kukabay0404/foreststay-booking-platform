from sqlalchemy import Boolean, CheckConstraint, Integer, String, TIMESTAMP, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.database import Base


class Cabin(Base):
    __tablename__ = "cabins"
    __table_args__ = (
        CheckConstraint("rooms > 0", name="ck_cabins_rooms_positive"),
        CheckConstraint("floors > 0", name="ck_cabins_floors_positive"),
        CheckConstraint("beds > 0", name="ck_cabins_beds_positive"),
        CheckConstraint("price_weekdays >= 0", name="ck_cabins_price_weekdays_nonnegative"),
        CheckConstraint("price_weekend >= 0", name="ck_cabins_price_weekend_nonnegative"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    title: Mapped[str] = mapped_column(String(120), nullable=False)   # Название (например: "СРЕДНИЙ СРУБ №3")
    description: Mapped[str] = mapped_column(String(500), nullable=True)  # Условия сдачи

    rooms: Mapped[int] = mapped_column(Integer, nullable=False)       # Количество комнат
    floors: Mapped[int] = mapped_column(Integer, nullable=False)      # Количество этажей
    beds: Mapped[int] = mapped_column(Integer, nullable=False)        # Спальные места
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # Категория (например: "Стандарт")

    price_weekdays: Mapped[int] = mapped_column(Integer, nullable=False)  # Цена будни
    price_weekend: Mapped[int] = mapped_column(Integer, nullable=False)   # Цена выходные

    pool: Mapped[bool] = mapped_column(Boolean, default=False)   # Бассейн: да/нет
    images: Mapped[list[str]] = mapped_column(JSONB, nullable=True)  # Фото (список ссылок)
    # bookings = relationship("Booking", back_populates="cabin")

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )
