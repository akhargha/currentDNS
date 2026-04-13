import hashlib
import secrets
import string
import random


def generate_token(nbytes: int = 32) -> str:
    return secrets.token_urlsafe(nbytes)


def generate_verification_token() -> str:
    return secrets.token_hex(16)


def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()
