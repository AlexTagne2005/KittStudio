"""Modèle SQLAlchemy représentant un espace de travail (Workspace)."""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.db.database import Base

class Workspace(Base):
    """Représente un espace de travail, unité logique pour facturation et gestion des membres.

    Attributes:
        id (int): Identifiant unique du workspace.
        name (str): Nom affiché de l'espace de travail.
        owner_id (int): ID de l'utilisateur (User) propriétaire de cet espace.
        created_at (datetime): Date et heure de création.
        owner (User): L'utilisateur propriétaire.
        projects (list[Project]): Les projets appartenant à ce workspace.
        transactions (list[Transaction]): L'historique des achats et consommations de crédits.
    """
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="workspaces")
    projects = relationship("Project", back_populates="workspace")
    transactions = relationship("Transaction", back_populates="workspace")
