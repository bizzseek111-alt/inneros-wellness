"""Envelope encryption tests."""

import os
from app.core.encryption import encrypt_payload, decrypt_payload, derive_user_key


def test_encryption_roundtrip():
    user_id = "usr_synthetic_test_123"
    plaintext = "This is a private personal reflection on feeling overwhelmed."

    ciphertext_b64, nonce_b64, salt_b64 = encrypt_payload(plaintext, user_id)

    assert ciphertext_b64 != plaintext
    assert len(ciphertext_b64) > 10

    decrypted = decrypt_payload(ciphertext_b64, nonce_b64, salt_b64, user_id)
    assert decrypted == plaintext


def test_different_users_derive_distinct_keys():
    salt = os.urandom(16)
    key_user_a = derive_user_key("usr_user_a", salt)
    key_user_b = derive_user_key("usr_user_b", salt)

    assert key_user_a != key_user_b
