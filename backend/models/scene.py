"""Modèle SQLAlchemy représentant une scène générée."""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.db.database import Base

class Scene(Base):
    """Représente une image générée (Scène) par l'IA.

    Attributes:
        id (int): Identifiant unique de la scène.
        name (str): Nom donné à la scène.
        project_id (int): ID du projet parent.
        image_url (str): URL de l'image stockée dans le bucket (S3, MinIO, etc.).
        prompt (str): Le texte utilisé pour générer cette image via l'IA.
        metadata_json (dict): Informations additionnelles (modèle IA utilisé, paramètres, durée, etc.).
        created_at (datetime): Date et heure de la génération.
        project (Project): Le projet parent.
    """
    __tablename__ = "scenes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"))
    image_url = Column(String, nullable=True) # URL in S3/R2/MinIO
    prompt = Column(String, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="scenes")
