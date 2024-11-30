import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoryRoutes from './src/routes/categoryRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import announcementRoutes from './src/routes/announcementRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import profilRoutes from './src/routes/profilRoutes.js';
// import expressFileUpload from 'express-fileupload';
// import fs from 'fs';
// import path from 'path';

dotenv.config();

// Configuration du chemin absolu
// const __dirname = path.resolve();
const app = express();
// const uploadsDir = path.join(__dirname, 'uploads');

// Vérification et création du dossier "uploads" si nécessaire
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log('Dossier "uploads" créé avec succès.');
// }

// Configuration CORS
const corsOptions = {
  origin: ['http://localhost:5173'], // Origine autorisée
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes HTTP autorisées
  credentials: true, 
};
app.use(cors(corsOptions));

// Middleware JSON conditionnel pour éviter les erreurs avec les requêtes GET/DELETE
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Middleware pour la gestion des fichiers
// app.use(
//   expressFileUpload({
//     limits: { fileSize: 5 * 1024 * 1024 }, // Taille maximale des fichiers : 5MB
//     abortOnLimit: true,
//     useTempFiles: true, // Utilisation de fichiers temporaires
//     tempFileDir: uploadsDir, // Dossier temporaire
//     createParentPath: true,
//   })
// );

// Endpoint de téléchargement des fichiers
// app.post('/announcements', async (req, res) => {
//   try {
//     const { title, price, category_id, description, publish_date } = req.body;
//     const imagePaths = [];

//     // Vérifiez si des fichiers ont été envoyés
//     if (req.files) {
//       for (const key in req.files) {
//         const file = req.files[key];
        
//         // Générer un nom unique pour chaque fichier
//         const imageName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
//         const uploadPath = path.join(uploadsDir, imageName);

//         // Déplacer le fichier dans le répertoire "uploads"
//         await file.mv(uploadPath);
        
//         // Ajouter le chemin relatif à la liste
//         imagePaths.push(`/uploads/${imageName}`);
//       }
//     }

//     // Sauvegarder l'annonce dans la base de données avec les chemins d'image
//     const newAnnouncement = await saveAnnouncementToDB({
//       title,
//       price,
//       category_id,
//       description,
//       publish_date,
//       images: JSON.stringify(imagePaths), // Sauvegarde en tant que chaîne JSON
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Annonce créée avec succès',
//       data: newAnnouncement,
//     });
//   } catch (error) {
//     console.error('Erreur lors de la création de l’annonce :', error);
//     res.status(500).json({ message: 'Erreur interne', error: error.message });
//   }
// });


// Routes
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/announcements', announcementRoutes);
app.use('/', authRoutes);
app.use('/userprofile', profilRoutes);

// Service des fichiers statiques
// app.use('/uploads', express.static(uploadsDir));

// Middleware 404 pour les routes inexistantes
app.use((req, res) => {
  console.log('Requête non trouvée :', req.method, req.path);
  res.status(404).json({ message: 'Route not found' });
});

// Démarrage du serveur
const port = 3500;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});

export default app;
