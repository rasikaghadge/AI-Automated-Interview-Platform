from pathlib import Path
from typing import Literal

from pydantic import AnyHttpUrl, EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_DIR = Path(__file__).parent.parent.parent


class Settings(BaseSettings):
    # CORE SETTINGS
    SECRET_KEY: str
    ENVIRONMENT: Literal["DEV", "PYTEST", "STG", "PRD"] = "DEV"
    SECURITY_BCRYPT_ROUNDS: int = 12
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 1 day
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 1440  # 4 days
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []
    ALLOWED_HOSTS: list[str] = ["localhost", "127.0.0.1"]

    # PROJECT NAME, VERSION AND DESCRIPTION
    PROJECT_NAME: str = 'ai-interviewer'

    # POSTGRESQL DEFAULT DATABASE
    DEFAULT_DATABASE_HOSTNAME: str
    DEFAULT_DATABASE_USER: str
    DEFAULT_DATABASE_PASSWORD: str
    DEFAULT_DATABASE_PORT: int
    DEFAULT_DATABASE_DB: str

    # POSTGRESQL TEST DATABASE
    TEST_DATABASE_HOSTNAME: str = "postgres"
    TEST_DATABASE_USER: str = "postgres"
    TEST_DATABASE_PASSWORD: str = "postgres"
    TEST_DATABASE_PORT: int = 5432
    TEST_DATABASE_DB: str = "postgres"

    # FIRST SUPERUSER
    FIRST_SUPERUSER_EMAIL: EmailStr
    FIRST_SUPERUSER_PASSWORD: str

    # SUPABASE
    SUPABASE_URL: str
    SUPABASE_KEY: str

    # model_config is used to read .env file
    model_config = SettingsConfigDict(
        env_file=f"{PROJECT_DIR}/.env", case_sensitive=True
    )


settings: Settings = Settings()  # type: ignore
