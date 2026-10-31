"""Modèle SQLAlchemy représentant un projet au sein d'un workspace."""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.db.database import Base

class Project(Base):
    """Représente un projet marketing contenant des scènes et un Brand Kit.

    Attributes:
        id (int): Identifiant unique du projet.
        name (str): Nom du projet.
        workspace_id (int): ID du workspace parent.
        brand_kit (dict): Données JSON contenant les couleurs, typographies, et "Tone of Voice".
        created_at (datetime): Date et heure de création.
        workspace (Workspace): L'espace de travail parent.
        scenes (list[Scene]): Les scènes (images générées) associées à ce projet.
    """
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    brand_kit = Column(JSON, nullable=True) # Stores colors, fonts, tone_of_voice
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    workspace = relationship("Workspace", back_populates="projects")
    scenes = relationship("Scene", back_populates="project")
