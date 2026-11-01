"""Pytest Configuration and Fixtures for InnerOS Backend.
Uses Starlette/FastAPI TestClient.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client
