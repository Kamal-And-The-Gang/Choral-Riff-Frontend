# Choral-Riff-Frontend

## Description

Le frontend de Choral Riff fournit une interface web permettant aux utilisateurs de gérer leurs ensembles musicaux, leurs morceaux et leurs ressources associées.

Il communique avec l'API REST Spring Boot du backend pour accéder aux fonctionnalités métier de l'application.

## Technologies

* React 18
* JavaScript / TypeScript
* Vite
* React Router
* Fetch API
* Axios
* React Context API
* React Toastify
* CSS

## Fonctionnalités

### Authentification

* Inscription des utilisateurs
* Connexion
* Déconnexion
* Gestion de l'espace utilisateur
* Gestion des invitations lors de l'inscription
* Communication avec les endpoints d'authentification du backend

### Gestion des ensembles

* Création d'un ensemble
* Consultation des ensembles
* Consultation du détail d'un ensemble
* Modification d'un ensemble
* Gestion des membres
* Gestion des pupitres et des rôles

### Gestion des morceaux et ressources

* Ajout de morceaux
* Consultation du détail d'un morceau
* Gestion des documents et ressources multimédias
* Accès aux ressources associées aux ensembles

### Invitations et rattachements

* Acceptation ou refus d'une invitation
* Gestion des rattachements aux ensembles
* Rattachement automatique après inscription
* Gestion des invitations par token
* Redirection vers l'ensemble après acceptation

### Système de notifications

La gestion des notifications est centralisée avec la Context API de React.

Le `NotificationProvider` permet notamment :

* De récupérer les notifications de l'utilisateur
* De calculer le nombre de notifications non lues
* De marquer une notification comme lue
* De marquer toutes les notifications comme lues
* D'accepter ou refuser les invitations
* De gérer les demandes de rattachement
* De mettre à jour l'interface après une action utilisateur

Les notifications sont actualisées périodiquement afin de maintenir l'interface synchronisée avec le backend.

Les retours utilisateur sont affichés avec React Toastify.

## Architecture

```text
src/
├── api/
│   ├── authApi.ts
│   ├── NotificationApi
│   └── invitationApi
│
├── components/
│   ├── Header
│   └── Footer
│
├── contexts/
│   ├── AuthContext
│   └── NotificationContext
│
├── pages/
│   ├── HomePage
│   ├── Dashboard
│   ├── Connexion
│   ├── Inscription
│   ├── Ensembles
│   ├── EnsembleDetails
│   ├── MembersList
│   ├── TrackDetails
│   ├── Invitation
│   ├── InvitationAcceptPage
│   └── NotificationPage
│
└── App.jsx
```

L'organisation du projet sépare les pages, les composants réutilisables, les contextes de gestion d'état et les modules responsables des appels à l'API.

## Gestion de l'état

La Context API de React est utilisée pour partager certaines données entre les différentes pages.

Le `AuthContext` centralise les informations liées à l'utilisateur connecté.

Le `NotificationProvider` centralise quant à lui :

* les notifications ;
* le nombre de notifications non lues ;
* leur état de lecture ;
* les actions liées aux invitations ;
* les actions de rattachement à un ensemble.

## Communication avec le backend

Le frontend communique avec l'API REST Spring Boot à travers des modules dédiés.

Les requêtes HTTP utilisent la Fetch API et Axios selon les fonctionnalités.

L'URL de l'API peut être configurée avec une variable d'environnement Vite :

```text
VITE_API_URL
```

Cela permet d'utiliser différentes configurations selon l'environnement d'exécution.

Les données échangées avec le backend sont typées à partir de schémas générés de l'API, notamment pour les DTO d'inscription, de connexion et d'utilisateur.

Les erreurs HTTP sont également traitées côté frontend afin d'informer l'utilisateur lorsqu'une opération échoue.

## Navigation

React Router permet de gérer les différents parcours de l'application :

* Tableau de bord
* Ensembles
* Détails d'un ensemble
* Membres
* Morceaux
* Invitations
* Notifications
* Authentification

## Architecture globale

```text
┌──────────────────────────────┐
│        React / Vite          │
│          Frontend            │
│                              │
│ Pages / Components           │
│ Contexts / API Services      │
└──────────────┬───────────────┘
               │
               │ API REST / HTTP
               ▼
┌──────────────────────────────┐
│        Spring Boot           │
│          Backend             │
│                              │
│ Controllers / Services       │
│ Spring Security / JPA        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         PostgreSQL           │
└──────────────────────────────┘
```

## Lancement du projet

```bash
npm install
npm run dev
```

Le frontend est ensuite accessible depuis le navigateur à l'adresse indiquée par Vite.

## Contribution technique

Le développement frontend a notamment porté sur :

* La création des parcours utilisateurs avec React Router
* L'intégration de l'API REST Spring Boot
* La gestion centralisée de l'authentification
* La gestion centralisée des notifications avec React Context
* La gestion des invitations et des rattachements aux ensembles
* L'intégration de données typées à partir des schémas de l'API
* La configuration de l'URL de l'API via les variables d'environnement
* La gestion des états de chargement et des erreurs
* La mise en place de retours utilisateur avec React Toastify
