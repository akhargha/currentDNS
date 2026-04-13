from fastapi import APIRouter

from app.models.schemas import AuthOut, RequestOtpIn, VerifyOtpIn
from app.services.auth_service import request_otp, verify_otp

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/request-otp")
def request_otp_route(payload: RequestOtpIn) -> dict:
    return request_otp(payload.email)


@router.post("/verify-otp", response_model=AuthOut)
def verify_otp_route(payload: VerifyOtpIn) -> dict:
    return verify_otp(payload.email, payload.code)
