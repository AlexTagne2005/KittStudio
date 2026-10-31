"""Modèle SQLAlchemy représentant un utilisateur de la plateforme."""
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.db.database import Base

class User(Base):
    """Représente un utilisateur enregistré.

    Attributes:
        id (int): Identifiant unique de l'utilisateur.
        email (str): Adresse email, utilisée pour la connexion (unique).
        hashed_password (str): Mot de passe chiffré (ex: bcrypt).
        is_active (bool): Statut d'activation du compte.
        created_at (datetime): Date et heure de création du compte.
        workspaces (list[Workspace]): Relation avec les espaces de travail possédés par cet utilisateur.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    workspaces = relationship("Workspace", back_populates="owner")
