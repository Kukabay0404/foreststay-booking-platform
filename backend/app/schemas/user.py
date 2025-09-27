from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    admin = 'admin'
    client = 'client'


class UserBase(BaseModel):
    email : EmailStr
    first_name : str
    last_name : str
    role : UserRole = UserRole.client


class UserCreate(UserBase):
    password : str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[UserRole] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id : int
    created_at : datetime

    model_config = ConfigDict(from_attributes=True)