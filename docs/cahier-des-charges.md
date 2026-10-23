# Cahier des Charges - KittStudio

## 1. Présentation du Projet et Contexte

### 1.1. Contexte du Marché
La création de visuels professionnels pour l'e-commerce et le marketing est un processus coûteux et chronophage, nécessitant souvent des photographes, des studios, du matériel d'éclairage et des retoucheurs. Les marques doivent produire du contenu en continu pour leurs fiches produits, leurs publicités sur les réseaux sociaux (Meta Ads, TikTok Ads) et leurs campagnes d'e-mailing.

KittStudio se positionne comme la solution SaaS (Software as a Service) de rupture permettant de démocratiser et d'automatiser ce processus grâce à l'Intelligence Artificielle générative.

### 1.2. Vision et Proposition de Valeur
KittStudio permet à n'importe quel e-commerçant de transformer une simple photo de son produit (prise au smartphone) en un **Kit Marketing Complet** de qualité studio. L'outil préserve l'intégrité absolue du produit (géométrie, textures, logos) tout en générant des scènes contextuelles (lifestyle, nature, studio), des mockups, et le copywriting associé (slogans, légendes multilingues).

### 1.3. Objectifs du Projet
*   **Réduction des Coûts :** Diviser par 10 le coût de production de visuels par rapport à un shooting traditionnel.
*   **Rapidité :** Obtenir un kit marketing complet (images + textes) en moins de 2 minutes.
*   **Cohérence de Marque :** Garantir que les visuels et les textes générés respectent scrupuleusement l'identité de marque (Brand Kit) définie par l'utilisateur.

## 2. Public Cible (Personas)

### 2.1. L'E-commerçant / DNVB (Digital Native Vertical Brand)
*   **Besoins :** Visuels pour fiches produits Shopify/WooCommerce, contenu régulier pour Instagram/TikTok.
*   **Douleurs :** Budget limité pour les photographes, manque de temps, compétences limitées en design.

### 2.2. L'Agence Web / Freelance Marketing
*   **Besoins :** Outil de productivité pour générer rapidement des assets pour les campagnes de leurs clients.
*   **Douleurs :** Gestion multi-clients complexe, besoin d'itérations rapides sur les visuels publicitaires (A/B testing).

## 3. Périmètre Fonctionnel Détaillé

### 3.1. Gestion des Utilisateurs et Workspaces (Espaces de Travail)
*   **Authentification :** Inscription/Connexion sécurisée (Email/Mot de passe, Google OAuth).
*   **Workspaces :** Création d'espaces de travail isolés. Un utilisateur peut appartenir à plusieurs workspaces (idéal pour les agences gérant plusieurs clients).
*   **Rôles et Permissions :** Gestion des droits (Admin, Éditeur, Lecteur) au sein d'un workspace.

### 3.2. Gestion du Brand Kit (Identité de Marque)
*   **Paramétrage Global :** Nom de la marque, URL du site, secteur d'activité.
*   **Identité Visuelle :** Importation de logos (formats vectoriels et raster), définition des palettes de couleurs primaires et secondaires, typographies de référence.
*   **Ton of Voice (Ton de la marque) :** Définition de la ligne éditoriale (ex: "Tutoiement, dynamique, jeune" ou "Vouvoiement, luxueux, institutionnel").

### 3.3. Le Moteur de Création AI (Core Features)
*   **Détourage Automatique (Background Removal) :** Extraction parfaite du produit depuis une image brute, avec gestion des ombres et reflets originaux.
*   **Génération de Scènes (Text-to-Image / Image-to-Image) :**
    *   Catalogue de scènes prédéfinies (Cuisine scandinave, Minimaliste, Nature, Luxe...).
    *   Prompting personnalisé pour les utilisateurs avancés.
    *   **Contrainte absolue :** Le produit doit rester 100% fidèle à l'original.
*   **Copywriting (Text-to-Text) :**
    *   Génération de slogans percutants, légendes pour réseaux sociaux (Instagram, LinkedIn, TikTok).
    *   Proposition de hashtags pertinents et de Call-to-Actions (CTA).
    *   Support multilingue (Français, Anglais, Espagnol, Allemand, etc.).
*   **Édition Post-Génération :** Possibilité d'affiner une image générée via un prompt textuel (ex: "Rendre l'éclairage plus chaud", "Ajouter une plante en arrière-plan").

### 3.4. Export et Partage
*   **Téléchargement :** Export unitaire ou groupé (Archive ZIP) des visuels en Haute Résolution et des textes associés.
*   **Vitrine Publique (Showcase) :** Génération d'une URL publique et optimisée SEO permettant de partager un projet finalisé (avec possibilité de mot de passe).

## 4. Stratégie Multi-Modèles IA (OpenAI + Gemini)

Pour garantir les meilleurs résultats, l'application ne dépendra pas d'un seul fournisseur d'IA. Une couche d'abstraction (Routing) sera implémentée dans le backend pour distribuer les requêtes selon la tâche :

*   **Google Gemini (Pro / Flash) :**
    *   Utilisé pour l'analyse multimodale rapide (compréhension de l'image source).
    *   Génération de texte rapide pour des tâches nécessitant un grand contexte ou des itérations rapides.
*   **OpenAI (GPT-4o / DALL-E 3 / API partenaires) :**
    *   Utilisé pour le copywriting avancé (les nuances de "Tone of Voice" sont souvent mieux gérées par GPT-4).
    *   Possibilité d'utiliser DALL-E (ou des modèles spécialisés via API comme Midjourney/Stable Diffusion) pour la génération d'images, orchestré par le backend.
*   **Fallback Strategy :** Si l'API d'OpenAI est indisponible, le système bascule automatiquement sur Gemini (et inversement) pour assurer une haute disponibilité du service.

## 5. Architecture Technique Cible

L'architecture s'oriente vers un modèle moderne, découplé et scalable. L'ancien prototype backend (Node/Express) est remplacé.

### 5.1. Frontend (Interface Utilisateur)
*   **Framework :** React 19 propulsé par Vite.
*   **Styling :** Tailwind CSS V4 pour une intégration rapide et responsive, couplé à Framer Motion pour des animations fluides.
*   **Gestion d'État :** Zustand ou Redux Toolkit pour gérer les états complexes de génération et le panier de crédits.

### 5.2. Backend (API & Orchestration)
*   **Framework :** FastAPI (Python 3.12+).
*   **Avantages :**
    *   Hautes performances (basé sur Starlette et Pydantic).
    *   Typage fort, génération automatique de la documentation Swagger/OpenAPI.
    *   L'écosystème Python est le plus adapté pour l'intégration des SDK d'Intelligence Artificielle (OpenAI, Google GenAI, LangChain).
*   **SEO et SSR (Server-Side Rendering) :** FastAPI sera configuré pour servir des templates HTML (via Jinja2) pour les pages publiques (Showcases). Cela permet d'injecter dynamiquement les balises Meta (OpenGraph, Twitter Cards) nécessaires pour le référencement naturel et les aperçus de liens sur les réseaux sociaux.

### 5.3. Base de Données
*   **SGBD Relational :** PostgreSQL 18.
*   **Pourquoi PostgreSQL ?** Fiabilité éprouvée, support du JSONB (idéal pour stocker les métadonnées flexibles des scènes générées et des logs d'IA), et capacité de monter en charge.
*   **ORM :** SQLAlchemy couplé à Alembic pour les migrations de schémas.

### 5.4. Stockage Fichiers (Object Storage)
*   Les images générées et sources ne seront plus transitées en Base64 massif.
*   Utilisation d'un bucket Amazon S3 (ou équivalent Google Cloud Storage / Cloudflare R2).
*   L'application générera des "Presigned URLs" pour sécuriser et accélérer l'upload direct depuis le client vers le bucket, soulageant le backend.

### 5.5. Traitements Asynchrones
*   **Broker de messages :** Redis + Celery (ou BackgroundTasks de FastAPI pour démarrer).
*   **Logique :** La génération IA prenant du temps, les requêtes HTTP ne doivent pas bloquer. Le client soumet une tâche, reçoit un ID de job, et interroge le backend (Polling ou via WebSockets/Server-Sent Events) pour connaître l'avancement en temps réel.

## 6. Contraintes Non-Fonctionnelles

### 6.1. Sécurité
*   **Protection des Clés API :** Les clés OpenAI et Gemini ne sont jamais exposées côté client. Tous les appels IA passent obligatoirement par le backend.
*   **Rate Limiting :** Protection des endpoints contre les attaques DDoS et la surconsommation de crédits IA.
*   **RGPD :** Les données des utilisateurs et les images uploadées doivent pouvoir être supprimées définitivement sur demande.

### 6.2. Scalabilité et Performance
*   Le backend FastAPI doit être conteneurisé (Docker) pour permettre un auto-scaling horizontal (ajout d'instances via Kubernetes ou AWS ECS) lors des pics de charge.
*   Mise en cache des requêtes fréquentes (ex: requêtes SEO des pages publiques) via Redis ou un CDN (Cloudflare).

### 6.3. Monétisation et Facturation
*   **Système :** Intégration de Stripe.
*   **Modèle Économique :** Modèle hybride. Abonnement mensuel (SaaS) donnant droit à un quota de crédits, avec possibilité de "Top-up" (achat de crédits supplémentaires "Pay-as-you-go").
