# Plan de Développement Détaillé - KittStudio

Ce plan détaille la feuille de route technique pour le passage du Proof-of-Concept actuel (React/Express/Local Storage) vers la plateforme SaaS de production (React/FastAPI/PostgreSQL 18/S3).

## Phase 1 : Fondations et Architecture Backend (Semaines 1-2)
**Objectif :** Mettre en place l'infrastructure de base, la base de données et l'API sécurisée.

*   **Sprint 1.1 : Modélisation et Infrastructure (S1)**
    *   Installation et configuration du cluster PostgreSQL 18.
    *   Design du schéma relationnel complet (Diagramme ERD) : Utilisateurs, Workspaces, Projets, Scènes, Transactions (Crédits).
    *   Initialisation du projet FastAPI (Structure des dossiers, gestion des configurations via `.env`).
    *   Configuration d'Alembic pour la gestion des migrations de base de données.
    *   Mise en place d'un bucket de stockage objet (AWS S3 ou Cloudflare R2) pour les images.
*   **Sprint 1.2 : Authentification et Core API (S2)**
    *   Développement du module d'authentification (JWT, Hachage des mots de passe avec bcrypt).
    *   Création des endpoints CRUD de base (Création de compte, Gestion des Workspaces).
    *   Mise en place de la logique de génération de "Presigned URLs" pour l'upload d'images direct depuis le client vers le Bucket S3.

## Phase 2 : Couche d'Abstraction IA (OpenAI + Gemini) (Semaines 3-4)
**Objectif :** Développer le moteur intelligent capable de router et traiter les requêtes IA de manière asynchrone.

*   **Sprint 2.1 : Service d'Orchestration IA (S3)**
    *   Intégration du SDK Python OpenAI (gpt-4o, dall-e).
    *   Intégration du SDK Python Google GenAI (gemini-1.5-pro, gemini-1.5-flash).
    *   Développement d'un pattern "Strategy/Adapter" : une interface commune côté backend qui décide quel modèle appeler en fonction de la tâche (ex: Copywriting complexe -> OpenAI ; Analyse d'image rapide -> Gemini) et gère le fallback en cas d'erreur réseau d'une API.
*   **Sprint 2.2 : Files d'Attente et WebSockets (S4)**
    *   Configuration de Redis et Celery (ou rq) pour gérer les appels IA longs en arrière-plan sans bloquer l'API.
    *   Implémentation des WebSockets (via FastAPI) pour remonter la progression de la génération ("Détourage en cours...", "Génération du décor...") à l'interface React en temps réel.

## Phase 3 : Refonte Frontend et Intégration (Semaines 5-7)
**Objectif :** Connecter la nouvelle API robuste au client React existant et améliorer l'UX.

*   **Sprint 3.1 : Connexion API et Gestion d'État (S5)**
    *   Configuration d'Axios ou de React Query pour interagir avec l'API FastAPI (remplacement des appels Express).
    *   Intégration du système de login et de session (gestion des tokens JWT côté client).
    *   Modification de la logique d'upload : le client demande une URL S3 au backend, y pousse le fichier, et renvoie l'URL finale au backend.
*   **Sprint 3.2 : Refonte UX des Générations (S6)**
    *   Implémentation du flux de génération asynchrone (connexion au WebSocket, affichage de barres de progression ou de skeletons loaders).
    *   Intégration des paramètres de Brand Kit complets dans l'UI.
*   **Sprint 3.3 : Outils Avancés (S7)**
    *   Intégration des retours utilisateurs pour la modification manuelle d'une image (Prompt additionnel).
    *   Mise en place de la génération de ZIP dynamique côté backend ou client via la librairie `jszip`.

## Phase 4 : SEO, Pages Publiques et Monétisation (Semaines 8-9)
**Objectif :** Préparer le produit pour la croissance et le revenu.

*   **Sprint 4.1 : Vitrines SEO (Server-Side Rendering) (S8)**
    *   Création des templates HTML (Jinja2) dans FastAPI pour les routes `/showcase/{project_id}`.
    *   Injection dynamique des balises `<meta property="og:image" content="...">` pour s'assurer que le partage d'un lien génère un bel aperçu sur LinkedIn/Twitter.
    *   Optimisation des temps de réponse de ces routes publiques.
*   **Sprint 4.2 : Système de Crédits et Stripe (S9)**
    *   Intégration de l'API Stripe (Billing & Checkout).
    *   Création de la table de transactions (Ledger) pour décrémenter le solde de crédits à chaque appel réussi aux API IA.
    *   Mise en place des webhooks Stripe pour gérer les renouvellements d'abonnements et les échecs de paiement.

## Phase 5 : QA, DevOps et Lancement (Semaine 10)
**Objectif :** Stabilisation, tests et mise en production.

*   **Sprint 5.1 : Tests et Qualité**
    *   Écriture de tests unitaires (Pytest) pour le routage IA et le système de crédits.
    *   Tests End-to-End (Playwright ou Cypress) pour valider le parcours critique (Upload -> Génération -> Téléchargement).
    *   Tests de charge (Locust) sur l'infrastructure FastAPI.
*   **Sprint 5.2 : CI/CD et Déploiement**
    *   Mise en place des pipelines GitHub Actions / GitLab CI.
    *   Création des Dockerfiles (Frontend Vite, Backend FastAPI, Worker Celery).
    *   Déploiement sur un environnement de Staging, puis de Production (Render, AWS, ou Google Cloud).
    *   Configuration du domaine, certificats SSL, et monitoring (Sentry, Datadog).
