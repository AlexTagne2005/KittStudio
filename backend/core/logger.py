"""Configuration de la journalisation (Logging) via Loguru."""
import sys
import logging
from loguru import logger

class InterceptHandler(logging.Handler):
    """Intercepte les logs standards de Python (ex: Uvicorn/FastAPI) pour les rediriger vers Loguru."""
    def emit(self, record):
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )

def setup_logging():
    """Initialise Loguru avec un système de rotation des fichiers logs."""
    # Supprimer les handlers existants
    logger.remove()

    # Format des logs
    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
        "<level>{message}</level>"
    )

    # 1. Log vers la console (stdout)
    logger.add(sys.stdout, format=log_format, level="INFO")

    # 2. Log vers fichier rotatif (10 MB ou par jour)
    logger.add(
        "logs/app.log",
        rotation="10 MB",      # Crée un nouveau fichier quand il atteint 10MB
        retention="30 days",   # Garde les logs pendant 30 jours
        compression="zip",     # Compresse les anciens fichiers
        format=log_format,
        level="INFO"
    )

    # Rediriger les logs internes de FastAPI/Uvicorn vers Loguru
    logging.getLogger("uvicorn.access").handlers = [InterceptHandler()]
    logging.getLogger("uvicorn.error").handlers = [InterceptHandler()]
    logging.getLogger("fastapi").handlers = [InterceptHandler()]

    logger.info("Système de journalisation (Loguru) initialisé.")
