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

    # Live LLM Provider Credentials (Optional — auto-activates live providers when set)
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-latest"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"
    OLLAMA_BASE_URL: str = ""
    OLLAMA_MODEL: str = "llama3.2"

    # Live Voice STT/TTS Credentials (Optional)
    DEEPGRAM_API_KEY: str = ""
    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM"

    # Live Google Calendar OAuth 2.0 Credentials (Optional)
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:3000/integrations/oauth/callback"

    # Live Email (SMTP / Resend) & Web Push (VAPID) Delivery (Optional)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "sanctuary@inneros.app"
    SUPPORT_INBOX_EMAIL: str = "care@inneros.app"
    RESEND_API_KEY: str = ""
    VAPID_PUBLIC_KEY: str = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"

    # Non-Clinical Safety & Regional Helpline
    SAFETY_ENGINE_ENABLED: bool = True
    DEFAULT_REGION: str = "US"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
