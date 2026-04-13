from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class RequestOtpIn(BaseModel):
    email: EmailStr


class VerifyOtpIn(BaseModel):
    email: EmailStr
    code: str = Field(min_length=4, max_length=10)


class AuthOut(BaseModel):
    token: str
    user_id: str
    email: EmailStr


class SignupStartIn(BaseModel):
    email: EmailStr
    domain: str


class SignupStartOut(BaseModel):
    domain_id: str
    domain_matched: bool
    requires_dns_verification: bool
    message: str


class DnsEmailIn(BaseModel):
    domain_id: str


class DnsCheckIn(BaseModel):
    domain_id: str


class FrequencyIn(BaseModel):
    domain_id: str
    interval_minutes: int = Field(ge=360, le=43200)


class GithubOrgIn(BaseModel):
    domain_id: str
    org_name: str


class RunScanIn(BaseModel):
    domain_id: str | None = None


class MonitoringSettingsPatchIn(BaseModel):
    domain_id: str
    monitor_email: EmailStr
    domain_name: str
    alerts_enabled: bool
    interval_minutes: int = Field(ge=360, le=43200)


class IntegrationResult(BaseModel):
    integration_type: Literal["bluesky", "keybase", "github_org"]
    identity_key: str
    lookup_host: str
    status: Literal["valid", "broken", "missing"]
    txt_value: str | None = None
    first_seen_at: str | None = None
    last_valid_seen_at: str | None = None
    broken_at: str | None = None
