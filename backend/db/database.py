"""Gestion de la connexion à la base de données PostgreSQL.

Ce module configure le moteur SQLAlchemy et définit les dépendances
pour obtenir des sessions de base de données dans les routes FastAPI.
"""
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from backend.core.config import settings

# Création du moteur de base de données (Engine)
engine = create_engine(settings.DATABASE_URL)

# Factory pour créer de nouvelles sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe de base pour tous les modèles SQLAlchemy (ORM)
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """Fournisseur de dépendance FastAPI pour la session de base de données.

    Crée une nouvelle session de base de données pour chaque requête HTTP,
    et s'assure qu'elle est correctement fermée après le traitement.

    Yields:
        Session: Une session SQLAlchemy active.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
