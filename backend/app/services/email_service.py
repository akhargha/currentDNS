from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.config import settings

sg = SendGridAPIClient(settings.sendgrid_api_key)


def _send(to_email: str, subject: str, html: str):
    message = Mail(
        from_email=settings.sendgrid_from_email,
        to_emails=to_email,
        subject=subject,
        html_content=html,
    )
    sg.send(message)


def send_otp_email(to_email: str, code: str):
    _send(
        to_email,
        "Your currentDNS Login Code",
        f"""
        <h2>Your one-time login code</h2>
        <p style="font-size:32px;font-weight:bold;letter-spacing:8px">{code}</p>
        <p>This code expires in {settings.otp_ttl_minutes} minutes.</p>
        """,
    )


def send_verification_instructions(to_email: str, domain: str, token: str):
    _send(
        to_email,
        "Verify your domain for currentDNS",
        f"""
        <h2>DNS Verification Required</h2>
        <p>To verify you control <strong>{domain}</strong>, add the following DNS TXT record:</p>
        <table style="border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;font-weight:bold">Host</td>
              <td style="padding:8px;font-family:monospace">_verifydns.{domain}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Value</td>
              <td style="padding:8px;font-family:monospace">{token}</td></tr>
        </table>
        <p>Once you have added the record, return to currentDNS and click
        <strong>"I Have Added the TXT Record"</strong>.</p>
        """,
    )


def send_proof_broken_alert(to_email: str, domain: str, integration_type: str, txt_record: str | None):
    _send(
        to_email,
        f"[currentDNS] {integration_type} proof broken for {domain}",
        f"""
        <h2>DNS Proof Alert</h2>
        <p>The <strong>{integration_type}</strong> identity proof for
        <strong>{domain}</strong> is no longer detected.</p>
        <p>Last known TXT record: <code>{txt_record or 'N/A'}</code></p>
        <p>Please check your DNS records and restore the proof if needed.</p>
        """,
    )
