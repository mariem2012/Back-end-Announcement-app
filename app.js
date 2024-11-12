import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import categoryRoutes from './src/routes/categoryRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import announcementRoutes from './src/routes/announcementRoutes.js';
// import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  
};

// const corsOptions = {
//   origin: 'http://localhost:5173',
//   credentials: true,
// };



app.use(express.json())


app.use(cors(corsOptions));
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/announcements', announcementRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
  console.log('Requête reçue:', req.method, req.path);
  console.log('Corps de la requête:', req.body);
  next();
});

const port = 3500;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
