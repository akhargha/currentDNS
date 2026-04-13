from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "currentDNS API"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    cors_origins: str = "http://localhost:5173"

    supabase_url: str
    supabase_service_role_key: str

    sendgrid_api_key: str
    sendgrid_from_email: str

    session_ttl_hours: int = 24
    otp_ttl_minutes: int = 10
    otp_code_length: int = 6

    scheduler_poll_minutes: int = 5


settings = Settings()
