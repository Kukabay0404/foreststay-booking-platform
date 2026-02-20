from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database import engine, Base
from app.core.config import settings
from app.routers import checkout, user, room_admin, user_admin, cabin_admin
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.AUTO_CREATE_TABLES:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="Resort API", lifespan=lifespan)

origins = [
    "http://localhost:3000",  # Next.js dev
    "http://127.0.0.1:3000",
    "https://yourdomain.com", # если будет продакшн
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(checkout.router)
app.include_router(user.router)
app.include_router(user_admin.router)
app.include_router(room_admin.router)
app.include_router(cabin_admin.router)


if __name__=='__main__':
    uvicorn.run("app.main:app", reload=False)
