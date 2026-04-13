import dns.resolver


def query_txt_records(hostname: str) -> list[str]:
    """Return all TXT record strings for the given hostname."""
    try:
        answers = dns.resolver.resolve(hostname, "TXT")
        records = []
        for rdata in answers:
            records.append(rdata.to_text().strip('"'))
        return records
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.resolver.NoNameservers, Exception):
        return []


def check_verification_token(domain: str, expected_token: str) -> bool:
    """Check if _verifydns.{domain} has the expected TXT token."""
    hostname = f"_verifydns.{domain}"
    records = query_txt_records(hostname)
    return any(expected_token in r for r in records)


def find_bluesky_proof(domain: str) -> str | None:
    """Look for did=... in _atproto.{domain} TXT records."""
    hostname = f"_atproto.{domain}"
    records = query_txt_records(hostname)
    for r in records:
        if r.startswith("did="):
            return r
    return None


def find_keybase_proof(domain: str) -> str | None:
    """Look for keybase-site-verification=... in domain TXT records."""
    records = query_txt_records(domain)
    for r in records:
        if r.startswith("keybase-site-verification="):
            return r
    return None


def find_github_org_proof(domain: str, org: str) -> str | None:
    """Look for TXT record at _gh-{org}-o.{domain}."""
    hostname = f"_gh-{org}-o.{domain}"
    records = query_txt_records(hostname)
    return records[0] if records else None
