# Annoucement App

## Description

Cette API permet de gérer une collection d'annonces, de catégories et d'utilisateurs. Vous pouvez l'utiliser pour créer, lire, mettre à jour et supprimer des annonces locales en Mauritanie.

## Prérequis

- [Node.js](https://nodejs.org/) (version 20.16.0 ou supérieure)
- [Express.js](https://www.npmjs.com/package/express) (version 4.21 ou supérieure)
- [PostgreSQL](https://www.postgresql.org/) (base de données relationnelle)
- [Postman](https://www.postman.com/downloads/) (dernière version)
- [Prisma](https://www.prisma.io/docs/) (dernière version)

## Installation

Suivez ces étapes pour configurer le projet sur votre machine locale :

1. **Clonez le repository :**

   ```bash
       https://github.com/mariem2012/Back-end-Announcement-app.git
   ```

2. **Accédez au dossier du projet :**

   ```bash
      cd Back-end-Announcement-app
   ```

3. **Installez les dépendances :**

   ```bash
     npm install
   ```

4. **Configuration de la base de données avec Prisma**

- Assurez-vous que PostgreSQL est en cours d'exécution sur votre machine locale.
- Créez une base de données pour le projet (par exemple, `announcement_db`).
- Créez un fichier .env à la racine du projet avec la configuration suivante : 
  ```js
  DATABASE_URL="postgresql://user:password@localhost:5432/announcement_db"
  PORT=3500
  JWT_SECRET=secret


## Utilisation

Pour démarrer l'application, exécutez la commande suivante :

```bash
  npm start
```

## Utilisation de Prisma
Prisma est utilisé pour gérer la base de données et faciliter les migrations ainsi que la génération des modèles. Vous devez exécuter les commandes suivantes pour préparer Prisma dans votre projet.
### Générer les fichiers Prisma

Après avoir configuré votre base de données et modifié le fichier `.env`, vous devez générer les fichiers nécessaires à Prisma en utilisant la commande suivante :

```bash
npx prisma generate
```

```bash
npx prisma migrate dev
```

## Documentation et Collection Postman

 Pour tester les différents endpoints de l'API, vous pouvez utiliser la collection Postman incluse dans ce projet. Elle contient toutes les requêtes configurées pour interagir avec l'API.

- **Exporter les collections** : `Announcement-Collection.json`
- **Importer dans Postman** et exécuter les requêtes.

## Author

- **GitHub** : [Mariem Dianifaba](https://github.com/mariem2012)
