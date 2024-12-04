# tests/conftest.py
import pytest
from app.backend.app import create_app  # Import your app factory


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client
