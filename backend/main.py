"""Point d'entrée principal de l'API FastAPI pour KittStudio.

Ce module initialise l'application FastAPI, configure les middlewares,
gère le cycle de vie (lifespan) et définit les routes de base.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from loguru import logger

from backend.core.logger import setup_logging
from backend.db.database import engine
from backend.api.routers import auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gère le cycle de vie de l'application (Démarrage et Arrêt).

    Exécuté avant que l'application ne commence à recevoir des requêtes,
    et après qu'elle ait arrêté d'en recevoir.
    """
    # --- Startup ---
    setup_logging()
    logger.info("Démarrage de l'API KittStudio...")

    # Vérification de la connexion à la base de données
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("Connexion à la base de données réussie.")
    except Exception as e:
        logger.error(f"Échec de connexion à la base de données: {e}")
        # En production, on pourrait faire un `raise` ici pour crasher l'app si la DB est indispensable.

    yield

    # --- Shutdown ---
    logger.info("Arrêt de l'API KittStudio.")


app = FastAPI(
    title="KittStudio API",
    description="API backend pour l'application SaaS KittStudio, gérant la génération de visuels IA.",
    version="0.1.0",
    lifespan=lifespan
)

# Configuration CORS pour permettre au frontend (Vite/React) de communiquer avec l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: À restreindre en production avec l'URL exacte du frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routeurs
app.include_router(auth.router)

@app.get("/")
def read_root() -> dict:
    """Route de santé (healthcheck) de l'API.

    Returns:
        dict: Un message de bienvenue confirmant que l'API est en ligne.
    """
    logger.info("Healthcheck demandé.")
    return {"message": "Welcome to KittStudio API"}
