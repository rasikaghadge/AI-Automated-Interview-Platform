

import os
from pathlib import Path
from typing import Literal

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_DIR = Path(__file__).parent.parent.parent


class Settings(BaseSettings):
    # CORE SETTINGS
    SECRET_KEY: str = os.getenv('SECRET_KEY')
    ENVIRONMENT: Literal["DEV", "PYTEST", "STG", "PRD"] = "DEV"
    SECURITY_BCRYPT_ROUNDS: int = 12
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 11520  # 8 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 40320  # 28 days
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []
    ALLOWED_HOSTS: list[str] = ["*"]
    # POSTGRESQL DEFAULT DATABASE
    DEFAULT_DATABASE_HOSTNAME: str = os.getenv('DEFAULT_DATABASE_HOSTNAME')
    DEFAULT_DATABASE_USER: str = os.getenv('DEFAULT_DATABASE_USER')
    DEFAULT_DATABASE_PASSWORD: str = os.getenv('DEFAULT_DATABASE_PASSWORD')
    DEFAULT_DATABASE_PORT: int = os.getenv('DEFAULT_DATABASE_PORT')
    DEFAULT_DATABASE_DB: str = os.getenv('DEFAULT_DATABASE_DB')

    # AI
    ELEVENLABS_API_KEY: str = os.getenv('ELEVENLABS_API_KEY')

    model_config = SettingsConfigDict(
        env_file=f"{PROJECT_DIR}/.env", case_sensitive=True
    )


settings: Settings = Settings()  # type: ignore
