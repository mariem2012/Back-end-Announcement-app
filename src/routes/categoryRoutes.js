import express from 'express';
import CategoryController from '../controllers/categoryController.js';
import {
  addCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from '../middlewares/validators/categoryValidation.js';

const router = express.Router();

router.post('/add', addCategoryValidator, CategoryController.create);
router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);
router.put('/:id', updateCategoryValidator, CategoryController.update);
router.delete('/:id', deleteCategoryValidator, CategoryController.delete);

export default router;
