from fastapi import APIRouter

from app.models.schemas import DnsCheckIn, DnsEmailIn, FrequencyIn, SignupStartIn, SignupStartOut
from app.services.signup_service import check_dns_verification, send_dns_verification, set_monitoring_frequency, start_signup

router = APIRouter(prefix="/signup", tags=["signup"])


@router.post("/start", response_model=SignupStartOut)
def start_signup_route(payload: SignupStartIn) -> dict:
    return start_signup(payload.email, payload.domain)


@router.post("/send-dns-verification-email")
def send_dns_verification_route(payload: DnsEmailIn) -> dict:
    return send_dns_verification(payload.domain_id)


@router.post("/check-dns-verification")
def check_dns_verification_route(payload: DnsCheckIn) -> dict:
    return check_dns_verification(payload.domain_id)


@router.post("/set-monitoring-frequency")
def set_monitoring_frequency_route(payload: FrequencyIn) -> dict:
    return set_monitoring_frequency(payload.domain_id, payload.interval_minutes)
