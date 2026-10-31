"""Configuration globale de l'application.

Utilise pydantic_settings pour charger automatiquement les variables d'environnement
depuis un fichier .env ou depuis l'environnement système.
"""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Classe de configuration regroupant les variables d'environnement nécessaires.

    Attributes:
        PROJECT_NAME (str): Le nom du projet.
        DATABASE_URL (str): Chaîne de connexion à la base de données PostgreSQL.
        SECRET_KEY (str): Clé secrète pour signer les tokens JWT.
        ALGORITHM (str): Algorithme utilisé pour les JWT.
        ACCESS_TOKEN_EXPIRE_MINUTES (int): Durée de validité du token.
        SECURE_COOKIES (bool): Si True, les cookies exigent HTTPS (False pour dev local).
    """
    PROJECT_NAME: str = "KittStudio API"
    DATABASE_URL: str = "postgresql+psycopg2://kittstudio:password@localhost:5432/kittstudio_db"

    # JWT Configuration
    SECRET_KEY: str = "SUPER_SECRET_CHANGE_ME_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 jours

    # Security Flags
    SECURE_COOKIES: bool = False # Mettre à True en production (HTTPS)

    class Config:
        """Configuration de Pydantic pour lire le fichier .env s'il est présent."""
        env_file = ".env"

# Instance globale des paramètres à importer dans les autres modules
settings = Settings()
