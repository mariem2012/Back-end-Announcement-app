import express from 'express';
import bodyParser from 'body-parser';
import dotenv  from 'dotenv';
import categoryRoutes from './src/routes/categoryRoutes.js'
import userRoutes from './src/routes/userRoutes.js';

// import announcementRoutes from './src/routes/announcementRoutes.js'
// import authRoutes from './src/routes/authRoutes.js';
// import { errorHandler } from './middlewares/errorHandler';

dotenv.config();  

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
// app.use('/users', userRoutes);
// app.use('/api/announcements', announcementRoutes);


// app.use(errorHandler);

app.use((_req, res, _next) => {
  res.status(404).json({ message: 'Route not found' });
});



const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;