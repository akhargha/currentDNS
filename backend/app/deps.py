from datetime import datetime, timezone
from fastapi import Header, HTTPException
from app.services.supabase_client import supabase


async def get_current_user(authorization: str = Header(...)) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.removeprefix("Bearer ")

    result = (
        supabase.table("sessions")
        .select("*, users(*)")
        .eq("token", token)
        .gt("expires_at", datetime.now(timezone.utc).isoformat())
        .limit(1)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    session = result.data[0]
    return session["users"]
