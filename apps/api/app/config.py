"""InnerOS Configuration Module.
Loads environment variables safely with strict validation and synthetic mock defaults.
"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "InnerOS API"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Database & Persistence
    DATABASE_URL: str = "sqlite:///./inneros.db"

    # Security, Sessions & Encryption
    # Master key is 32 bytes (64 hex characters)
    INNEROS_MASTER_ENCRYPTION_KEY: str = (
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    )
    JWT_SECRET_KEY: str = "inneros_dev_secret_jwt_key_synthetic_only_not_for_prod"
    SESSION_COOKIE_NAME: str = "inneros_session"
    SESSION_TTL_HOURS: int = 168

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Providers
    AI_PRIMARY_PROVIDER: str = "synthetic"
    VOICE_STT_PROVIDER: str = "synthetic"
    VOICE_TTS_PROVIDER: str = "synthetic"

    # Non-Clinical Safety & Regional Helpline
    SAFETY_ENGINE_ENABLED: bool = True
    DEFAULT_REGION: str = "US"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
