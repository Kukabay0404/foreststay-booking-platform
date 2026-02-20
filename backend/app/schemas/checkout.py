from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr


class BookingBase(BaseModel):
    object_type: Literal["room", "cabin"]
    object_id: int
    last_name: str
    first_name: str
    phone: str
    email: EmailStr
    citizenship: str

    middle_name: str | None = None
    comments: str | None = None
    payment: str = "card"

    start_date: datetime
    end_date: datetime


class BookingCreate(BookingBase):
    pass


class BookingOut(BookingBase):
    id: int
    user_id: int | None = None
    room_id: int | None = None
    cabin_id: int | None = None
    status: Literal["pending", "confirmed", "cancelled"]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MyBookingOut(BookingOut):
    object_title: str | None = None


class BookingStatusUpdate(BaseModel):
    status: Literal["pending", "confirmed", "cancelled"]
