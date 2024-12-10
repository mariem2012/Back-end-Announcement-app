import express from 'express';
import AnnouncementController from '../controllers/announcementController.js';
import {
  addAnnouncementValidator,
  updateAnnouncementValidator,
  deleteAnnouncementValidator,
} from '../middlewares/validators/announcementValidation.js';
import { authMiddleware, verifyRole } from '../middlewares/authMiddleware.js'; 

const router = express.Router();





router.post(
  '/',
  authMiddleware, 

  addAnnouncementValidator, AnnouncementController.create
);

router.put(
  '/:id',
  authMiddleware, updateAnnouncementValidator,
  AnnouncementController.update
);

router.delete(
  '/:id',
  authMiddleware,
  deleteAnnouncementValidator,
  AnnouncementController.delete
);

// Obtenir une annonce (Accessible par tous les rôles)
router.get('/:id', AnnouncementController.getAnnouncementById);

// Lister toutes les annonces (Accessible par tous les rôles)
router.get('/', AnnouncementController.getAllAnnouncements);
router.get('/annouceUser/:id', AnnouncementController.getAnnouncementByUserId);


export default router;
