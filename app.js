// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import dotenv from 'dotenv';
// import categoryRoutes from './src/routes/categoryRoutes.js';
// import userRoutes from './src/routes/userRoutes.js';
// import announcementRoutes from './src/routes/announcementRoutes.js';
// import authRoutes from './src/routes/authRoutes.js';
// import profilRoutes from './src/routes/profilRoutes.js'
// dotenv.config();

// const app = express();

// const corsOptions = {
//   origin: 'http://localhost:5173',
// };

// app.use(express.json());


// app.use(cors(corsOptions));
// app.use('/users', userRoutes);
// app.use('/categories', categoryRoutes);
// app.use('/announcements', announcementRoutes);
// app.use('/', authRoutes);
// app.use('/userprofile', profilRoutes);

// app.use((req, res, next) => {
//   res.status(404).json({ message: 'Route not found' });
//   console.log('Requête reçue:', req.method, req.path);
//   console.log('Corps de la requête:', req.body);
//   next();
// });

// const port = 3500;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// export default app;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoryRoutes from './src/routes/categoryRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import announcementRoutes from './src/routes/announcementRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import profilRoutes from './src/routes/profilRoutes.js';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));

// Middleware JSON conditionnel pour éviter les erreurs avec les requêtes GET/DELETE
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH','DELETE'].includes(req.method)) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Routes
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/announcements', announcementRoutes);
app.use('/', authRoutes);
app.use('/userprofile', profilRoutes);

// Middleware pour gérer les routes inexistantes (404)
app.use((req, res) => {
  console.log('Requête reçue:', req.method, req.path);
  res.status(404).json({ message: 'Route not found' });
});

// Démarrage du serveur
const port = 3500;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
