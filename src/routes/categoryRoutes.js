import express from 'express';
import CategoryController from '../controllers/categoryController.js';
import {
  addCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from '../middlewares/validators/categoryValidation.js';
import { authMiddleware, verifyRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  '/add',
  authMiddleware,
  verifyRole('ADMIN'),
  addCategoryValidator,
  CategoryController.create
);

router.get('/', authMiddleware, CategoryController.getAll);

router.get('/:id', authMiddleware, CategoryController.getById);

router.put(
  '/:id',
  authMiddleware,
  verifyRole('ADMIN'),
  updateCategoryValidator,
  CategoryController.update
);

router.delete(
  '/:id',
  authMiddleware,
  verifyRole('ADMIN'),
  deleteCategoryValidator,
  CategoryController.delete
);

export default router;
