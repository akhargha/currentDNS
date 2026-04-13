from fastapi import APIRouter, Depends, HTTPException, status

from app.deps import get_current_user
from app.models.schemas import MonitoringSettingsPatchIn
from app.services.supabase_client import get_supabase

router = APIRouter(prefix="/settings", tags=["settings"])


def _get_domain_for_user(user_id: str, domain_id: str) -> dict:
    supabase = get_supabase()
    rows = (
        supabase.table("domains")
        .select("*")
        .eq("user_id", user_id)
        .eq("id", domain_id)
        .limit(1)
        .execute()
        .data
    )
    if not rows:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Domain not found")
    return rows[0]


@router.get("/monitoring")
def get_monitoring_settings(current_user: dict = Depends(get_current_user)) -> dict:
    supabase = get_supabase()
    domains = (
        supabase.table("domains")
        .select("*")
        .eq("user_id", current_user["user_id"])
        .order("created_at")
        .limit(1)
        .execute()
        .data
    )
    if not domains:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No domain configured")
    domain = domains[0]
    pref_rows = supabase.table("monitoring_preferences").select("*").eq("domain_id", domain["id"]).limit(1).execute().data
    github_orgs = supabase.table("github_orgs").select("*").eq("domain_id", domain["id"]).execute().data
    return {
        "domain": domain,
        "monitoring_preference": pref_rows[0] if pref_rows else None,
        "github_orgs": github_orgs,
    }


@router.patch("/monitoring")
def patch_monitoring_settings(payload: MonitoringSettingsPatchIn, current_user: dict = Depends(get_current_user)) -> dict:
    supabase = get_supabase()
    domain = _get_domain_for_user(current_user["user_id"], payload.domain_id)

    updated_domain = (
        supabase.table("domains")
        .update(
            {
                "domain_name": payload.domain_name.lower().strip(),
                "monitor_email": payload.monitor_email,
            }
        )
        .eq("id", domain["id"])
        .execute()
        .data[0]
    )

    pref_rows = supabase.table("monitoring_preferences").select("*").eq("domain_id", domain["id"]).limit(1).execute().data
    pref_payload = {
        "domain_id": domain["id"],
        "interval_minutes": payload.interval_minutes,
        "alerts_enabled": payload.alerts_enabled,
    }
    if pref_rows:
        pref = supabase.table("monitoring_preferences").update(pref_payload).eq("id", pref_rows[0]["id"]).execute().data[0]
    else:
        pref = supabase.table("monitoring_preferences").insert(pref_payload).execute().data[0]

    return {"domain": updated_domain, "monitoring_preference": pref}
