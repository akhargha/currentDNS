from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.config import get_settings
from app.services.integration_service import run_due_scans

scheduler = BackgroundScheduler(timezone="UTC")


def start_scheduler() -> None:
    settings = get_settings()
    if scheduler.running:
        return
    scheduler.add_job(
        run_due_scans,
        IntervalTrigger(minutes=settings.scheduler_poll_minutes),
        id="dns-monitor-scan-job",
        replace_existing=True,
    )
    scheduler.start()


def stop_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
