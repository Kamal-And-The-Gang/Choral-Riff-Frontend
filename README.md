# Choral-Riff-Frontend 🎵


## Sommaire

* [Description](#description)
* [Technologies](#technologies)
* [Fonctionnalités](#fonctionnalités)
* [Organisation du projet](#organisation-du-projet)
* [Authentification](#authentification)
* [Communication avec l'API](#communication-avec-lapi)
* [Gestion des notifications](#gestion-des-notifications)
* [Navigation](#navigation)
* [Architecture générale](#architecture-générale)
* [Installation](#installation)
* [Ma contribution](#ma-contribution)
* [Contexte](#contexte)


## Description

Le frontend de **Choral-Riff** est une application web développée avec React.
Il permet aux utilisateurs de gérer leurs ensembles musicaux, leurs membres, leurs morceaux, leurs documents et leurs notifications.

Le frontend communique avec une API REST développée avec **Java / Spring Boot**.

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

* Inscription
* Connexion
* Déconnexion
* Gestion de la session utilisateur
* Gestion des invitations

### Gestion des ensembles

* Création d'un ensemble
* Consultation des ensembles
* Modification d'un ensemble
* Consultation des membres
* Gestion des rôles au sein des ensembles

### Gestion des morceaux et documents

* Ajout de morceaux
* Consultation des morceaux
* Accès aux documents associés
* Gestion des ressources musicales

### Invitations

* Réception d'invitations
* Acceptation ou refus d'une invitation
* Rattachement à un ensemble
* Gestion du rattachement après inscription

### Notifications

* Affichage des notifications
* Nombre de notifications non lues
* Marquage d'une notification comme lue
* Marquage de toutes les notifications comme lues
* Gestion des invitations et demandes de rattachement depuis les notifications

## Organisation du projet

```text
src/
├── api/
│   ├── authApi.ts
│   ├── invitationApi
│   └── NotificationApi
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
│   └── NotificationPage
│
└── App.tsx
```

L'organisation permet de séparer les pages, les composants réutilisables, les appels à l'API et certains états partagés de l'application.

## Authentification

L'application utilise un système d'authentification basé sur un token fourni par le backend.

Le frontend utilise notamment un `AuthContext` pour :

* conserver l'état de connexion de l'utilisateur ;
* restaurer la session lors du rechargement de l'application ;
* récupérer certaines informations présentes dans le token ;
* gérer la connexion et la déconnexion ;
* gérer les rôles associés aux ensembles.

Les contrôles de sécurité et les autorisations définitives sont assurés par le backend.

## Communication avec l'API

Les communications avec le backend sont réalisées à l'aide de la Fetch API et d'Axios.

L'adresse de l'API peut être configurée avec une variable d'environnement Vite :

```text
VITE_API_URL
```

Les appels à l'API sont regroupés dans différents fichiers afin de séparer cette partie de la logique des pages et des composants.

## Gestion des notifications

La gestion des notifications est centralisée avec la Context API de React.

Le `NotificationContext` permet notamment de gérer :

* le chargement des notifications ;
* le nombre de notifications non lues ;
* leur statut de lecture ;
* les invitations ;
* les demandes de rattachement.

Les notifications sont régulièrement actualisées afin de récupérer les éventuelles nouvelles notifications.

## Navigation

La navigation de l'application est gérée avec React Router.

Quelques exemples de parcours :

* Connexion
* Inscription
* Tableau de bord
* Ensembles
* Membres d'un ensemble
* Morceaux
* Invitations
* Notifications

## Architecture générale

```text
┌─────────────────────────┐
│      React / Vite       │
│        Frontend         │
│                         │
│ Pages / Components      │
│ Contexts / API          │
└────────────┬────────────┘
             │
             │ API REST
             ▼
┌─────────────────────────┐
│     Spring Boot         │
│        Backend          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       PostgreSQL        │
└─────────────────────────┘
```

## Installation

### Prérequis

* Node.js
* npm

### Installation

```bash
npm install
```

### Lancement

```bash
npm run dev
```

L'application est ensuite accessible à l'adresse indiquée par Vite.

## Ma contribution

Dans le cadre de ce projet, j'ai participé au développement du frontend React et à son intégration avec le backend Spring Boot.

J'ai notamment travaillé sur :

* la création et l'évolution de pages React ;
* l'intégration des API REST ;
* les parcours d'inscription et de connexion ;
* la gestion des ensembles et de leurs membres ;
* les invitations et les demandes de rattachement ;
* la gestion des notifications ;
* la gestion de l'état avec React Context ;
* l'intégration des rôles et permissions dans l'interface.

Ce projet m'a permis de mettre en pratique React, TypeScript, les API REST, la gestion d'état et l'intégration d'un frontend avec un backend Java / Spring Boot.

## Contexte

Projet réalisé dans le cadre d'un **stage en association de chant**, pour le titre professionnel **Concepteur Développeur d'Applications (CDA)**.

L'objectif du projet est de proposer une application permettant à une chorale ou un ensemble musical de centraliser ses membres, morceaux, partitions et autres ressources musicales.

