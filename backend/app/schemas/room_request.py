from datetime import date
from typing import List
from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel
from app.schemas import RoomBase


class SearchRequest(BaseModel):
    check_in: date = Field(..., alias="checkIn")
    check_out: date = Field(..., alias="checkOut")
    guests: List[dict]  # [{adults: 2, children: 1}, ...]
    promo_code: str | None = Field(None, alias="promoCode")

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

class RoomOut(RoomBase):
    id: int
