"""Point d'entrée principal de l'API FastAPI pour KittStudio.

Ce module initialise l'application FastAPI, configure les middlewares
(notamment CORS pour le développement) et définit les routes de base.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="KittStudio API",
    description="API backend pour l'application SaaS KittStudio, gérant la génération de visuels IA.",
    version="0.1.0"
)

# Configuration CORS pour permettre au frontend (Vite/React) de communiquer avec l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: À restreindre en production avec l'URL exacte du frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root() -> dict:
    """Route de santé (healthcheck) de l'API.

    Returns:
        dict: Un message de bienvenue confirmant que l'API est en ligne.
    """
    return {"message": "Welcome to KittStudio API"}
