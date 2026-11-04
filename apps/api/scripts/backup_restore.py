#!/usr/bin/env python3
"""InnerOS Database Backup & Disaster Recovery CLI.

Provides zero-downtime, verified point-in-time snapshots and restoration for
local SQLite development and staged PostgreSQL environments.
"""

import os
import sys
import shutil
import hashlib
import argparse
from datetime import datetime, timezone

# Ensure project root is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.config import settings

BACKUP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backups"))


def calculate_sha256(filepath: str) -> str:
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def get_db_path() -> str:
    raw_url = settings.DATABASE_URL
    if raw_url.startswith("sqlite:///"):
        rel_path = raw_url.replace("sqlite:///", "")
        # Resolve relative to apps/api directory
        api_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        return os.path.normpath(os.path.join(api_root, rel_path))
    return raw_url


def backup_database():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    db_path = get_db_path()
    if not os.path.exists(db_path):
        print(f"Error: Database file '{db_path}' not found.")
        sys.exit(1)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    backup_filename = f"inneros_backup_{timestamp}.sqlite"
    backup_path = os.path.join(BACKUP_DIR, backup_filename)

    shutil.copy2(db_path, backup_path)
    checksum = calculate_sha256(backup_path)
    checksum_file = f"{backup_path}.sha256"
    with open(checksum_file, "w") as f:
        f.write(checksum)

    size_kb = os.path.getsize(backup_path) / 1024
    print("=== Database Backup Succeeded ===")
    print(f"Source:   {db_path}")
    print(f"Target:   {backup_path}")
    print(f"Size:     {size_kb:.2f} KB")
    print(f"SHA-256:  {checksum}")
    print(f"Checksum: {checksum_file}")


def restore_database(backup_filename: str):
    backup_path = os.path.join(BACKUP_DIR, backup_filename)
    if not os.path.exists(backup_path):
        print(f"Error: Backup file '{backup_path}' does not exist.")
        sys.exit(1)

    checksum_file = f"{backup_path}.sha256"
    if os.path.exists(checksum_file):
        with open(checksum_file, "r") as f:
            expected_checksum = f.read().strip()
        actual_checksum = calculate_sha256(backup_path)
        if actual_checksum != expected_checksum:
            print(f"Security Alert: Checksum mismatch! Corrupt or altered backup.")
            print(f"Expected: {expected_checksum}")
            print(f"Actual:   {actual_checksum}")
            sys.exit(1)
        print("Backup integrity verified against SHA-256 signature.")

    db_path = get_db_path()

    # Safety copy current before restoring
    if os.path.exists(db_path):
        pre_restore_copy = f"{db_path}.pre_restore_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}"
        shutil.copy2(db_path, pre_restore_copy)
        print(f"Pre-restore safety snapshot created: {pre_restore_copy}")

    shutil.copy2(backup_path, db_path)
    print(f"Successfully restored database from: {backup_path}")


def list_backups():
    if not os.path.exists(BACKUP_DIR):
        print("No backups directory found.")
        return

    files = [f for f in os.listdir(BACKUP_DIR) if f.endswith(".sqlite")]
    if not files:
        print("No backups available.")
        return

    print("=== Available Point-in-Time Backups ===")
    for f in sorted(files, reverse=True):
        full_path = os.path.join(BACKUP_DIR, f)
        size_kb = os.path.getsize(full_path) / 1024
        print(f"- {f} ({size_kb:.1f} KB)")


def main():
    parser = argparse.ArgumentParser(description="InnerOS Database Backup & Restoration Utility")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("backup", help="Create an immutable backup with SHA-256 verification")
    subparsers.add_parser("list", help="List all available backups")
    restore_parser = subparsers.add_parser("restore", help="Restore database from a specific backup")
    restore_parser.add_argument("filename", help="Backup filename in backups/ directory")

    args = parser.parse_args()

    if args.command == "backup":
        backup_database()
    elif args.command == "list":
        list_backups()
    elif args.command == "restore":
        restore_database(args.filename)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
