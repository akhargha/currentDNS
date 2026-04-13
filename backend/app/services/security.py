import hashlib
import secrets
from datetime import UTC, datetime, timedelta

from app.config import get_settings


def utc_now() -> datetime:
    return datetime.now(UTC)


def to_iso(value: datetime) -> str:
    return value.isoformat()


def hash_value(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def generate_numeric_code(length: int) -> str:
    digits = "0123456789"
    return "".join(secrets.choice(digits) for _ in range(length))


def otp_expiry() -> str:
    settings = get_settings()
    return to_iso(utc_now() + timedelta(minutes=settings.otp_ttl_minutes))


def session_expiry() -> str:
    settings = get_settings()
    return to_iso(utc_now() + timedelta(hours=settings.session_ttl_hours))


def random_token(size: int = 32) -> str:
    return secrets.token_urlsafe(size)
