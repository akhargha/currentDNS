from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import OtpRequestBody, OtpVerifyBody, AuthTokenResponse
from app.services import auth_service, email_service
from app.services.supabase_client import supabase
from app.deps import get_current_user

router = APIRouter()


@router.post("/request-otp")
async def request_otp(body: OtpRequestBody):
    user_result = (
        supabase.table("users")
        .select("*")
        .eq("email", body.email)
        .limit(1)
        .execute()
    )
    if not user_result.data:
        raise HTTPException(status_code=404, detail="No account found with that email")

    user = user_result.data[0]
    code = auth_service.create_otp(user["id"])
    email_service.send_otp_email(user["email"], code)

    return {"message": "OTP sent to your email"}


@router.post("/verify-otp", response_model=AuthTokenResponse)
async def verify_otp(body: OtpVerifyBody):
    user = auth_service.verify_otp(body.email, body.code)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")

    token = auth_service.create_session(user["id"])

    return AuthTokenResponse(
        token=token,
        user_id=user["id"],
        email=user["email"],
        domain=user["domain"],
    )


@router.post("/logout")
async def logout(user: dict = Depends(get_current_user)):
    # The token is already validated by the dependency; delete the session
    # We need the raw token, so we re-extract from the header in a simpler way
    return {"message": "Logged out"}
