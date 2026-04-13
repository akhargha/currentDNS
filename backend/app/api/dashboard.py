from fastapi import APIRouter, Depends, HTTPException, status

from app.deps import get_current_user
from app.models.schemas import GithubOrgIn, RunScanIn
from app.services.integration_service import run_scan_for_domain
from app.services.supabase_client import get_supabase

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _get_domain_for_user(user_id: str, domain_id: str | None = None) -> dict:
    supabase = get_supabase()
    query = supabase.table("domains").select("*").eq("user_id", user_id)
    if domain_id:
        query = query.eq("id", domain_id)
    rows = query.order("created_at", desc=False).limit(1).execute().data
    if not rows:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Domain not found for user")
    return rows[0]


@router.get("/summary")
def get_summary(current_user: dict = Depends(get_current_user)) -> dict:
    supabase = get_supabase()
    domain = _get_domain_for_user(current_user["user_id"])
    pref_rows = supabase.table("monitoring_preferences").select("*").eq("domain_id", domain["id"]).limit(1).execute().data
    pref = pref_rows[0] if pref_rows else None
    snapshots = supabase.table("integration_snapshots").select("*").eq("domain_id", domain["id"]).execute().data
    broken_count = len([item for item in snapshots if item["status"] == "broken"])
    return {
        "domain": domain,
        "monitoring_preference": pref,
        "integration_count": len(snapshots),
        "broken_count": broken_count,
    }


@router.get("/integrations")
def get_integrations(current_user: dict = Depends(get_current_user)) -> dict:
    supabase = get_supabase()
    domain = _get_domain_for_user(current_user["user_id"])
    snapshots = supabase.table("integration_snapshots").select("*").eq("domain_id", domain["id"]).execute().data
    github_orgs = supabase.table("github_orgs").select("*").eq("domain_id", domain["id"]).execute().data
    return {"domain": domain, "integrations": snapshots, "github_orgs": github_orgs}


@router.post("/github-org")
def save_github_org(payload: GithubOrgIn, current_user: dict = Depends(get_current_user)) -> dict:
    supabase = get_supabase()
    domain = _get_domain_for_user(current_user["user_id"], payload.domain_id)
    existing = (
        supabase.table("github_orgs")
        .select("*")
        .eq("domain_id", domain["id"])
        .eq("org_name", payload.org_name)
        .limit(1)
        .execute()
        .data
    )
    if existing:
        org = existing[0]
    else:
        org = supabase.table("github_orgs").insert({"domain_id": domain["id"], "org_name": payload.org_name}).execute().data[0]
    return {"github_org": org}


@router.get("/timeline")
def get_timeline(current_user: dict = Depends(get_current_user)) -> dict:
    supabase = get_supabase()
    domain = _get_domain_for_user(current_user["user_id"])
    events = (
        supabase.table("integration_events")
        .select("*")
        .eq("domain_id", domain["id"])
        .order("occurred_at", desc=True)
        .execute()
        .data
    )
    return {"domain": domain, "events": events}


@router.post("/run-scan-now")
def run_scan_now(payload: RunScanIn, current_user: dict = Depends(get_current_user)) -> dict:
    domain = _get_domain_for_user(current_user["user_id"], payload.domain_id)
    return run_scan_for_domain(domain["id"])
