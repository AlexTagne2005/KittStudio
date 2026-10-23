# Plan de Développement - KittStudio (Migration & Évolution)

Ce document décrit les grandes phases de transition de l'architecture actuelle (React + Express) vers l'architecture cible professionnelle (React + FastAPI + PostgreSQL 18).

## Phase 1 : Conception & Architecture (Semaines 1-2)
**Objectif :** Poser les bases solides du nouveau backend et de la base de données.
1.  **Modélisation BDD (PostgreSQL 18) :**
    *   Conception du schéma relationnel : `users`, `workspaces`, `brand_kits`, `projects`, `scenes`, `generations`, `subscriptions`.
    *   Création des scripts de migration (ex: avec Alembic).
2.  **Setup de l'environnement Backend :**
    *   Initialisation du projet FastAPI.
    *   Mise en place de SQLAlchemy (ORM) et de la connexion à PostgreSQL.
    *   Configuration de l'authentification (JWT) et des contrôles d'accès.
3.  **Stratégie SEO :**
    *   Définition des routes publiques gérées par FastAPI (ex: `/showcase/{project_id}`) utilisant des templates (Jinja2) pour injecter dynamiquement les balises Meta OpenGraph/Twitter Cards.

## Phase 2 : Migration des Fonctionnalités Core (Semaines 3-5)
**Objectif :** Porter la logique métier d'Express vers FastAPI.
1.  **Intégration IA (Python) :**
    *   Réécriture des prompts et des appels au SDK Google GenAI (Gemini) en Python.
    *   Implémentation des endpoints : `/api/remove-background`, `/api/generate-scene`, `/api/generate-copy`, `/api/custom-edit`.
2.  **Gestion du Stockage :**
    *   Mise en place d'un service de stockage cloud (S3 / GCS) pour remplacer l'envoi de base64 massifs, via des presigned URLs.
3.  **Asynchronisme :**
    *   Pour les générations longues, implémentation d'un système de files d'attente (Redis + Celery ou Background Tasks) et retour de statut (Polling ou WebSockets).

## Phase 3 : Refonte et Connexion du Frontend (Semaines 6-7)
**Objectif :** Adapter l'interface React au nouveau backend.
1.  **Adaptation des Appels API :**
    *   Remplacement des appels `fetch` vers l'ancien Express par des appels vers la nouvelle API FastAPI (incluant les tokens d'authentification).
2.  **Gestion d'État & Persistance :**
    *   Remplacement du `localStorage` (actuellement utilisé pour l'historique) par des appels API pour sauvegarder et charger les projets depuis PostgreSQL.
3.  **UI/UX :**
    *   Ajout des écrans de Login/Signup.
    *   Gestion fine des états de chargement asynchrones (progress bars réelles basées sur le retour backend).

## Phase 4 : Fonctionnalités Professionnelles & Monétisation (Semaines 8-9)
**Objectif :** Rendre le produit commercialisable.
1.  **Système de Crédits / Billing :**
    *   Intégration de l'API Stripe.
    *   Création des plans d'abonnement et limitation de l'usage via FastAPI.
2.  **Partage & SEO :**
    *   Implémentation finale des pages publiques de vitrine de kit généré.
    *   Tests d'indexation et validation des balises sociales.

## Phase 5 : Tests, Déploiement et QA (Semaine 10)
**Objectif :** Assurer la stabilité pour la production.
1.  **Tests :**
    *   Tests unitaires (Pytest pour FastAPI, Jest pour React).
    *   Tests de charge sur les endpoints de génération IA.
2.  **CI/CD & Déploiement :**
    *   Dockerisation du frontend et du backend.
    *   Déploiement sur une infrastructure Cloud scalable (AWS, Render, GCP).
    *   Mise en place du cluster PostgreSQL 18.
3.  **Validation Finale (UAT) :** Recette avec un groupe de beta-testeurs.
