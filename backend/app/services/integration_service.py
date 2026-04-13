from datetime import datetime, timezone
from app.services.supabase_client import supabase
from app.services import dns_service, email_service


def scan_user(user: dict) -> list[dict]:
    """Run all integration checks for a user. Returns updated integration rows."""
    user_id = user["id"]
    domain = user["domain"]
    github_org = user.get("github_org")

    integrations = (
        supabase.table("integrations")
        .select("*")
        .eq("user_id", user_id)
        .execute()
        .data
    )

    results = []
    for integration in integrations:
        txt = _probe(integration["type"], domain, github_org)
        updated = _update_integration(integration, txt, user)
        results.append(updated)

    return results


def _probe(integration_type: str, domain: str, github_org: str | None) -> str | None:
    if integration_type == "bluesky":
        return dns_service.find_bluesky_proof(domain)
    elif integration_type == "keybase":
        return dns_service.find_keybase_proof(domain)
    elif integration_type == "github":
        if not github_org:
            return None
        return dns_service.find_github_org_proof(domain, github_org)
    return None


def _update_integration(integration: dict, txt: str | None, user: dict) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    old_status = integration["status"]
    found = txt is not None

    updates: dict = {"updated_at": now}

    if found:
        updates["status"] = "active"
        updates["last_valid_at"] = now
        updates["last_valid_txt"] = txt
        if not integration.get("first_seen_at"):
            updates["first_seen_at"] = now
            updates["first_seen_txt"] = txt
        # Clear broken state if it was previously broken
        if old_status == "broken":
            updates["broken_at"] = None
            updates["broken_txt"] = None
    else:
        if old_status == "active":
            updates["status"] = "broken"
            updates["broken_at"] = now
            updates["broken_txt"] = integration.get("last_valid_txt")
            if user.get("alert_enabled"):
                email_service.send_proof_broken_alert(
                    user["email"],
                    user["domain"],
                    integration["type"],
                    integration.get("last_valid_txt"),
                )
        elif old_status == "not_found":
            updates["status"] = "not_found"

    supabase.table("integrations").update(updates).eq("id", integration["id"]).execute()

    # Record in scan history
    supabase.table("scan_history").insert({
        "user_id": user["id"],
        "integration_id": integration["id"],
        "scanned_at": now,
        "status": "found" if found else "not_found",
        "txt_record": txt,
    }).execute()

    return {**integration, **updates}


def get_integrations(user_id: str) -> list[dict]:
    result = (
        supabase.table("integrations")
        .select("*")
        .eq("user_id", user_id)
        .order("type")
        .execute()
    )
    return result.data


def get_timeline(user_id: str, limit: int = 50) -> list[dict]:
    result = (
        supabase.table("scan_history")
        .select("*, integrations(type)")
        .eq("user_id", user_id)
        .order("scanned_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data
