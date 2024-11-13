# Annoucement App

## Description

Cette API permet de gérer une collection d'annonces, de catégories et d'utilisateurs. Vous pouvez l'utiliser pour créer, lire, mettre à jour et supprimer des annonces locales en Mauritanie.

### Prérequis

- [Node.js](https://nodejs.org/) (version 20.16.0 ou supérieure)
- [Express.js](https://www.npmjs.com/package/express) (version 4.21 ou supérieure)
- [PostgreSQL](https://www.postgresql.org/) (base de données relationnelle)

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
- Créez un fichier .env à la racine du projet avec la configuration suivante : 
  ```js
  DATABASE_URL="postgresql://user:password@localhost:5432/announcement_db"

## Utilisation

Pour démarrer l'application, exécutez la commande suivante :

```bash
  npm start
```

# Collection Postman

  Vous pouvez importer la collection Postman fournie Announcement_colleection.json pour tester facilement tous les endpoints de l'API.

## Author

- **GitHub** : [Mariem Dianifaba](https://github.com/mariem2012)
