from app.services.supabase_client import supabase
from app.services.security import generate_verification_token
from app.services import dns_service, email_service


def create_user(email: str, domain: str) -> dict:
    """Create or retrieve user. Returns dict with user data + match info."""
    existing = (
        supabase.table("users")
        .select("*")
        .eq("email", email)
        .limit(1)
        .execute()
    )
    if existing.data:
        user = existing.data[0]
        email_domain = email.split("@")[1].lower()
        return {
            "user": user,
            "email_matches_domain": email_domain == domain.lower(),
            "is_existing": True,
        }

    email_domain = email.split("@")[1].lower()
    matches = email_domain == domain.lower()

    token = None if matches else generate_verification_token()

    result = supabase.table("users").insert({
        "email": email,
        "domain": domain.lower(),
        "email_verified": matches,
        "verification_token": token,
    }).execute()

    user = result.data[0]
    return {
        "user": user,
        "email_matches_domain": matches,
        "is_existing": False,
    }


def send_verification_email(user_id: str):
    user = _get_user(user_id)
    if not user or not user.get("verification_token"):
        raise ValueError("No verification token found for user")

    email_service.send_verification_instructions(
        user["email"],
        user["domain"],
        user["verification_token"],
    )


def check_dns_verification(user_id: str) -> dict:
    user = _get_user(user_id)
    if not user:
        return {"verified": False, "status": "failed"}

    if user["email_verified"]:
        return {"verified": True, "status": "verified"}

    token = user.get("verification_token")
    if not token:
        return {"verified": False, "status": "failed"}

    verified = dns_service.check_verification_token(user["domain"], token)

    if verified:
        supabase.table("users").update({
            "email_verified": True,
            "verification_token": None,
        }).eq("id", user_id).execute()
        return {"verified": True, "status": "verified"}

    return {"verified": False, "status": "pending"}


def set_frequency(user_id: str, frequency: str):
    supabase.table("users").update({
        "monitoring_frequency": frequency,
    }).eq("id", user_id).execute()

    _ensure_integrations_exist(user_id)


def _get_user(user_id: str) -> dict | None:
    result = supabase.table("users").select("*").eq("id", user_id).limit(1).execute()
    return result.data[0] if result.data else None


def _ensure_integrations_exist(user_id: str):
    """Create integration rows for bluesky, keybase, github if they don't exist."""
    existing = supabase.table("integrations").select("type").eq("user_id", user_id).execute()
    existing_types = {row["type"] for row in existing.data}

    for itype in ("bluesky", "keybase", "github"):
        if itype not in existing_types:
            supabase.table("integrations").insert({
                "user_id": user_id,
                "type": itype,
                "status": "not_found",
            }).execute()
