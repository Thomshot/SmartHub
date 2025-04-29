# SmartHub

SmartHub est une application full-stack conçue pour gérer des appareils intelligents et des services dans un environnement domestique connecté. Elle comprend un front-end développé avec Angular et un back-end basé sur Node.js et MongoDB.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Instructions d'installation](#instructions-dinstallation)
  - [Front-End](#front-end)
  - [Back-End](#back-end)
- [Scripts](#scripts)
- [Variables d'environnement](#variables-denvironnement)
- [Licence](#licence)

---

## Fonctionnalités

SmartHub offre une gamme de fonctionnalités pour simplifier la gestion des appareils intelligents et des services connectés :

- **Gestion des utilisateurs** : 
  - Les utilisateurs peuvent s'inscrire, se connecter et gérer leurs profils.
  - Les informations personnelles sont sécurisées grâce à l'authentification JWT.

- **Gestion des appareils** : 
  - Ajoutez, modifiez ou supprimez des appareils intelligents.
  - Consultez les détails des appareils, comme leur statut ou leurs paramètres.

- **Gestion des services** : 
  - Gérez les abonnements ou les outils connectés.
  - Recevez des notifications sur les mises à jour ou les renouvellements de services.

- **Filtres avancés** : 
  - Recherchez et filtrez les appareils et services par catégorie, statut ou autres critères.

- **Design responsive** : 
  - L'interface utilisateur est optimisée pour une utilisation fluide sur ordinateurs, tablettes et smartphones.

- **Authentification sécurisée** : 
  - Les sessions utilisateur sont protégées par des jetons JWT pour garantir la confidentialité et la sécurité.

---

## Technologies utilisées

### Front-End
- Angular 18
- Angular Material
- TypeScript
- SCSS

### Back-End
- Node.js
- Express.js
- MongoDB avec Mongoose
- JWT pour l'authentification
- Multer pour la gestion des fichiers
- Nodemailer pour les services d'email

---

## Instructions d'installation

### Front-End

1. Accédez au répertoire `front-end` :
   ```bash
   cd h:\Documents\SmartHub\front-end
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez le serveur de développement :
   ```bash
   npm start
   ```

4. Ouvrez l'application dans votre navigateur à l'adresse `http://localhost:4200`.

---

### Back-End

1. Accédez au répertoire `back-end` :
   ```bash
   cd h:\Documents\SmartHub\back-end
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez un fichier `.env` dans le répertoire `back-end` et configurez les variables suivantes :
   ```env
   MONGO_URI=<votre_chaine_de_connexion_mongo>
   JWT_SECRET=<votre_secret_jwt>
   EMAIL_USER=<votre_email>
   EMAIL_PASS=<votre_mot_de_passe_email>
   ```

4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

5. Le serveur back-end sera accessible à l'adresse `http://localhost:3000`.

---

## Scripts

### Front-End
- `npm start` : Démarre le serveur de développement Angular.
- `npm run build` : Compile l'application Angular pour la production.
- `npm test` : Exécute les tests unitaires.

### Back-End
- `npm run dev` : Démarre le serveur Node.js en mode développement.

---

## Variables d'environnement

Les variables d'environnement suivantes sont nécessaires pour le back-end :

- `MONGO_URI` : Chaîne de connexion MongoDB.
- `JWT_SECRET` : Clé secrète pour l'authentification JWT.
- `EMAIL_USER` : Adresse email pour l'envoi des emails.
- `EMAIL_PASS` : Mot de passe pour le compte email.

---

## Licence

Ce projet est sous licence MIT. Consultez le fichier LICENSE pour plus de détails.