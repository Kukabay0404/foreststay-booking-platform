from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)


def _as_bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


class Settings:
    DATABASE_URL: str
    DB_ECHO: bool
    AUTO_CREATE_TABLES: bool
    JWT_SECRET_KEY: str
    JWT_ALG: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    def __init__(self) -> None:
        import os

        self.DATABASE_URL = os.getenv(
            "DATABASE_URL",
            "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres",
        )
        self.DB_ECHO = _as_bool(os.getenv("DB_ECHO"), False)
        self.AUTO_CREATE_TABLES = _as_bool(os.getenv("AUTO_CREATE_TABLES"), False)
        self.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
        self.JWT_ALG = os.getenv("JWT_ALG", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
        )


settings = Settings()
