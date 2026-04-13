from datetime import UTC, datetime

from app.services.dns_service import resolve_txt_records
from app.services.email_service import send_broken_proof_alert
from app.services.supabase_client import get_supabase

INTEGRATION_TYPES = ("bluesky", "keybase", "github_org")


def _now_iso() -> str:
    return datetime.now(UTC).isoformat()


def _detect_bluesky(domain_name: str) -> dict:
    host = f"_atproto.{domain_name}"
    txt_values = resolve_txt_records(host)
    match = next((value for value in txt_values if "did=" in value), None)
    return {
        "integration_type": "bluesky",
        "identity_key": domain_name,
        "lookup_host": host,
        "is_valid": bool(match),
        "txt_value": match,
    }


def _detect_keybase(domain_name: str) -> dict:
    host = domain_name
    txt_values = resolve_txt_records(host)
    match = next((value for value in txt_values if value.startswith("keybase-site-verification=")), None)
    return {
        "integration_type": "keybase",
        "identity_key": domain_name,
        "lookup_host": host,
        "is_valid": bool(match),
        "txt_value": match,
    }


def _detect_github_org(domain_name: str, org_name: str) -> dict:
    host = f"_gh-{org_name}-o.{domain_name}"
    txt_values = resolve_txt_records(host)
    match = txt_values[0] if txt_values else None
    return {
        "integration_type": "github_org",
        "identity_key": org_name,
        "lookup_host": host,
        "is_valid": bool(match),
        "txt_value": match,
    }


def _record_snapshot(domain_row: dict, result: dict) -> tuple[dict, bool]:
    supabase = get_supabase()
    now_iso = _now_iso()

    existing = (
        supabase.table("integration_snapshots")
        .select("*")
        .eq("domain_id", domain_row["id"])
        .eq("integration_type", result["integration_type"])
        .eq("identity_key", result["identity_key"])
        .limit(1)
        .execute()
        .data
    )
    is_broken_transition = False
    status = "valid" if result["is_valid"] else "missing"
    payload = {
        "domain_id": domain_row["id"],
        "integration_type": result["integration_type"],
        "identity_key": result["identity_key"],
        "lookup_host": result["lookup_host"],
        "status": status,
        "last_txt_value": result["txt_value"],
        "updated_at": now_iso,
    }

    event_type = None
    if existing:
        previous = existing[0]
        if result["is_valid"]:
            payload["last_valid_seen_at"] = now_iso
            payload["first_seen_at"] = previous["first_seen_at"] or now_iso
            payload["broken_at"] = None
            event_type = "recovered" if previous["status"] == "broken" else "validated"
        elif previous["status"] == "valid":
            payload["status"] = "broken"
            payload["broken_at"] = now_iso
            payload["first_seen_at"] = previous["first_seen_at"]
            payload["last_valid_seen_at"] = previous["last_valid_seen_at"]
            event_type = "broken"
            is_broken_transition = True

        snapshot = (
            supabase.table("integration_snapshots")
            .update(payload)
            .eq("id", previous["id"])
            .execute()
            .data[0]
        )
    else:
        if result["is_valid"]:
            payload["first_seen_at"] = now_iso
            payload["last_valid_seen_at"] = now_iso
            event_type = "discovered"
        snapshot = supabase.table("integration_snapshots").insert(payload).execute().data[0]

    if event_type:
        supabase.table("integration_events").insert(
            {
                "domain_id": domain_row["id"],
                "integration_type": result["integration_type"],
                "identity_key": result["identity_key"],
                "event_type": event_type,
                "txt_value": result["txt_value"],
                "occurred_at": now_iso,
            }
        ).execute()

    return snapshot, is_broken_transition


def run_scan_for_domain(domain_id: str) -> dict:
    supabase = get_supabase()
    domain_rows = supabase.table("domains").select("*").eq("id", domain_id).limit(1).execute().data
    if not domain_rows:
        raise ValueError("Domain not found")
    domain = domain_rows[0]

    github_orgs = supabase.table("github_orgs").select("*").eq("domain_id", domain_id).execute().data
    results = [_detect_bluesky(domain["domain_name"]), _detect_keybase(domain["domain_name"])]
    for row in github_orgs:
        results.append(_detect_github_org(domain["domain_name"], row["org_name"]))

    output = []
    for result in results:
        snapshot, broken_transition = _record_snapshot(domain, result)
        output.append(snapshot)
        if broken_transition:
            send_broken_proof_alert(
                domain["monitor_email"],
                domain["domain_name"],
                result["integration_type"],
                result["identity_key"],
            )
            supabase.table("notification_events").insert(
                {
                    "domain_id": domain_id,
                    "event_type": "proof_broken",
                    "recipient_email": domain["monitor_email"],
                    "payload": result,
                    "status": "sent",
                }
            ).execute()

    return {"domain_id": domain_id, "results": output}


def run_due_scans() -> None:
    supabase = get_supabase()
    now_iso = _now_iso()
    prefs = (
        supabase.table("monitoring_preferences")
        .select("id,domain_id,interval_minutes,next_run_at")
        .lte("next_run_at", now_iso)
        .execute()
        .data
    )
    for pref in prefs:
        run_scan_for_domain(pref["domain_id"])
        next_run = datetime.now(UTC).timestamp() + pref["interval_minutes"] * 60
        next_run_iso = datetime.fromtimestamp(next_run, tz=UTC).isoformat()
        supabase.table("monitoring_preferences").update({"next_run_at": next_run_iso}).eq("id", pref["id"]).execute()
