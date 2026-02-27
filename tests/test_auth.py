# tests/test_auth.py
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app



@pytest.fixture
def client():
    return TestClient(app)


# ── Données de test ───────────────────────────────────────────
TEST_USER = {
    "first_name":       "Test",
    "last_name":        "User",
    "email":            "testuser@example.com",
    "password":         "password123",
    "confirm_password": "password123"
}

def test_register_success(client):
    """Inscription avec données valides."""
    response = client.post("/register", json=TEST_USER)
    assert response.status_code in [200, 400]  # 400 si déjà existant
    print(f"Register: {response.json()}")


def test_login_success(client):
    """Login après inscription réussie."""
    # 1. Créer l'user
    client.post("/register", json=TEST_USER)

    # 2. Login
    response = client.post("/login", data={
        "username": TEST_USER["email"],
        "password": TEST_USER["password"]
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_fail(client):
    """Login avec mauvais mot de passe."""
    response = client.post("/login", data={
        "username": "test@example.com",
        "password": "wrong_password"
    })
    assert response.status_code == 401

def test_health(client):
    """API est accessible."""
    response = client.get("/health")
    assert response.status_code == 200
