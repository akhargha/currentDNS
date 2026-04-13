from fastapi import HTTPException, status

from app.config import get_settings
from app.services.email_service import send_otp_email
from app.services.security import generate_numeric_code, hash_value, otp_expiry, random_token, session_expiry, utc_now
from app.services.supabase_client import get_supabase


def _get_or_create_user(email: str) -> dict:
    supabase = get_supabase()
    existing = supabase.table("users").select("*").eq("email", email).limit(1).execute().data
    if existing:
        return existing[0]
    created = supabase.table("users").insert({"email": email}).execute().data
    return created[0]


def request_otp(email: str) -> dict:
    supabase = get_supabase()
    settings = get_settings()
    _get_or_create_user(email)

    code = generate_numeric_code(settings.otp_code_length)
    supabase.table("otp_codes").insert(
        {
            "email": email,
            "code_hash": hash_value(code),
            "expires_at": otp_expiry(),
        }
    ).execute()

    send_otp_email(email, code)
    return {"message": "OTP sent"}


def verify_otp(email: str, code: str) -> dict:
    supabase = get_supabase()
    now_iso = utc_now().isoformat()
    otp_rows = (
        supabase.table("otp_codes")
        .select("*")
        .eq("email", email)
        .is_("consumed_at", "null")
        .gt("expires_at", now_iso)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
        .data
    )
    if not otp_rows:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP expired or not found")

    otp_row = otp_rows[0]
    if otp_row["code_hash"] != hash_value(code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP code")

    supabase.table("otp_codes").update({"consumed_at": now_iso}).eq("id", otp_row["id"]).execute()
    user = _get_or_create_user(email)

    raw_token = random_token(24)
    supabase.table("sessions").insert(
        {
            "user_id": user["id"],
            "token_hash": hash_value(raw_token),
            "expires_at": session_expiry(),
        }
    ).execute()

    return {"token": raw_token, "user_id": user["id"], "email": user["email"]}


def get_user_by_token(token: str) -> dict:
    supabase = get_supabase()
    now_iso = utc_now().isoformat()
    session_rows = (
        supabase.table("sessions")
        .select("id,user_id")
        .eq("token_hash", hash_value(token))
        .is_("revoked_at", "null")
        .gt("expires_at", now_iso)
        .limit(1)
        .execute()
        .data
    )
    if not session_rows:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")
    row = session_rows[0]
    user_rows = supabase.table("users").select("email").eq("id", row["user_id"]).limit(1).execute().data
    if not user_rows:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return {"user_id": row["user_id"], "email": user_rows[0]["email"]}
