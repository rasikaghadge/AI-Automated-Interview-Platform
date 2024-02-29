

import tomllib
from functools import cached_property
from pathlib import Path
from typing import Literal

from pydantic import AnyHttpUrl, EmailStr, PostgresDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_DIR = Path(__file__).parent.parent.parent
with open(f"{PROJECT_DIR}/pyproject.toml", "rb") as f:
    PYPROJECT_CONTENT = tomllib.load(f)["tool"]["poetry"]


class Settings(BaseSettings):
    # CORE SETTINGS
    SECRET_KEY: str
    ENVIRONMENT: Literal["DEV", "PYTEST", "STG", "PRD"] = "DEV"
    SECURITY_BCRYPT_ROUNDS: int = 12
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 11520  # 8 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 40320  # 28 days
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []
    ALLOWED_HOSTS: list[str] = ["*"]

    # PROJECT NAME, VERSION AND DESCRIPTION
    PROJECT_NAME: str = PYPROJECT_CONTENT["name"]
    VERSION: str = PYPROJECT_CONTENT["version"]
    DESCRIPTION: str = PYPROJECT_CONTENT["description"]

    # POSTGRESQL DEFAULT DATABASE
    DEFAULT_DATABASE_HOSTNAME: str
    DEFAULT_DATABASE_USER: str
    DEFAULT_DATABASE_PASSWORD: str
    DEFAULT_DATABASE_PORT: int
    DEFAULT_DATABASE_DB: str


    # FIRST SUPERUSER
    FIRST_SUPERUSER_EMAIL: EmailStr
    FIRST_SUPERUSER_PASSWORD: str

    @computed_field
    @cached_property
    def DEFAULT_SQLALCHEMY_DATABASE_URI(self) -> str:
        return str(
            PostgresDsn.build(
                scheme="postgresql+asyncpg",
                username=self.DEFAULT_DATABASE_USER,
                password=self.DEFAULT_DATABASE_PASSWORD,
                host=self.DEFAULT_DATABASE_HOSTNAME,
                port=self.DEFAULT_DATABASE_PORT,
                path=self.DEFAULT_DATABASE_DB,
            )
        )

    model_config = SettingsConfigDict(
        env_file=f"{PROJECT_DIR}/.env", case_sensitive=True
    )


settings: Settings = Settings()  # type: ignore

