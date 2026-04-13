from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status

from app.services.dns_service import resolve_txt_records
from app.services.email_service import send_dns_verification_email
from app.services.security import random_token, utc_now
from app.services.supabase_client import get_supabase


def _normalize_domain(value: str) -> str:
    return value.strip().lower().removeprefix("https://").removeprefix("http://").strip("/")


def _domain_from_email(email: str) -> str:
    return email.split("@")[-1].lower().strip()


def start_signup(email: str, domain: str) -> dict:
    supabase = get_supabase()
    domain_name = _normalize_domain(domain)
    email_domain = _domain_from_email(email)
    domain_matched = domain_name == email_domain

    user_rows = supabase.table("users").select("*").eq("email", email).limit(1).execute().data
    user = user_rows[0] if user_rows else supabase.table("users").insert({"email": email}).execute().data[0]

    existing_domain = (
        supabase.table("domains")
        .select("*")
        .eq("user_id", user["id"])
        .eq("domain_name", domain_name)
        .limit(1)
        .execute()
        .data
    )

    payload = {
        "user_id": user["id"],
        "domain_name": domain_name,
        "monitor_email": email,
        "status": "pending_dns_verification" if not domain_matched else "pending_frequency",
    }

    if existing_domain:
        domain_row = (
            supabase.table("domains")
            .update(payload)
            .eq("id", existing_domain[0]["id"])
            .execute()
            .data[0]
        )
    else:
        domain_row = supabase.table("domains").insert(payload).execute().data[0]

    return {
        "domain_id": domain_row["id"],
        "domain_matched": domain_matched,
        "requires_dns_verification": not domain_matched,
        "message": "Email matches domain" if domain_matched else "DNS verification required for alternate email",
    }


def send_dns_verification(domain_id: str) -> dict:
    supabase = get_supabase()
    domain_rows = supabase.table("domains").select("*").eq("id", domain_id).limit(1).execute().data
    if not domain_rows:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Domain not found")
    domain_row = domain_rows[0]

    token = random_token(12)
    verify_host = f"_verifydns.{domain_row['domain_name']}"
    challenge = {
        "domain_id": domain_id,
        "verify_host": verify_host,
        "expected_token": token,
        "expires_at": (utc_now() + timedelta(hours=24)).replace(microsecond=0).isoformat(),
    }
    supabase.table("domain_verification_challenges").insert(challenge).execute()
    send_dns_verification_email(domain_row["monitor_email"], domain_row["domain_name"], verify_host, token)
    return {"verify_host": verify_host, "expected_token": token, "message": "Verification email sent"}


def check_dns_verification(domain_id: str) -> dict:
    supabase = get_supabase()
    challenges = (
        supabase.table("domain_verification_challenges")
        .select("*")
        .eq("domain_id", domain_id)
        .is_("verified_at", "null")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
        .data
    )
    if not challenges:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
    challenge = challenges[0]
    txt_records = resolve_txt_records(challenge["verify_host"])
    verified = challenge["expected_token"] in txt_records

    if verified:
        now_iso = utc_now().isoformat()
        supabase.table("domain_verification_challenges").update({"verified_at": now_iso}).eq("id", challenge["id"]).execute()
        supabase.table("domains").update({"status": "pending_frequency"}).eq("id", domain_id).execute()

    return {"verified": verified, "txt_records": txt_records}


def set_monitoring_frequency(domain_id: str, interval_minutes: int) -> dict:
    supabase = get_supabase()
    now_iso = utc_now().isoformat()
    next_run = utc_now().timestamp() + interval_minutes * 60
    next_run_iso = datetime.fromtimestamp(next_run, tz=UTC).isoformat()

    pref_rows = (
        supabase.table("monitoring_preferences").select("*").eq("domain_id", domain_id).limit(1).execute().data
    )
    payload = {
        "domain_id": domain_id,
        "interval_minutes": interval_minutes,
        "next_run_at": next_run_iso,
        "alerts_enabled": True,
        "updated_at": now_iso,
    }
    if pref_rows:
        pref = supabase.table("monitoring_preferences").update(payload).eq("id", pref_rows[0]["id"]).execute().data[0]
    else:
        pref = supabase.table("monitoring_preferences").insert(payload).execute().data[0]

    supabase.table("domains").update({"status": "active"}).eq("id", domain_id).execute()
    return {"message": "Monitoring frequency saved", "preference": pref}
