from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import List
from pydantic.alias_generators import to_camel

class RoomBase(BaseModel):
    title: str
    category: str
    rooms: int
    area: str
    beds: int
    tv: bool
    price_weekdays: str = Field(..., alias="priceWeekdays")
    price_weekend: str = Field(..., alias="priceWeekend")
    images: List[str]

    model_config = ConfigDict(
        from_attributes=True,  # поддержка ORM
        alias_generator=to_camel,  # 👈 автоматически превращает в camelCase
        populate_by_name=True  # можно использовать snake_case при создании
    )

class RoomCreate(RoomBase):
    pass

class RoomUpdate(RoomBase):
    pass

class RoomOut(RoomBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


