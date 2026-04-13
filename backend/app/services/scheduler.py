import logging
from datetime import datetime, timedelta, timezone
from apscheduler.schedulers.background import BackgroundScheduler

from app.config import settings
from app.services.supabase_client import supabase
from app.services import integration_service

log = logging.getLogger(__name__)

FREQUENCY_DELTAS = {
    "6h": timedelta(hours=6),
    "1d": timedelta(days=1),
    "3d": timedelta(days=3),
    "1w": timedelta(weeks=1),
}

_scheduler: BackgroundScheduler | None = None


def _run_scheduled_scans():
    """Check all users and scan those whose interval has elapsed."""
    now = datetime.now(timezone.utc)
    users = supabase.table("users").select("*").eq("email_verified", True).execute().data

    for user in users:
        freq = user.get("monitoring_frequency", "1d")
        delta = FREQUENCY_DELTAS.get(freq, timedelta(days=1))

        last_scan = (
            supabase.table("scan_history")
            .select("scanned_at")
            .eq("user_id", user["id"])
            .order("scanned_at", desc=True)
            .limit(1)
            .execute()
        )

        if last_scan.data:
            last_at = datetime.fromisoformat(last_scan.data[0]["scanned_at"])
            if last_at.tzinfo is None:
                last_at = last_at.replace(tzinfo=timezone.utc)
            if now - last_at < delta:
                continue

        try:
            integration_service.scan_user(user)
            log.info("Scanned user %s (%s)", user["email"], user["domain"])
        except Exception:
            log.exception("Failed scanning user %s", user["id"])


def start_scheduler():
    global _scheduler
    _scheduler = BackgroundScheduler()
    _scheduler.add_job(
        _run_scheduled_scans,
        "interval",
        minutes=settings.scheduler_poll_minutes,
        next_run_time=None,  # don't fire immediately on startup
    )
    _scheduler.start()
    log.info("Scheduler started (poll every %d min)", settings.scheduler_poll_minutes)


def shutdown_scheduler():
    global _scheduler
    if _scheduler:
        _scheduler.shutdown(wait=False)
        log.info("Scheduler shut down")
