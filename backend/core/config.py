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
    """
    PROJECT_NAME: str = "KittStudio API"
    DATABASE_URL: str = "postgresql+psycopg2://kittstudio:password@localhost:5432/kittstudio_db"

    class Config:
        """Configuration de Pydantic pour lire le fichier .env s'il est présent."""
        env_file = ".env"

# Instance globale des paramètres à importer dans les autres modules
settings = Settings()
