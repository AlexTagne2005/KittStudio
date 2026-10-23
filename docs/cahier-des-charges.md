# Cahier des Charges - KittStudio

## 1. Présentation du Projet
**Nom du projet :** KittStudio - Kit Marketing Produit AI
**Description courte :** KittStudio est une plateforme SaaS propulsée par l'Intelligence Artificielle permettant de transformer une simple photo de produit en un kit marketing complet (détourage studio, scènes lifestyle, mockups professionnels, formats réseaux sociaux, et copywriting multilingue).

## 2. Objectifs et Cibles
**Objectifs :**
*   Fournir une solution automatisée pour la création de contenu visuel de haute qualité, réduisant les coûts de shooting photo.
*   Offrir une interface fluide et intuitive.
*   Générer des visuels et du texte (copywriting) cohérents avec l'identité de marque (Brand Kit).

**Cibles (Utilisateurs) :**
*   **B2B / E-commerçants :** Marques cherchant à produire rapidement des visuels pour leurs fiches produits, publicités, et réseaux sociaux.
*   **Agences / Freelances :** Professionnels du marketing ayant besoin d'un outil de productivité pour la création de contenu.

## 3. Périmètre Fonctionnel (Existant & Améliorations)
### 3.1. Fonctionnalités Existantes
*   **Upload & Détourage :** Suppression du fond d'une image produit grâce à l'IA.
*   **Génération de Scènes :** Intégration du produit dans des contextes variés (Studio, Lifestyle, Mockups, Réseaux Sociaux) tout en préservant son intégrité (géométrie, logos).
*   **Copywriting AI :** Génération de slogans, légendes, hashtags et Call-to-Action (multilingue) adaptés au ton de la marque.
*   **Export :** Téléchargement groupé (ZIP) des assets.
*   **Historique Local :** Sauvegarde des projets en `localStorage`.

### 3.2. Améliorations Prévues pour un Rendu Professionnel
*   **Gestion des Comptes & Projets :** Remplacer le `localStorage` par une sauvegarde en base de données avec système d'authentification et gestion multi-utilisateurs.
*   **Bibliothèque d'Assets Privée :** Stockage sécurisé des visuels générés et des images sources (Bucket S3/GCS).
*   **Paramétrage Avancé du Brand Kit :** Centralisation des codes couleurs, typographies, logos de la marque pour des générations encore plus fidèles.
*   **SEO & Partage :** Rendre certains projets "publics" avec des URLs optimisées pour le SEO, favorisant la visibilité (géré côté serveur par FastAPI).
*   **Paiement/Monétisation :** Intégration de Stripe pour la gestion des crédits de génération (SaaS).

## 4. Architecture Technique Cible
Pour répondre aux exigences de scalabilité, de robustesse et de SEO, l'architecture suivante est retenue, abandonnant le backend Express actuel.

### 4.1. Frontend
*   **Technologie :** React (Vite) + Tailwind CSS + Framer Motion.
*   **Rôle :** SPA (Single Page Application) réactive, gestion des étapes de création.

### 4.2. Backend
*   **Technologie :** FastAPI (Python).
*   **Rôles :**
    *   Gestion de l'API RESTful.
    *   Orchestration des appels aux modèles d'IA (Gemini ou autres via SDK Python).
    *   **Atout SEO :** FastAPI permettra le Server-Side Rendering (SSR) pour certaines routes spécifiques de partage, ou la génération dynamique de balises Meta via des templates HTML (Jinja2) pour les pages publiques, garantissant une indexation optimale.
    *   Authentification (JWT/OAuth2) et gestion des abonnements.

### 4.3. Base de Données
*   **Technologie :** PostgreSQL 18.
*   **Rôle :**
    *   Stockage relationnel fiable des utilisateurs, projets, kits de marque, et de l'historique des générations.
    *   Optimisation des requêtes complexes pour l'analyse d'usage.

## 5. Contraintes Techniques et Sécurité
*   **Performance :** L'inférence IA pouvant être longue, utilisation de tâches asynchrones (ex: Celery ou BackgroundTasks de FastAPI) avec websockets/SSE pour le retour d'état en temps réel au client.
*   **Sécurité :** Chiffrement des données en base, gestion stricte des clés API IA côté backend, protection contre l'abus de requêtes (Rate Limiting).
