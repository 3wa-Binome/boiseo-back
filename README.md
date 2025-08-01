# 📦 API REST – Gestion de Produits, Matériaux, Fournisseurs & Utilisateurs

Bienvenue dans l’API de gestion de production. Cette API permet de gérer les utilisateurs, produits, catégories, matériaux, fournisseurs, images, et l’authentification.

---

## 🔧 Installation & Configuration

### 1. 📥 Cloner le projet

```bash
git clone https://github.com/ton-utilisateur/ton-projet.git
cd ton-projet
```

### 2. 📦 Installer les dépendances

```bash
npm install
```

### 3. ⚙️ Configurer les variables d’environnement

Crée un fichier `.env` à la racine du projet et ajoute les variables suivantes :

```env
PORT=Asyoulike
NODE_ENV=development
ORIGIN=http://localhost:5173
DATABASE_URL=mysql://root:saisir-ton-mdp@localhost:3306/nom-de-ta-db
JWT_SECRET=MettreUnTrucBadass
```

> 💡 Remplace `saisir-ton-mdp` et `nom-de-ta-db` par tes propres identifiants MySQL.

### 4. 🛠️ Créer la base de données

Assure-toi que MySQL est installé et lancé. Tu peux créer la base de données avec un outil comme MySQL Workbench ou via le terminal :

```sql
CREATE DATABASE nom_de_ta_db;
```

> Le nom doit correspondre à celui utilisé dans `DATABASE_URL`.

### 5. 🧱 Lancer les migrations (si applicable)

```
npm run migrate
```

## 🚀 Lancer le serveur

```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:Asyoulike`.

## 🛣️ La gestion des routes

### 🔐 Authentification (`/auth`)

| Méthode | Route         | Middleware                  | Description                  |
|---------|---------------|-----------------------------|------------------------------|
| POST    | `/login`      | `isAuthenticated(false)` + `requestLimiter(10)` | Connexion utilisateur        |
| POST    | `/register`   | `isAuthenticated(false)`    | Inscription utilisateur      |
| GET     | `/logout`     | `isAuthenticated(true)`     | Déconnexion utilisateur      |
| GET     | `/me`         | `isAuthenticated(true)`     | Vérification de connexion    |

---

### 👤 Utilisateurs (`/users`)

| Méthode | Route         | Middleware                  | Description                  |
|---------|---------------|-----------------------------|------------------------------|
| GET     | `/:id`        | `isAuthenticated(true)` + `isOwner(users)` | Récupérer un utilisateur     |
| PUT     | `/:id`        | `isAuthenticated(true)` + `isOwner(users)` | Modifier un utilisateur      |
| DELETE  | `/:id`        | `isAuthenticated(true)` + `isOwner(users)` | Supprimer un utilisateur     |

---

### 🗂️ Catégories (`/categories`)

| Méthode | Route               | Middleware                                 | Description                         |
|---------|---------------------|--------------------------------------------|-------------------------------------|
| GET     | `/user/:id`         | `isAuthenticated(true)` + `isOwner(users)` | Récupérer les catégories d’un user  |
| GET     | `/:id`              | `isAuthenticated(true)` + `isOwner(categories)` | Récupérer une catégorie             |
| POST    | `/`                 | `isAuthenticated(true)`                    | Créer une catégorie                 |
| PUT     | `/:id`              | `isAuthenticated(true)` + `isOwner(categories)` | Modifier une catégorie              |
| DELETE  | `/:id`              | `isAuthenticated(true)` + `isOwner(categories)` | Supprimer une catégorie             |

---

### 🧱 Matériaux (`/materials`)

| Méthode | Route               | Middleware                                 | Description                         |
|---------|---------------------|--------------------------------------------|-------------------------------------|
| GET     | `/user/:id`         | `isAuthenticated(true)` + `isOwner(users)` | Récupérer les matériaux d’un user   |
| GET     | `/:id`              | `isAuthenticated(true)` + `isOwner(materials)` | Récupérer un matériau               |
| POST    | `/`                 | `isAuthenticated(true)`                    | Créer un matériau                   |
| PUT     | `/:id`              | `isAuthenticated(true)` + `isOwner(materials)` | Modifier un matériau                |
| DELETE  | `/:id`              | `isAuthenticated(true)` + `isOwner(materials)` | Supprimer un matériau               |

---

### 🖼️ Images (`/pictures`)

| Méthode | Route               | Middleware                                 | Description                         |
|---------|---------------------|--------------------------------------------|-------------------------------------|
| GET     | `/product/:id`      | `isAuthenticated(true)` + `isOwner(products)` | Récupérer les images d’un produit   |
| GET     | `/:id`              | _(aucun)_                                  | Récupérer une image                 |
| POST    | `/`                 | `isAuthenticated(true)`                    | Ajouter une image                   |
| DELETE  | `/:id`              | `isAuthenticated(true)` + `isOwner(pictures)` | Supprimer une image                 |

---

### 🛠️ Produits (`/products`)

| Méthode | Route                        | Middleware                                        | Description                             |
|---------|------------------------------|---------------------------------------------------|-----------------------------------------|
| GET     | `/user/:id`                  | `isAuthenticated(true)` + `isOwner(users)`        | Produits d’un utilisateur               |
| GET     | `/categories/:id`           | `isAuthenticated(true)` + `isOwner(categories)`   | Produits d’une catégorie                |
| GET     | `/:id`                       | `isAuthenticated(true)` + `isOwner(products)`     | Récupérer un produit                    |
| POST    | `/`                          | `isAuthenticated(true)`                           | Créer un produit                        |
| PUT     | `/:action/:id`               | `isAuthenticated(true)` + `isOwner(products)`     | Modifier la quantité d’un produit       |
| PUT     | `/:id`                       | `isAuthenticated(true)` + `isOwner(products)`     | Modifier un produit                     |
| DELETE  | `/:id`                       | `isAuthenticated(true)` + `isOwner(products)`     | Supprimer un produit                    |

---

### 🧾 Fournisseurs (`/suppliers`)

| Méthode | Route               | Middleware                                 | Description                         |
|---------|---------------------|--------------------------------------------|-------------------------------------|
| GET     | `/user/:id`         | `isAuthenticated(true)` + `isOwner(users)` | Fournisseurs d’un utilisateur       |
| GET     | `/:id`              | `isAuthenticated(true)` + `isOwner(suppliers)` | Récupérer un fournisseur            |
| POST    | `/`                 | `isAuthenticated(true)`                    | Créer un fournisseur                |
| PUT     | `/:id`              | `isAuthenticated(true)` + `isOwner(suppliers)` | Modifier un fournisseur             |
| DELETE  | `/:id`              | `isAuthenticated(true)` + `isOwner(suppliers)` | Supprimer un fournisseur            |

---

## 🔒 Middleware utilisés

- `isAuthenticated(true|false)` : vérifie si l’utilisateur est connecté ou non
- `isOwner(resource)` : vérifie que l’utilisateur est propriétaire de la ressource
- `requestLimiter(n)` : limite le nombre de requêtes (ex: anti-bruteforce)
- `requestLogger()` : permet d'afficher un log de la route/méthode appelée

---

## 🧪 Environnement

- Authentification via JWT (stocké dans un cookie `accessToken`)
- Toutes les routes protégées nécessitent un token valide
- Les routes publiques : `/auth/login`, `/auth/register`

---