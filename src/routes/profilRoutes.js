import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/profilController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUserProfile);

router.put('/', authMiddleware, updateUserProfile);

export default router;
