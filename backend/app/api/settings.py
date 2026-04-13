from fastapi import APIRouter, Depends, HTTPException
from app.deps import get_current_user
from app.models.schemas import SettingsResponse, SettingsUpdateRequest
from app.services.supabase_client import supabase

router = APIRouter()

VALID_FREQUENCIES = {"6h", "1d", "3d", "1w"}


@router.get("", response_model=SettingsResponse)
async def get_settings(user: dict = Depends(get_current_user)):
    return SettingsResponse(
        email=user["email"],
        domain=user["domain"],
        monitoring_frequency=user.get("monitoring_frequency", "1d"),
        github_org=user.get("github_org"),
        alert_enabled=user.get("alert_enabled", True),
    )


@router.put("")
async def update_settings(body: SettingsUpdateRequest, user: dict = Depends(get_current_user)):
    updates = {}

    if body.monitoring_frequency is not None:
        if body.monitoring_frequency not in VALID_FREQUENCIES:
            raise HTTPException(status_code=400, detail=f"frequency must be one of {VALID_FREQUENCIES}")
        updates["monitoring_frequency"] = body.monitoring_frequency

    if body.github_org is not None:
        updates["github_org"] = body.github_org

    if body.alert_enabled is not None:
        updates["alert_enabled"] = body.alert_enabled

    if not updates:
        return {"message": "Nothing to update"}

    supabase.table("users").update(updates).eq("id", user["id"]).execute()
    return {"message": "Settings updated"}
