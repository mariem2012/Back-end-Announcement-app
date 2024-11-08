import express from 'express';
import UserController from '../controllers/userController.js';
import {
  addUserValidator,
  updateUserValidator,
  deleteUserValidator,
} from '../middlewares/validators/userValidation.js';

const router = express.Router();

router.post('/add', addUserValidator, UserController.create);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.put('/:id', updateUserValidator, UserController.update);
router.delete('/:id', deleteUserValidator, UserController.delete);

export default router;
