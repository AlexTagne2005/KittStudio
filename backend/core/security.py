"""Utilitaires de sécurité et d'authentification.

Contient les fonctions pour hacher les mots de passe avec bcrypt,
les vérifier, et générer des tokens JWT.
"""
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt
from backend.core.config import settings

# Configuration de passlib pour utiliser bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie si un mot de passe en clair correspond au hash enregistré.

    Args:
        plain_password: Le mot de passe saisi par l'utilisateur.
        hashed_password: Le hash stocké en base de données.

    Returns:
        bool: True si les mots de passe correspondent, False sinon.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hache un mot de passe en clair.

    Args:
        password: Le mot de passe à hacher.

    Returns:
        str: Le mot de passe haché (bcrypt).
    """
    return pwd_context.hash(password)


def create_access_token(subject: str | int) -> str:
    """Crée un token JWT d'accès.

    Args:
        subject: Le sujet du token (généralement l'ID de l'utilisateur).

    Returns:
        str: Le token JWT encodé.
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt
