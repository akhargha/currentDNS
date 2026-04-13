from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from app.config import get_settings


def send_email(to_email: str, subject: str, text_content: str) -> None:
    settings = get_settings()
    if not settings.sendgrid_api_key:
        return

    client = SendGridAPIClient(settings.sendgrid_api_key)
    message = Mail(
        from_email=settings.sendgrid_from_email,
        to_emails=to_email,
        subject=subject,
        plain_text_content=text_content,
    )
    client.send(message)


def send_otp_email(to_email: str, otp_code: str) -> None:
    send_email(
        to_email=to_email,
        subject="Your currentDNS OTP code",
        text_content=f"Your OTP code is {otp_code}. It expires in 10 minutes.",
    )


def send_dns_verification_email(to_email: str, domain: str, host: str, token: str) -> None:
    send_email(
        to_email=to_email,
        subject="Complete DNS verification for currentDNS",
        text_content=(
            f"To verify alternate email ownership for {domain}, add this TXT record:\n\n"
            f"Host: {host}\n"
            f"Value: {token}\n\n"
            "After adding it, return to the app and click the verification button."
        ),
    )


def send_broken_proof_alert(to_email: str, domain: str, integration_type: str, identity_key: str) -> None:
    send_email(
        to_email=to_email,
        subject=f"DNS proof broken for {domain}",
        text_content=(
            f"We detected a broken proof on {domain}.\n"
            f"Integration: {integration_type}\n"
            f"Identity: {identity_key}\n"
            "Please restore the TXT record."
        ),
    )
