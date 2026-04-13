from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── Signup ──

class SignupRequest(BaseModel):
    email: EmailStr
    domain: str


class SignupResponse(BaseModel):
    user_id: str
    email_matches_domain: bool
    verification_token: Optional[str] = None


class SendVerificationRequest(BaseModel):
    user_id: str


class CheckVerificationRequest(BaseModel):
    user_id: str


class CheckVerificationResponse(BaseModel):
    verified: bool
    status: str  # 'pending', 'verified', 'failed'


class SetFrequencyRequest(BaseModel):
    user_id: str
    frequency: str  # '6h','1d','3d','1w'


# ── Auth ──

class OtpRequestBody(BaseModel):
    email: EmailStr


class OtpVerifyBody(BaseModel):
    email: EmailStr
    code: str


class AuthTokenResponse(BaseModel):
    token: str
    user_id: str
    email: str
    domain: str


# ── Dashboard ──

class DashboardSummary(BaseModel):
    domain: str
    email: str
    monitoring_frequency: str
    github_org: Optional[str]
    alert_enabled: bool
    last_scan_at: Optional[str]
    next_scan_at: Optional[str]
    total_integrations: int
    active_count: int
    broken_count: int


class IntegrationItem(BaseModel):
    id: str
    type: str
    status: str
    first_seen_at: Optional[str]
    first_seen_txt: Optional[str]
    last_valid_at: Optional[str]
    last_valid_txt: Optional[str]
    broken_at: Optional[str]
    broken_txt: Optional[str]


class TimelineEntry(BaseModel):
    id: str
    integration_type: str
    scanned_at: str
    status: str
    txt_record: Optional[str]


class ScanResponse(BaseModel):
    scanned: int
    results: list[IntegrationItem]


# ── Settings ──

class SettingsResponse(BaseModel):
    email: str
    domain: str
    monitoring_frequency: str
    github_org: Optional[str]
    alert_enabled: bool


class SettingsUpdateRequest(BaseModel):
    monitoring_frequency: Optional[str] = None
    github_org: Optional[str] = None
    alert_enabled: Optional[bool] = None
