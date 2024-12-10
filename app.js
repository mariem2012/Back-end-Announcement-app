import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoryRoutes from './src/routes/categoryRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import announcementRoutes from './src/routes/announcementRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import profilRoutes from './src/routes/profilRoutes.js';
import expressFileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';

dotenv.config();

const __dirname = path.resolve();
const app = express();
const uploadsDir = path.join(__dirname, 'uploads');

// Création du dossier "uploads" s'il n'existe pas
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Dossier "uploads" créé avec succès.');
}

// Configuration de CORS
const corsOptions = {
  origin: ['http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour gérer les fichiers avec express-fileupload
app.use(
  expressFileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // Taille maximale : 5MB
    abortOnLimit: true,
    useTempFiles: true, // Utilisation de fichiers temporaires
    tempFileDir: uploadsDir, // Dossier temporaire
    createParentPath: true,
  })
);


// Route pour le téléchargement de fichiers
app.post('/upload', async (req, res) => {
  try {
    // Vérifiez si des fichiers ont été envoyés
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Gestion de plusieurs fichiers
    const files = Array.isArray(req.files.upload) ? req.files.upload : [req.files.upload];

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const uploadedFiles = [];

    for (const file of files) {
      // Validation de l'extension
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({ message: `Invalid file type: ${ext}` });
      }

      // Nettoyage du nom et ajout d'un timestamp
      const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const imageName = `${Date.now()}_${sanitizedFilename}`;
      const uploadPath = path.join(uploadsDir, imageName);

      // Déplacement du fichier
      await file.mv(uploadPath);
      uploadedFiles.push(`http://localhost:3500/uploads/${imageName}`);
    }

    // Réponse avec les URL des fichiers uploadés
    return res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      imageUrl: uploadedFiles,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ message: 'Failed to upload file', error: error.message });
  }
});

// Routes principales
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/announcements', announcementRoutes);
app.use('/', authRoutes);
app.use('/userprofile', profilRoutes);

// Dossier "uploads" accessible publiquement
app.use('/uploads', express.static(uploadsDir));

app.use((req, res) => {
  console.log('Requête non trouvée :', req.method, req.path);
  res.status(404).json({ message: 'Route not found' });
});

const port = 3500;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});

export default app;
