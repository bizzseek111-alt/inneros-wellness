"""InnerOS Envelope Encryption Core.
Implements Two-Tier Envelope Encryption:
- Derives a unique per-user Data Encryption Key (DEK) using HKDF-SHA256
- Encrypts sensitive personal reflections using AES-256-GCM
"""

import os
import base64
from typing import Tuple
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.config import settings


def derive_user_key(user_id: str, salt: bytes) -> bytes:
    """Derives a 256-bit key from the Master Encryption Key and user context using HKDF-SHA256."""
    master_key_bytes = bytes.fromhex(settings.INNEROS_MASTER_ENCRYPTION_KEY)
    hkdf = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        info=f"inneros-user-memory-dek:{user_id}".encode("utf-8"),
    )
    return hkdf.derive(master_key_bytes)


def encrypt_payload(plaintext: str, user_id: str, salt: bytes = None) -> Tuple[str, str, str]:
    """Encrypts plaintext using AES-256-GCM with a user-derived DEK.

    Returns: (ciphertext_b64, nonce_b64, salt_b64)
    """
    if salt is None:
        salt = os.urandom(16)
    user_dek = derive_user_key(user_id, salt)
    aesgcm = AESGCM(user_dek)
    nonce = os.urandom(12)  # Standard 96-bit nonce for GCM
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode("utf-8"), user_id.encode("utf-8"))

    return (
        base64.b64encode(ciphertext).decode("ascii"),
        base64.b64encode(nonce).decode("ascii"),
        base64.b64encode(salt).decode("ascii"),
    )


def decrypt_payload(ciphertext_b64: str, nonce_b64: str, salt_b64: str, user_id: str) -> str:
    """Decrypts ciphertext using the user-derived DEK and AES-256-GCM."""
    ciphertext = base64.b64decode(ciphertext_b64.encode("ascii"))
    nonce = base64.b64decode(nonce_b64.encode("ascii"))
    salt = base64.b64decode(salt_b64.encode("ascii"))

    user_dek = derive_user_key(user_id, salt)
    aesgcm = AESGCM(user_dek)
    plaintext_bytes = aesgcm.decrypt(nonce, ciphertext, user_id.encode("utf-8"))
    return plaintext_bytes.decode("utf-8")
