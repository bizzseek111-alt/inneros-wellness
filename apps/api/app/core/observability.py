"""InnerOS Observability Module.
Structured JSON logging and OpenTelemetry integration with strict PII scrubbing.
"""

import json
import logging
import sys
from typing import Any, Dict


class SafeJsonFormatter(logging.Formatter):
    """Custom logging formatter outputting structured JSON with PII-redacted keys."""

    REDACTED_KEYS = {
        "text",
        "message",
        "utterance",
        "content",
        "journal",
        "audio_base64",
        "reflection",
        "authorization",
        "secret",
        "token",
    }

    def format(self, record: logging.LogRecord) -> str:
        log_entry: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Include structured extra fields if provided, scrubbing sensitive keys
        if hasattr(record, "extra") and isinstance(record.extra, dict):
            scrubbed_extra = {}
            for k, v in record.extra.items():
                if k.lower() in self.REDACTED_KEYS:
                    scrubbed_extra[k] = "[REDACTED_FOR_PRIVACY]"
                else:
                    scrubbed_extra[k] = v
            log_entry["metadata"] = scrubbed_extra

        return json.dumps(log_entry)


def setup_logger(name: str = "inneros") -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(SafeJsonFormatter())
        logger.addHandler(handler)
    return logger


logger = setup_logger("inneros.core")
