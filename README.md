# 🔐 Escape Game API

Bienvenue dans ce TP ! Tu vas construire une API REST pour un **escape game en ligne**. Les joueurs doivent s’inscrire, se connecter, puis résoudre des énigmes pour progresser de salle en salle.

## 🎯 Objectifs pédagogiques

- Structurer une API Express de façon modulaire
- Protéger les routes avec des middleware (authentification & autorisation)
- Gérer l’authentification avec JSON Web Tokens (JWT)
- Manipuler des données en mémoire (ou fichier JSON)
- Rendre la progression dépendante de l’utilisateur

---

## 🎮 Contexte et gameplay

Vous développez une API qui simule un jeu de type **escape game**. Les utilisateurs doivent :

1. **S’enregistrer** (`POST /auth/register`)
2. **Se connecter** (`POST /auth/login`) et obtenir un token JWT
3. **Répondre aux énigmes** dans chaque salle via les routes `/rooms/:id`
   - Une salle = une énigme.
   - Chaque utilisateur commence en salle 1.
   - L'accès à la salle suivante n'est possible **qu’après avoir répondu correctement à l’énigme précédente**.
   - Le jeu se termine après avoir franchi toutes les salles.

> ⚠️ Toutes les routes de jeu sont protégées :
> - Il faut être **authentifié** dans le header (`Authorization: Bearer TOKEN`)
> - Il faut avoir **débloqué la salle précédente** pour accéder à la suivante

---

## 🧭 Routes disponibles

### 🔐 Authentification

| Méthode | URL               | Description                            |
|---------|-------------------|----------------------------------------|
| POST    | `/auth/register`  | Crée un utilisateur                    |
| POST    | `/auth/login`     | Connecte un utilisateur (JWT en retour) |
| GET     | `/auth/me`        | Retourne les infos de l’utilisateur connecté |

### 🧠 Escape Game

| Méthode | URL                    | Protection          | Description                          |
|---------|------------------------|---------------------|--------------------------------------|
| GET     | `/rooms/:id`           | Auth + AccessControl | Retourne la question de la salle     |
| POST    | `/rooms/:id/answer`    | Auth + AccessControl | Vérifie la réponse, débloque la suite |

---

## 🏗️ Partie 1 — Mise en place du projet

### 📁 Structure du projet :

```
Parcours-EspaceGame/
├── app.js
├── .env
├── routes/
│ ├── auth.js
│ └── rooms.js
├── controllers/
│ ├── authController.js
│ └── roomsController.js
├── middleware/
│ ├── auth.js
│ └── accessControl.js
├── repositories/
│ └── usersRepository.js
├── data/
│ └── rooms.js
└── README.md
```

### 📦 Dépendances à installer :

```bash
# Installer les dépendances
npm install

# Renommer le fichier .env.example en .env et mettez les variables
PORT=3000
JWT_SECRET="superSecretEscapeKey"

# Lancer le serveur
npm run dev
```

Regardez bien les dépendances présentes dans ce projet pour savoir ce que vous pouvez utiliser

### 🔐 Exemple de Token

Après POST /auth/login, vous recevrez :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

À utiliser dans les **headers** pour les routes protégées :

```
Authorization: Bearer <votre_token>
```

### 🧪 Exemple de scénario de jeu

    POST /auth/register → créez alice

    POST /auth/login → obtenez le token de alice

    GET /rooms/1 → affiche l’énigme de la salle 1

    POST /rooms/1/answer avec { "answer": "blanc" } → succès, vous débloquez la salle 2

    GET /rooms/2 → nouvelle énigme, et ainsi de suite…


## 👤 Partie 2 — Authentification des joueurs

Routes à terminer :

    POST /register → Inscription

    POST /login → Connexion (renvoie un token JWT)

    GET /me → Affiche les infos de l’utilisateur connecté

À implémenter :

    Hash du mot de passe (bcrypt)

    Génération du JWT (jsonwebtoken)

    Vérification du token via un middleware auth.js

### TODO code : 

1. Dans le fichier `routes/auth.js`
    - Ajouter la route POST /login qui pointe vers la méthode login du authController. 
    - Ajouter le authMiddleware et pointer vers la méthode me du authController dans la route `/me`
2. Dans le fichier `controller/authController.js`
    - Récupérer les noms d'utilisateur `username`and `password` dans le body de la requête
    - Hasher le password avec bcrypt
    - Return success message

### 📜 Schéma du parcours d'une requête d'authentification

Réalisez un schéma clair du parcours complet d'une requête HTTP dans cette API pour les requêtes suivantes :

1. Que se passe-t-il quand on appelle POST /auth/register ?
2. Que se passe-t-il quand on appelle POST /auth/login en tant qu'utilisateur connecté ?
3. Que se passe-t-il quand on appelle GET /auth/me en tant qu'utilisateur connecté ? 

Votre schéma devra montrer les étapes suivantes :

- Point d'entrée : quelle route Express est appelée ?
- Middleware déclenchés : dans quel ordre passent-ils ? (authentification, logger, access control…)
- Contrôleur : quelle fonction est appelée ? que fait-elle ?
- Accès aux données : comment on récupère les infos (ex. : userRepository, rooms.js) ?
- Réponse envoyée : quel est le contenu de la réponse, d’où vient-il ?


Le schéma peut être fait sur papier, en ligne ( ➡️ [https://excalidraw.com](https://excalidraw.com), ou en utilisant un outil de votre choix.

📎 N’oubliez pas d’indiquer :

- les fichiers concernés à chaque étape (routes/rooms.js, middleware/auth.js, etc.)
- les fonctions clés (ex. auth, accessControl, getRoom)
- un exemple de donnée transmise (ex. req.user, req.params.id)


Mettez votre schéma dans un dossier `/captures`

## 🧩 Partie 3 — Salles et énigmes

Routes à terminer :

    GET /rooms/:id → Affiche l’énigme de la salle

    POST /rooms/:id/answer → Envoie une réponse

Comportement attendu :

    Un joueur commence à la salle 1 (currentRoom = 1)

    Il ne peut accéder à la salle 2 qu’après avoir résolu la salle 1

    Les énigmes sont stockées dans data/rooms.js

### TODO code : 

3. Dans le fichier `routes/rooms.js`
    - Ajouter middleware d'authentification auth et de contrôle d'accès accessControl aux routes
4. Dans le fichier `controllers/roomsController.js`
    - Dans `getRoom`récupérer l'id de la room depuis les paramètres de la requête
    - Trouver la room correcpondante dans le tableau rooms. 
    - Dans `submitAnswer` récupérer la réponse dans le corps de requête, trouver la room concernée dans le tableau room, vérifier l'existence de la room sinon retrouner 404. 

### 📜 Schéma du parcours d'une requête de room

Réalisez un schéma clair du parcours complet d'une requête HTTP dans cette API pour les requêtes suivantes :

- Que se passe-t-il quand on appelle GET /room/1 ? Faites les cas selon si la personne est connectée ou non et si la personne a le droit d'accès. 

Votre schéma devra montrer les étapes suivantes :

- Point d'entrée : quelle route Express est appelée ?
- Middleware déclenchés : dans quel ordre passent-ils ? (authentification, logger, access control…)
- Contrôleur : quelle fonction est appelée ? que fait-elle ?
- Accès aux données : comment on récupère les infos (ex. : userRepository, rooms.js) ?
- Réponse envoyée : quel est le contenu de la réponse, d’où vient-il ?

## Partie 4 : Jouer au jeu

Faites fonctionner votre jeu et arrivez jusqu'à la room 

```json
{
  "success": true,
  "message": "Congratulations! You've completed the game!"
}
```

Prenez une capture d'écran et enregistrez la dans /captures


## 💡 BONUS : Pour aller plus loin

- Ajouter une route /leaderboard pour voir tous les utilisateurs et leur salle actuelle. Suivez l'architecture Route, Controller, Repository. 
- Persister les utilisateurs dans un fichier avec des opérations utilisant le module fs. 
- Générer un QR Code à la fin du jeu 🎉