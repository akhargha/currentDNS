from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from app.deps import get_current_user
from app.models.schemas import DashboardSummary, IntegrationItem, TimelineEntry, ScanResponse
from app.services import integration_service
from app.services.supabase_client import supabase

FREQUENCY_DELTAS = {
    "6h": timedelta(hours=6),
    "1d": timedelta(days=1),
    "3d": timedelta(days=3),
    "1w": timedelta(weeks=1),
}

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
async def summary(user: dict = Depends(get_current_user)):
    integrations = integration_service.get_integrations(user["id"])

    last_scan_row = (
        supabase.table("scan_history")
        .select("scanned_at")
        .eq("user_id", user["id"])
        .order("scanned_at", desc=True)
        .limit(1)
        .execute()
    )

    last_scan_at = last_scan_row.data[0]["scanned_at"] if last_scan_row.data else None

    next_scan_at = None
    if last_scan_at:
        freq = user.get("monitoring_frequency", "1d")
        delta = FREQUENCY_DELTAS.get(freq, timedelta(days=1))
        last_dt = datetime.fromisoformat(last_scan_at)
        if last_dt.tzinfo is None:
            last_dt = last_dt.replace(tzinfo=timezone.utc)
        next_scan_at = (last_dt + delta).isoformat()

    active = sum(1 for i in integrations if i["status"] == "active")
    broken = sum(1 for i in integrations if i["status"] == "broken")

    return DashboardSummary(
        domain=user["domain"],
        email=user["email"],
        monitoring_frequency=user.get("monitoring_frequency", "1d"),
        github_org=user.get("github_org"),
        alert_enabled=user.get("alert_enabled", True),
        last_scan_at=last_scan_at,
        next_scan_at=next_scan_at,
        total_integrations=len(integrations),
        active_count=active,
        broken_count=broken,
    )


@router.get("/integrations", response_model=list[IntegrationItem])
async def integrations(user: dict = Depends(get_current_user)):
    rows = integration_service.get_integrations(user["id"])
    return [
        IntegrationItem(
            id=r["id"],
            type=r["type"],
            status=r["status"],
            first_seen_at=r.get("first_seen_at"),
            first_seen_txt=r.get("first_seen_txt"),
            last_valid_at=r.get("last_valid_at"),
            last_valid_txt=r.get("last_valid_txt"),
            broken_at=r.get("broken_at"),
            broken_txt=r.get("broken_txt"),
        )
        for r in rows
    ]


@router.post("/scan", response_model=ScanResponse)
async def scan(user: dict = Depends(get_current_user)):
    results = integration_service.scan_user(user)
    items = [
        IntegrationItem(
            id=r["id"],
            type=r["type"],
            status=r["status"],
            first_seen_at=r.get("first_seen_at"),
            first_seen_txt=r.get("first_seen_txt"),
            last_valid_at=r.get("last_valid_at"),
            last_valid_txt=r.get("last_valid_txt"),
            broken_at=r.get("broken_at"),
            broken_txt=r.get("broken_txt"),
        )
        for r in results
    ]
    return ScanResponse(scanned=len(items), results=items)


@router.get("/timeline", response_model=list[TimelineEntry])
async def timeline(user: dict = Depends(get_current_user)):
    rows = integration_service.get_timeline(user["id"])
    return [
        TimelineEntry(
            id=r["id"],
            integration_type=r["integrations"]["type"] if r.get("integrations") else "unknown",
            scanned_at=r["scanned_at"],
            status=r["status"],
            txt_record=r.get("txt_record"),
        )
        for r in rows
    ]
