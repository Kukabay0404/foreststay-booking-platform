from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import Base, engine
from app.routers import cabin_admin, checkout, media, room_admin, user, user_admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.AUTO_CREATE_TABLES:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="Resort API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(checkout.router)
app.include_router(user.router)
app.include_router(user_admin.router)
app.include_router(room_admin.router)
app.include_router(cabin_admin.router)
app.include_router(media.router)


if __name__ == "__main__":
    uvicorn.run("app.main:app", reload=False)
