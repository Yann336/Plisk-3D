# Plisk 3D

Application e-commerce full-stack sur le thème de l'impression 3D (catalogue, panier, authentification sécurisée).

## Objectif du projet

Plisk 3D est une application e-commerce full-stack sur le thème de l'impression 3D. L'objectif pédagogique est de démontrer la maîtrise des mécanismes fondamentaux d'une application web moderne : authentification sécurisée, opérations CRUD, logique métier — il ne s'agit pas d'un produit destiné à la production, mais d'un livrable de formation.

## Sommaire

- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [Captures d'écran](#captures-décran)
- [Installation et lancement](#installation-et-lancement)
- [Variables d'environnement](#variables-denvironnement)
- [Fonctionnalités](#fonctionnalités)
- [Roadmap](#roadmap)
- [Base de données](#base-de-données)
- [Auteur](#auteur)

## Stack technique

- **Frontend** : Vue.js 3 (Composition API, `<script setup>`), Vue Router, Pinia, Axios
- **Backend** : Node.js, Express.js, JWT (`jsonwebtoken`), `bcrypt`, `cookie-parser`, `cors`, `dotenv`, `mysql2`
- **Paiement** : Stripe Checkout (`stripe`), en mode test
- **Documentation API** : Swagger (`swagger-jsdoc` + `swagger-ui-express`), exposée sur `/api-docs`
- **Base de données** : MySQL (via phpMyAdmin / WAMP)
- **Outils de développement** : VS Code, Vite, ESLint

## Architecture

Le projet est séparé en deux parties indépendantes :

```
/back     → API Express.js + connexion MySQL
/front    → Application Vue.js (Vite)
```

Chaque partie tourne dans son propre terminal et communique via des requêtes HTTP (Axios / fetch côté front).

## Structure du projet

```
projet_bts/
├── back/
│   ├── app.js                        → point d'entrée Express
│   └── src/
│       ├── bdd/
│       │   └── bdd.sql               → schéma SQL (users, products, baskets, orders, ...)
│       ├── config/
│       │   ├── db.js                 → connexion MySQL
│       │   └── swagger.js            → config Swagger
│       ├── controllers/              → logique des routes (auth, basket, products, purchase)
│       ├── middlewares/
│       │   └── authMiddleware.js     → vérification du JWT (checkAuth)
│       ├── models/                   → requêtes SQL (authModels, basketsModels, usersModels, orderModels)
│       └── routes/                   → définition des routes Express (auth, baskets, products, purchase)
└── front/
    └── src/
        ├── assets/                   → images et styles
        ├── components/
        │   └── navbar.vue
        ├── router/
        │   └── index.js              → routes Vue Router + guard d'authentification
        ├── services/
        │   └── api.js                → client Axios centralisé (token, refresh, rejeu 401)
        ├── stores/                   → stores Pinia (auth, basket, purchase)
        └── views/                    → pages (Home, Login, Register, Basket, product, SuccesPurchase, CancelPurchase, ...)
```

## Captures d'écran

*(à ajouter — captures du catalogue, de la fiche produit et du panier)*

## Installation et lancement

```bash
git clone <url-du-dépôt>
cd projet_bts
```

### Backend

```bash
cd back
npm install
npm run dev
```

L'API est servie sur `http://localhost:3000` et sa documentation Swagger sur `http://localhost:3000/api-docs`.

> `npm run dev` lance en parallèle `nodemon` et `stripe listen --forward-to localhost:3000/api/purchase/stripe` (via `concurrently`), pour recevoir les webhooks Stripe en local. Nécessite la [Stripe CLI](https://stripe.com/docs/stripe-cli) installée et authentifiée (`stripe login`).

### Frontend

```bash
cd front
npm install
npm run dev
```

Voir la section [Variables d'environnement](#variables-denvironnement) pour les fichiers `.env` requis avant le premier lancement.

## Variables d'environnement

### Backend (`back/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port d'écoute de l'API (défaut : `3000`) |
| `DB_HOST` | Hôte de la base MySQL |
| `DB_USER` | Utilisateur MySQL |
| `DB_PASS` | Mot de passe MySQL |
| `DB_NAME` | Nom de la base de données |
| `ACCESS_TOKEN_SECRET` | Secret de signature du JWT d'accès |
| `REFRESH_TOKEN_SECRET` | Secret de signature du refresh token |
| `FRONT_URL` | URL du frontend autorisée par CORS (ex : `http://localhost:5173`) |
| `STRIPE_API` | Clé secrète Stripe (mode test) utilisée pour créer les sessions de paiement |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe (`POST /api/purchase/stripe`), utilisé pour vérifier la signature des événements |

### Frontend (`front/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL de l'API backend (ex : `http://localhost:3000`) |

## Fonctionnalités

- [x] Catalogue produits : liste des produits récupérée depuis l'API
- [x] Authentification : architecture à double token (access token JWT courte durée + refresh token en base de données)
- [x] Création de compte (inscription) reliée à l'API
- [x] Formulaire de connexion (Vue.js) relié à l'API
- [x] Gestion des erreurs (identifiants invalides vs erreur réseau)
- [x] Redirection automatique après connexion réussie
- [x] Documentation de l'API via Swagger
- [x] Refresh token stocké en cookie `httpOnly` (arbitrage tranché, ne transite plus dans le corps JSON)
- [x] Store Pinia (`front/src/stores/auth.js`) pour centraliser l'état d'authentification (`login`, `refresh`, `isLoggedIn`)
- [x] Persistance de la connexion au rechargement de page (appel de `auth.refresh()` au montage de `App.vue`)
- [x] Déconnexion (`POST /api/auth/logout`) : révoque le refresh token en base et vide le cookie `httpOnly`
- [x] Client Axios centralisé (`front/src/services/api.js`) : ajoute automatiquement le token en en-tête et gère le rafraîchissement + rejeu de la requête sur un 401
- [x] Routes protégées côté front (guard `router.beforeEach` sur `meta.requiresAuth`, ex : `/basket`)
- [x] Page de détail produit au clic (`/product/:id`)
- [x] Middleware d'authentification backend (`back/src/middlewares/authMiddleware.js`) branché sur les routes du panier
- [x] Panier : store Pinia (`front/src/stores/basket.js`), vue `Basket.vue` (quantités, suppression, total), boutons "Ajouter au panier" sur les vues produit, API `/api/basket` (routes protégées)
- [x] Paiement en mode test (Stripe) : bouton "Passer au paiement" (`Basket.vue`) → store Pinia `purchase.js` → session Stripe Checkout (`POST /api/purchase`, adresse de livraison collectée) → redirection vers Stripe, pages `SuccesPurchase.vue`/`CancelPurchase.vue`
- [x] Création de la commande en base depuis le webhook Stripe : sur `checkout.session.completed`, insertion de la commande et de ses lignes (`orders`, `orders_products`) dans une transaction SQL, puis vidage du panier

## Roadmap

- [ ] Récapitulatif de commande (historique des commandes passées, côté front)
- [ ] Gestion des rôles utilisateurs

## Base de données

Tables présentes dans `back/src/bdd/bdd.sql` :
- `users` : informations utilisateurs et identifiants
- `refresh_token` : stockage des tokens de rafraîchissement associés aux utilisateurs
- `products` : catalogue produits
- `images` : images associées à un produit
- `baskets` : panier de chaque utilisateur (créé automatiquement à l'inscription)
- `baskets_products` : table de liaison produits ↔ panier (quantité)
- `orders` : commandes passées
- `orders_products` : table de liaison produits ↔ commande (quantité)

## Auteur

Yann Popov