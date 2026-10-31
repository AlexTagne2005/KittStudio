# Suivi d'Avancement - KittStudio

Ce document trace l'historique des développements réalisés, des choix techniques arrêtés, et des versions déployées.

## Sprint 1.1 : Modélisation et Infrastructure (Terminé)
**Date :** 24 Octobre 2026

### 1. Restructuration en Monorepo
*   Création d'une structure claire séparant le code client (`frontend/`) du code serveur (`backend/`).
*   Déplacement de l'application React/Vite existante dans le dossier `frontend`.
*   Mise à jour des configurations (`tsconfig.json`, `vite.config.ts`) pour refléter les nouveaux chemins.
*   Intégration du système de composants UI **shadcn/ui** dans le projet React pour accélérer le développement futur de l'interface.

### 2. Initialisation du Backend (FastAPI)
*   Création de l'environnement virtuel Python et du fichier `requirements.txt` (FastAPI, SQLAlchemy, Alembic, psycopg, etc.).
*   Mise en place de la structure de base : `main.py` (point d'entrée avec configuration CORS), `core/config.py` (gestion des variables d'environnement via `pydantic-settings`), et `db/database.py` (moteur SQLAlchemy).

### 3. Modélisation de la Base de Données
Création des modèles ORM (SQLAlchemy) documentés (Google Docstrings) correspondants au cahier des charges :
*   `User` : Gestion des utilisateurs (email, mot de passe hashé).
*   `Workspace` : Espaces de travail permettant la collaboration et la facturation isolée.
*   `Project` : Projets contenant les paramètres globaux (Brand Kit).
*   `Scene` : Représentation d'une image générée, rattachée à un projet.
*   `Transaction` : Journalisation (ledger) des mouvements de crédits par workspace.

### 4. Infrastructure Locale
*   Mise en place d'un fichier `docker-compose.yml` pour provisionner facilement les services nécessaires en local (actuellement configuré pour lancer PostgreSQL 17).
*   Configuration de l'outil de migration de schémas **Alembic** pour la gestion versionnée de la base de données.
