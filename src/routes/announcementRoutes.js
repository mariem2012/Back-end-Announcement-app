import express from 'express';
import AnnouncementController from '../controllers/announcementController.js';
import {
  addAnnouncementValidator,
  updateAnnouncementValidator,
  deleteAnnouncementValidator,
} from '../middlewares/validators/announcementValidation.js';

const router = express.Router();

router.post(
  '/',
  addAnnouncementValidator,           
  AnnouncementController.create        
);

router.put(
  '/:id',
  updateAnnouncementValidator,        
  AnnouncementController.update        
);

router.delete(
  '/:id',
  deleteAnnouncementValidator,         
  AnnouncementController.delete        
);

router.get(
  '/:id',
  AnnouncementController.getAnnouncement  
);

router.get(
  '/',
  AnnouncementController.getAllAnnouncements 
);

export default router;
