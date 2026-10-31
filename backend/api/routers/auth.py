"""Endpoints d'authentification (Inscription, Connexion, Déconnexion).

Gère les JWT via des cookies HttpOnly pour prévenir les attaques XSS.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from loguru import logger
from pydantic import BaseModel, EmailStr

from backend.db.database import get_db
from backend.models.user import User
from backend.core.security import verify_password, get_password_hash, create_access_token
from backend.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Inscrit un nouvel utilisateur."""
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        logger.warning(f"Tentative d'inscription avec un email existant : {user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email déjà utilisé."
        )

    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    logger.info(f"Nouvel utilisateur créé: {new_user.email} (ID: {new_user.id})")
    return {"message": "Utilisateur créé avec succès", "user_id": new_user.id}


@router.post("/login")
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    """Authentifie un utilisateur et place le JWT dans un cookie HttpOnly."""
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        logger.warning(f"Échec de connexion pour l'email: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=db_user.id)

    # Configuration du cookie sécurisé
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,              # Empêche l'accès via JavaScript (protection XSS)
        secure=settings.SECURE_COOKIES, # True en production (HTTPS requis)
        samesite="lax",             # Protection CSRF basique
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    logger.info(f"Connexion réussie pour l'utilisateur ID: {db_user.id}")
    return {"message": "Connexion réussie"}


@router.post("/logout")
def logout(response: Response):
    """Déconnecte l'utilisateur en supprimant son cookie."""
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=settings.SECURE_COOKIES,
        samesite="lax"
    )
    logger.info("Utilisateur déconnecté (cookie supprimé).")
    return {"message": "Déconnexion réussie"}
