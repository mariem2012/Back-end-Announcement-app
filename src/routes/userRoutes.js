import express from 'express';
import UserController from '../controllers/userController.js';
import {
  addUserValidator,
  updateUserValidator,
  deleteUserValidator,
} from '../middlewares/validators/userValidation.js';


import { authMiddleware, verifyRole } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/add', authMiddleware, verifyRole(['ADMIN']), addUserValidator, UserController.create);
router.get('/', authMiddleware, verifyRole(['ADMIN']), UserController.getAll);
router.get('/:id', authMiddleware, UserController.getById);
router.put('/:id', authMiddleware, verifyRole(['ADMIN']),updateUserValidator, UserController.update);
router.delete('/:id', authMiddleware, verifyRole(['ADMIN']), deleteUserValidator, UserController.delete);
router.put('/user/change-password', authMiddleware, UserController.changePassword);
// router.get('/currentUser', authMiddleware, UserController.getCurrentUser);


export default router;
