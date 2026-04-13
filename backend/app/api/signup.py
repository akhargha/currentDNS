from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    SignupRequest,
    SignupResponse,
    SendVerificationRequest,
    CheckVerificationRequest,
    CheckVerificationResponse,
    SetFrequencyRequest,
)
from app.services import signup_service

router = APIRouter()


@router.post("", response_model=SignupResponse)
async def signup(body: SignupRequest):
    result = signup_service.create_user(body.email, body.domain)
    user = result["user"]
    return SignupResponse(
        user_id=user["id"],
        email_matches_domain=result["email_matches_domain"],
        verification_token=user.get("verification_token"),
    )


@router.post("/send-verification")
async def send_verification(body: SendVerificationRequest):
    try:
        signup_service.send_verification_email(body.user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Verification email sent"}


@router.post("/check-verification", response_model=CheckVerificationResponse)
async def check_verification(body: CheckVerificationRequest):
    result = signup_service.check_dns_verification(body.user_id)
    return CheckVerificationResponse(**result)


@router.post("/set-frequency")
async def set_frequency(body: SetFrequencyRequest):
    valid = {"6h", "1d", "3d", "1w"}
    if body.frequency not in valid:
        raise HTTPException(status_code=400, detail=f"frequency must be one of {valid}")
    signup_service.set_frequency(body.user_id, body.frequency)
    return {"message": "Monitoring frequency saved"}
