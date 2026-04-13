from datetime import datetime, timedelta, timezone
from app.config import settings
from app.services.supabase_client import supabase
from app.services.security import generate_otp, generate_token


def create_otp(user_id: str) -> str:
    code = generate_otp(settings.otp_code_length)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.otp_ttl_minutes)

    supabase.table("otp_codes").insert({
        "user_id": user_id,
        "code": code,
        "expires_at": expires_at.isoformat(),
    }).execute()

    return code


def verify_otp(email: str, code: str) -> dict | None:
    """Verify OTP and return user dict, or None if invalid."""
    user_result = (
        supabase.table("users")
        .select("*")
        .eq("email", email)
        .limit(1)
        .execute()
    )
    if not user_result.data:
        return None
    user = user_result.data[0]

    otp_result = (
        supabase.table("otp_codes")
        .select("*")
        .eq("user_id", user["id"])
        .eq("code", code)
        .eq("used", False)
        .gt("expires_at", datetime.now(timezone.utc).isoformat())
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    if not otp_result.data:
        return None

    # Mark OTP used
    supabase.table("otp_codes").update({"used": True}).eq("id", otp_result.data[0]["id"]).execute()

    return user


def create_session(user_id: str) -> str:
    token = generate_token()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=settings.session_ttl_hours)

    supabase.table("sessions").insert({
        "user_id": user_id,
        "token": token,
        "expires_at": expires_at.isoformat(),
    }).execute()

    return token


def invalidate_session(token: str):
    supabase.table("sessions").delete().eq("token", token).execute()
