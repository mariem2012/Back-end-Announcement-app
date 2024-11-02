import express from 'express';
import AnnouncementController from '../controllers/announcementController.js';
import {addAnnouncementValidator, updateAnnouncementValidator, deleteAnnouncementValidator
} from '../middlewares/validators/announcementValidation.js';

const router = express.Router();

// Route pour créer une nouvelle annonce
router.post(
  '/',
  addAnnouncementValidator,
  AnnouncementController.create
);

// Route pour mettre à jour une annonce existante
router.put(
  '/:id',
  updateAnnouncementValidator,
  AnnouncementController.update
);

// Route pour supprimer une annonce
router.delete(
  '/:id',
  deleteAnnouncementValidator, // validation pour l'ID seulement
  AnnouncementController.delete
);

// Route pour obtenir une annonce spécifique par son ID
router.get(
  '/:id',
  AnnouncementController.getAnnouncement
);

// Route pour obtenir toutes les annonces avec option de filtrage par catégorie et utilisateur
router.get(
  '/',
  AnnouncementController.getAllAnnouncements
);

export default router;
