import dns.exception
import dns.resolver


def resolve_txt_records(host: str) -> list[str]:
    try:
        answers = dns.resolver.resolve(host, "TXT")
    except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer, dns.resolver.NoNameservers, dns.exception.Timeout):
        return []

    records: list[str] = []
    for answer in answers:
        text = "".join(part.decode("utf-8") for part in answer.strings)
        records.append(text)
    return records
